const User = require('../modules/user_module'); 
const asyncHandler = require('express-async-handler');

// @desc    Create a new adress
// @route   POST /api/v1/adresses
// @access  Private/user
exports.create_adresses = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(
        req.user._id,
        { $addToSet: { adresses: req.body } },
        { new: true }
    );
    res.status(201).json({
        status: 'success',
        data: {
            adresses: user.adresses,
        }
    });
});

// @desc    Delete from adresses
// @route   DELETE /api/v1/adresses/:adressId
// @access  Private/user
exports.delete_adresses = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(
        req.user._id,
        { $pull: { adresses:{_id: req.params.adressId } }},
        { new: true }
    );
    res.status(200).json({
        status: 'success',
        data: {
            adresses: user.adresses,
        }
    });
});

// @desc    Get Logged User adresses
// @route   GET /api/v1/adresses
// @access  Private/user
exports.get_adresses = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id).populate('adresses');
    res.status(200).json({
        status: 'success',
        results: user.adresses.length,
        data: {
            adresses: user.adresses,
        }
    });
});
