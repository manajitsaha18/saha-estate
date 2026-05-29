const express = require('express');
const verifyToken = require('../utils/verifyUser');

const { updateUser, deleteUser } = require('../controllers/user.controller');

const router = express.Router();

router.put('/update/:id', verifyToken, updateUser);
router.delete('/delete/:id', verifyToken, deleteUser);

module.exports = router;