var slugify = require('slugify');
const User = require('../modules/user_module'); 
const asyncHandler = require('express-async-handler');
const api_error = require('../utils/api_error');
const api_fetchers = require('../utils/api_fetchers');
const factory = require('../services/handler_factory');
const mongoose = require('mongoose');
const { upload_single_image } = require('../middelware/uploud_image_midelware');
const multer = require('multer');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const create_token = require('../utils/create_token');


exports.uploud_user_image = upload_single_image('image'); 

exports.resize_user_image = async (req, res, next) => {
    if (!req.file) return next();
    const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;
    await sharp(req.file.buffer)
        .resize(500, 500)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`uploads/categories/users/${filename}`);
    req.body.image = filename;
    next();
};

// @ desc    Get all users
// @ route   GET /api/v1/users
// @ access  Public
exports.get_users = factory.get_all(User, 'users');

// @ desc    Get a single user
// @ route   GET /api/v1/users/:id
// @ access  Public
exports.get_user = factory.get_one(User);

// @ desc    Create a new user
// @ route   POST /api/v1/users
// @ access  Private
exports.create_user = factory.create_one(User);

// @ desc    Update a user
// @ route   PUT /api/v1/users/:id
// @ access  Private
exports.update_user = asyncHandler(async (req, res, next) => {
    const id = req.params.id;
    const { name } = req.body;
    const document = await User.findByIdAndUpdate(
        req.params.id,
        {name: req.body.name, image: req.body.image,slug: req.body.slug,phone: req.body.phone, email: req.body.email, profile_image: req.body.profile_image, role: req.body.role},
        { new: true }
    );
    if (!document) {
        return next(new api_error('document not found', 404));
    }
    res.status(200).json({ data: document });
});

exports.change_user_password = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new api_error('User not found', 404));

  user.password = await bcrypt.hash(req.body.password, 12);
  user.password_change_at = Date.now();
  await user.save();

  res.status(200).json({ message: 'Password updated successfully' });
});

// @ desc    Delete a user
// @ route   DELETE /api/v1/users/:id
// @ access  Private
exports.delete_user = factory.delete_one(User);

// @ desc    Get user mydata
// @ route   GET /api/v1/users/mydata
// @ access  Protected
exports.get_my_data = asyncHandler(async (req, res, next) => {
   req.params.id = req.user._id.toString(); 
   next();
});

exports.change_my_password = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user) return next(new api_error('User not found', 404));

  user.password = await bcrypt.hash(req.body.password, 12);
  user.password_change_at = Date.now();
  await user.save();

  const token = create_token({ userId: user._id });
  res.status(200).json({ message: 'Password updated successfully', token });
});
 exports.update_my_data = asyncHandler(async (req, res, next) => {
  const update_user = await User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      image: req.body.image,
      slug: req.body.slug,
      phone: req.body.phone,
      email: req.body.email,
      profile_image: req.body.profile_image,
     
    },
    { new: true }
  );
  res.status(200).json({
    status: 'success',
    data: {
      user: update_user
    }
  });
});


// @ desc    Delete my account 
// @ route   DELETE /api/v1/users/delete_me
// @ access  Protected

exports.delete_my_account = asyncHandler(async (req, res, next) => {
    await User.findByIdAndDelete(req.user._id),{active: false};
    res.status(204).json({
        status: 'success',
        data: null
    });
});