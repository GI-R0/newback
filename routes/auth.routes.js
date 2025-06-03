const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/auth.controller");
const { upload } = require("../config/cloudinary");

router.post("/register", upload.single("image"), register);

router.post("/login", login);

module.exports = router;
