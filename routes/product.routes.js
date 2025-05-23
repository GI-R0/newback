const express = require("express");
const router = express.Router();
const { createProduct, getProducts, getProduct, updateProduct, deleteProduct } = require("../controllers/product.controller");
const authMiddleware = require("../middlewares/auth.middleware");


router.post("/", authMiddleware, createProduct);
router.get("/", getProducts);
router.get("/:id", getProduct);
router.put("/:id", authMiddleware, updateProduct);
router.delete("/:id", authMiddleware, deleteProduct);

module.exports = router;
