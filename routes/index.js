const express = require('express');
const Router = express.Router();
const add_user = require('../controller/login_signup');

Router
.route('/create')
.post(add_user.create_admin);

Router
.route('/image')
.post(add_user.upload);

Router
.route('/login')
.post(add_user.login);

module.exports = Router;