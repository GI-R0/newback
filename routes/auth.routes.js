const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/auth.controller");
const { upload, handleMulterError } = require("../config/cloudinary");

router.post("/register", upload, handleMulterError, register);

router.post("/login", login);

module.exports = router;
