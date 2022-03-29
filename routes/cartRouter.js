
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Cart = require("../models/cart");
var ObjectId = require('mongodb').ObjectId;


const { getUser, getProduct } = require("../middleware/finders");

//getting all items in cart
router.get("/", auth, async (req, res, next) => {
  try {
    const cart = await Cart.find({ user_id: { $regex: req.user._id } });
    res.status(201).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Adds a new item to the users cart
router.post("/:id", [auth, getProduct], async (req, res, next) => {

  // console.log(user)
  let product_id = res.product._id;
  let title = res.product.title;
  let category = res.product.category;
  let description = res.product.description
  let img = res.product.img;
  let price = res.product.price;
  let quantity = req.body;
  let user_id = req.user._id;
  const carts = new Cart({

     product_id,
   title,
   category,
   description,
   img,
   price ,
   quantity,
   user_id,
  })
  try {
    carts.cart.push({
    
      product_id,
      title,
      category,
      description,
      img,
      price,
      quantity,

    });
    const updatedCart = await carts.save();
    res.status(201).json(updatedCart);
  } catch (error) {
    res.status(500).json(console.log(error));
  }
});


//Delete single cart
router.delete('/single', auth, async(req, res, next)=>{

  try {
    const id = req.body
    const cart = await Cart.findByIdAndDelete({_id : ObjectId(id)});
    res.json({ message: "Deleted cart" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
})
//clears the user cart
router.delete("/", auth, async (req, res, next) => {
  try {
    const cart = await Cart.deleteMany({ user_id: { $regex: req.user._id } });
    res.json({ message: "Deleted cart" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;