const express = require("express");
const router = express.Router();
const { createProduct, getProducts, getProduct, updateProduct, deleteProduct } = require("../controllers/product.controller");
const { auth } = require("../middlewares/auth.middleware");
const { upload, handleMulterError } = require("../config/cloudinary");


router.get("/", getProducts);
router.get("/:id", getProduct);


router.post("/", auth, upload, handleMulterError, createProduct);
router.put("/:id", auth, upload, handleMulterError, updateProduct);
router.delete("/:id", auth, deleteProduct);

module.exports = router;
