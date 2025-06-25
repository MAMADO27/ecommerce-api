const multer = require('multer');
const api_error = require('../utils/api_error');

const multer_options = () => {
        const multer_storage = multer.memoryStorage(); 
    const multer_filter = (req, file, cb) => {
        if (file.mimetype.startsWith('image')) {
            cb(null, true);
        } else {
            cb(new api_error('Not an image! Please upload an image.', 400), false);
        }
    };
    
    const upload = multer({ storage: multer_storage, fileFilter: multer_filter });
    return upload;
}


exports.upload_single_image = (fieldName) => multer_options().single(fieldName);




exports.upload_multiple_images = (array_of_fields) => multer_options().fields(array_of_fields);
