const multer = require('multer');
const { uploadImageBuffer } = require('../utils/cloudinary');

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

const uploadToCloudinary = async (buffer) => {
  if (!buffer) {
    return '';
  }

  return uploadImageBuffer(buffer);
};

module.exports = {
  upload,
  uploadToCloudinary,
};
