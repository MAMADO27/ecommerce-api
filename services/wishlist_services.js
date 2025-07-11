const User = require('../modules/user_module'); 
const asyncHandler = require('express-async-handler');

// @desc    Create a new wishlist
// @route   POST /api/v1/wishlist
// @access  Private/user
exports.create_wishlist = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(
        req.user._id,
        { $addToSet: { wishlist: req.body.productId } },
        { new: true }
    );
    res.status(201).json({
        status: 'success',
        data: {
            wishlist: user.wishlist,
        }
    });
});

// @desc    Delete from wishlist
// @route   DELETE /api/v1/wishlist/:productId
// @access  Private/user
exports.delete_wishlist = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(
        req.user._id,
        { $pull: { wishlist: req.params.productId } },
        { new: true }
    );
    res.status(200).json({
        status: 'success',
        data: {
            wishlist: user.wishlist,
        }
    });
});

// @desc    Get Logged User wishlist
// @route   GET /api/v1/wishlist
// @access  Private/user
exports.get_wishlist = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id).populate('wishlist');
    res.status(200).json({
        status: 'success',
        data: {
            wishlist: user.wishlist,
        }
    });
});
