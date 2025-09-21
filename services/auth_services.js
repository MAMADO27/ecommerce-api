const crypto = require('crypto');
const asyncHandler = require('express-async-handler');
const User = require('../modules/user_module');
const send_to_email = require('../utils/send_to_email');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const create_token = require('../utils/create_token');
const { sanitize_data } = require('../utils/sanitize_data');

const signup = asyncHandler(async (req, res, next) => {
    const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        confirm_password: req.body.confirm_password,
        role: req.body.role || 'user',
    });

   const token = create_token({ userId: user._id });
    user.password = undefined;

    res.status(201).json({
        status: 'success',
        token,
        data: { user: sanitize_data(user) },
    });
});

const login = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({email: req.body.email});
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
        return res.status(401).json({
            status: 'fail',
            message: 'Incorrect email or password',
        });
    }
    const token = create_token({ userId: user._id });
    res.status(200).json({
        status: 'success',
        token,
        data: { user: sanitize_data(user) },
    });
   
});
const protect = asyncHandler(async (req, res, next) => {
    console.log('🔐 [DEBUG] Authorization Header:', req.headers.authorization);

    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    
    } 
    

    if (!token) {
        return res.status(401).json({
            status: 'fail',
            message: 'You are not logged in! Please log in to get access.',
        });
    }

    // Check the secret
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
   
    
    const current_User = await User.findById(decoded.userId);
    if (!current_User) {
        return res.status(401).json({
            status: 'fail',
            message: 'The user belonging to this token does no longer exist.',
        });
    }

    if (current_User.password_change_at) {
        const passwordChangedAt = new Date(current_User.password_change_at).getTime() / 1000;
        if (decoded.iat < passwordChangedAt) {
            return res.status(401).json({
                status: 'fail',
                message: 'User recently changed password! Please log in again.',
            });
        }
    }

    req.user = current_User;
    next();
});


const forget_password = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(404).json({
            status: 'fail',
            message: 'There is no user with this email address.',
        });
        
    }
    // Generate a reset code
    const reset_code = Math.floor(100000 + Math.random() * 900000).toString();
    const hashed_reset_code = crypto.createHash('sha256').update(reset_code).digest('hex');
    console.log('🔑 [DEBUG] Reset Code:', reset_code);
    console.log('🔑 [DEBUG] Hashed Reset Code:', hashed_reset_code);
    user.reset_password_token = hashed_reset_code;
    user.reset_password_expires = Date.now() + 10 * 60 * 1000; // 10 minutes
    user.password_reset_verified = false;
    await user.save({ password_reset_verified: false });
    

     try{await send_to_email({
        email: user.email,
        subject: 'Your password reset code (valid for 10 minutes)',
        message:` Your password reset code is: ${reset_code}. It is valid for 10 minutes.`,
      
});
    } catch (error) {
        user.reset_password_token = undefined;
        user.reset_password_expires = undefined;
        await user.save({ validateBeforeSave: false });
        return res.status(500).json({
            status: 'fail',
            message: 'There was an error sending the email. Try again later!',
        });
    }
    // Send the reset code to the user's email
   

    res.status(200).json({
        status: 'success',
        message: 'Password reset code sent to your email.',
    });
   
});

const verify_reset_code = asyncHandler(async (req, res, next) => {
    const hashed_reset_code= crypto.createHash('sha256').update(req.body.reset_code).digest('hex');
    const user = await User.findOne({
        reset_password_token: hashed_reset_code,
        reset_password_expires: { $gt: Date.now() },
    });
    if (!user) {
        return res.status(400).json({
            status: 'fail',
            message: 'Invalid or expired reset code.',
        });
    }
    user.password_reset_verified = true;
    await user.save();
    res.status(200).json({
        status: 'success',
        message: 'Reset code verified successfully.',
    });
});
const reset_password = asyncHandler(async (req, res, next) => {
    const user= await User.findOne({email: req.body.email});
    if (!user) {
        return res.status(404).json({
            status: 'fail',
            message: 'There is no user with this email address.',
        });
    }
    if (!user.password_reset_verified) {
        return res.status(400).json({
            status: 'fail',
            message: 'Please verify your reset code first.',
        });
    }
   
    user.password = req.body.new_password;
    user.password_reset_verified=undefined;
    user.reset_password_token = undefined;
    user.reset_password_expires = undefined;
    user.password_change_at = Date.now();
    await user.save();
    const token = create_token({ userId: user._id });
    res.status(200).json({token});
    
    
    res.status(200).json({
        status: 'success',
        message: 'Password reset successfully.',
    });
});
module.exports = {
  signup,
  login,
  protect,
  forget_password,
  verify_reset_code,
  reset_password,
};


