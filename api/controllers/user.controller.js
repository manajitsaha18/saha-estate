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

async function deleteUser(req, res, next) {
  if (req.user.id !== req.params.id) {
    return next(
      errorHandler(
        401,
        'You can delete only your own account!'
      )
    );
  }

  try {
    const deletedUser =
      await userModel.findByIdAndDelete(
        req.params.id
      );

    if (!deletedUser) {
      return next(
        errorHandler(
          404,
          'User not found!'
        )
      );
    }

    res
      .clearCookie('access_token')
      .status(200)
      .json({
        message:
          'User deleted successfully!',
      });

  } catch (error) {
    next(error);
  }
}


module.exports = { updateUser, deleteUser };