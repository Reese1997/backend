require("dotenv").config;

const express = require("express");
const User = require("../models/user");
const auth = require("../middleware/auth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getUser, getProduct } = require("../middleware/finders");
const { update } = require("../models/user");

const router = express.Router();

// GET all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// GET one user
router.get("/oneuser/", auth,async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
  res.status(201).json(user)
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// LOGIN user with email + password
router.patch("/", async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) res.status(404).json({ message: "Could not find user" });
  if (await bcrypt.compare(password, user.password)) {
    try {
      const access_token = jwt.sign(
        JSON.stringify(user),
        process.env.JWT_SECRET_KEY
      );
      res.status(201).json({ jwt: access_token });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res
      .status(400)
      .json({ message: "Email and password combination do not match" });
  }
});

// REGISTER a user
router.post("/", async (req, res, next) => {
  const { fullname, email, password, phone_number } = req.body;

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = new User({
    fullname,
    email,
    phone_number,
    password: hashedPassword,
  });

  try {
    const newUser = await user.save();

    try {
      const access_token = jwt.sign(
        JSON.stringify(newUser),
        process.env.JWT_SECRET_KEY
      );
      res.status(201).json({ jwt: access_token });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});



router.put('/', auth, async (req, res, next)=>{
  // Get user from DB using Schema
  const user = await User.findById(req.user._id)

  // Get info needed to update user
  const { fullname, phone_number, password } = req.body;

  // Set information
  if (fullname) user.fullname = fullname;
  if (phone_number) user.phone_number = phone_number;
  if (password) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    user.password = hashedPassword;
  }
 

  try {
    const updatedUser = await user.save();

    try {
      const access_token = jwt.sign(
        JSON.stringify(updatedUser),
        process.env.JWT_SECRET_KEY
      );
      res.status(201).json({ jwt: access_token, user: updatedUser });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
    // Dont just send user as object, create a JWT and send that too.
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
})

// DELETE a user
router.delete("/", auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
    await user.remove();
    res.json({ message: "Deleted user" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
//getting all items in cart
router.get("/cart", auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
  res.status(201).json(user.cart)
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

});

//Adds a new item to the users cart
router.post("/:id/cart", [auth, getProduct], async (req, res, next) => {

  //  console.log(req.user)
//  const user1 = req.user[0]
//  console.log('usser1 is '+ user1)
  const user = await User.findById(req.user._id);
  // console.log(user)
  let product_id = res.product._id;
  let title = res.product.title;
  let category = res.product.category;
  let img = res.product.img;
  let price = res.product.price;
  let quantity = req.body;
  let created_by = req.user._id;

  try {
    // console.log(Array.isArray(user.cart))
    // user.cart = []
    user.cart.push({
      product_id,
      title,
      category,
      img,
      price,
      quantity,
      created_by,
    });
    const updatedUser = await user.save();
    res.status(201).json(updatedUser);
  } catch (error) {
    res.status(500).json(console.log(error));
  }
});
//updates the items in the users cart
router.put("/cart", [auth, getProduct], async (req, res, next) => {
  const user = await User.findById(req.user._id);
  const inCart = user.cart.some((prod) => prod._id == req.params.id);
  if (inCart) {
    product.quantity += req.body.quantity;
    const updatedUser = await user.save();
    try {
      res.status(201).json(updatedUser.cart);
    } catch (error) {
      res.status(500).json(console.log(error));
    }
  } else {
    try {
      // console.log(Array.isArray(user.cart))
      // user.cart = []
      let product_id = res.product._id;
      let title = res.product.title;
      let category = res.product.category;
      let img = res.product.img;
      let price = res.product.price;
      let quantity = req.body;
      let created_by = req.user._id;
      user.cart.push({
        product_id,
        title,
        category,
        img,
        price,
        quantity,
        created_by,
      });
      const updatedUser = await user.save();
      res.status(201).json(updatedUser.cart);
    } catch (error) {
      res.status(500).json(console.log(error));
    }
  }
});
//clears the user cart
router.delete("/cart", [auth, getProduct], async (req, res, next) => {
  
});
module.exports = router;
