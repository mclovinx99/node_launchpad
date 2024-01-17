const express = require('express');
const Router = express.Router();
const add_user = require('../controller/login_signup');

Router
.route('/create')
.post(add_user.user);

Router
.route('/image')
.post(add_user.upload);

module.exports = Router;