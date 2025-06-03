const express = require("express");
const router = express.Router();
const { getUsers, changeRole, deleteUser } = require("../controllers/user.controller");
const { auth } = require("../middlewares/auth.middleware");

router.get("/", auth, getUsers);

router.put("/role/:id", auth, changeRole);

router.delete("/:id", auth, deleteUser);

module.exports = router;
