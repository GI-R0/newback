const express = require("express");
const router = express.Router();
const { getUsers, changeRole, deleteUser } = require("../controllers/user.controller");
const { auth } = require("../middlewares/auth.middleware");
const { isAdmin, esMismoUsuarioOAdmin } = require("../middlewares/role.middleware");


router.get("/", auth, isAdmin, getUsers);
router.put("/role/:id", auth, isAdmin, changeRole);
router.delete("/:id", auth, isAdmin, deleteUser);


router.put("/:id", auth, esMismoUsuarioOAdmin, updateUser);

module.exports = router;
