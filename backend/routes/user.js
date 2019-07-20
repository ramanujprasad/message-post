const express = require('express');
const router = express.Router();
const UserController = require('../controller/user');

router.post('/api/user/signup', UserController.createUser);

router.post('/api/user/login', UserController.userLogin);

module.exports = router;
