const express = require("express");
const router = express.Router();
const { getUsers, changeRole, deleteUser } = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");


router.get("/", authMiddleware, getUsers);


router.put("/role/:id", authMiddleware, changeRole);


router.delete("/:id", authMiddleware, deleteUser);

module.exports = router;
