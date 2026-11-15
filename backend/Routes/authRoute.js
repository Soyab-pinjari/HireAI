const express = require("express");
const { register, login, logout } = require("../Controller/authController");
const { checkAuth } = require("../Middleware/auth");
const {authenticate}= require("../Middleware/auth")
const router = express.Router();


router.post('/register',register);
router.post('/login',login);

router.post('/logout',logout);

router.get("/check-auth", authenticate, checkAuth);
module.exports=router;