const express = require("express");
const Product = require("../models/product");
const auth = require("../middleware/auth");
const { getProduct } = require("../middleware/finders");

const router = express.Router();

// GET all posts
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    return res.status(201).send(products);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
});

// GET one post
router.get("/:id", getProduct, (req, res) => {
  res.send(res.product);
});

// CREATE a product
router.post("/", auth, async (req, res, next) => {
  const { title, category, description, price ,author} = req.body;

  let product = new Product({
    title,
    category,
    description,
    price,
    author
  })

  console.log(product)

  try {
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// UPDATE a product
router.put("/:id", getProduct, async (req, res, next) => {
  if (req.user._id !== res.product.author)
    res
      .status(400)
      .json({ message: "You do not have the permission to update products" });
  const { title, description, category, price } = req.body;
  if (title) res.product.title = title;
  if (description) res.product.description = description;
  if (category) res.product.category = category;
  if (price) res.product.price = price;

  try {
    const updatedProduct = await res.product.save();
    res.status(201).send(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE a product
router.delete("/:id", getProduct, async (req, res) => {
  if (req.user._id !== res.product.author)
    res
      .status(400)
      .json({ message: "You do not have the permission to delete products" });
  try {
    await res.product.remove();
    res.json({ message: "Deleted product" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
