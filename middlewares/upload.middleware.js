const multer = require('multer');
const { cloudinary } = require('../config/cloudinary');

const storage = multer.diskStorage({});
const upload = multer({ storage });

module.exports = upload;
