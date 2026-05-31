const express = require('express');
const verifyToken = require('../utils/verifyUser');

const { updateUser, deleteUser, getUserListings, getUser } = require('../controllers/user.controller');

const router = express.Router();

router.put('/update/:id', verifyToken, updateUser);
router.delete('/delete/:id', verifyToken, deleteUser);
router.get('/listings/:id', verifyToken, getUserListings);
router.get('/:id', getUser);

module.exports = router;