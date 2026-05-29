const express = require('express');
const verifyToken = require('../utils/verifyUser');

const {
  updateUser,
} = require('../controllers/user.controller');

const router = express.Router();

router.put(
  '/update/:id',
  verifyToken,
  updateUser
);

module.exports = router;