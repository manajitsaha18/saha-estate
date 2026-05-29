const express = require('express');
const upload = require('../middleware/upload');
const { uploadImage } = require('../controllers/upload.controller');

const router = express.Router();
console.log(upload);
console.log(uploadImage);
router.post(
  '/',
  upload.single('image'),
  uploadImage
);

module.exports = router;