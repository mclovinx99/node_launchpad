const express = require('express');
const Router = express.Router();
const add_user = require('../controller/login_signup');

Router
.route('/create')
.post(add_user.user)