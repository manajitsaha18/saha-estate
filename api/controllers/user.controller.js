const userModel = require('../models/user.model');
const bcryptjs = require('bcryptjs');
const { errorHandler } = require('../utils/error');

async function updateUser(req, res, next) {
  if (req.user.id !== req.params.id) {
    return next(
      errorHandler(
        401,
        'You can update only your own account!'
      )
    );
  }

  try {
    if (req.body?.password) {
      req.body.password = bcryptjs.hashSync(
        req.body.password,
        10
      );
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      {
        returnDocument: 'after',
      }
    );

    if (!updatedUser) {
      return next(
        errorHandler(
          404,
          'User not found!'
        )
      );
    }

    const userObj = updatedUser.toObject();

    delete userObj.password;

    res.status(200).json(userObj);

  } catch (error) {
    next(error);
  }
}

module.exports = {
  updateUser,
};