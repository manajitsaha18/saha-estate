const imagekit = require('../utils/imagekit');

async function uploadImage(req, res, next) {
  try {

    console.log(req.file);

    if (!req.file) {
      return res.status(400).json({
        message: 'No file uploaded',
      });
    }

    const result = await imagekit.upload({
      file: req.file.buffer,
      fileName: Date.now() + '-' + req.file.originalname,
      folder: '/mern-estate',
    });

    console.log(result);

    res.status(200).json({
      success: true,
      url: result.url,
    });

  } catch (error) {
    console.log(error);
    next(error);
  }
}

module.exports = { uploadImage };