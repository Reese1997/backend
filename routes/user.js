
const express = require('express')
const router = express.Router()
const User = require("../models/user");

const bcrypt = require("bcrypt");

const jwt = require('jsonwebtoken')
const { getUser } = require("../middleware/finders");
const auth = require("../middleware/auth");

// router.use(express.json())

router.get('/usertest', (req, res) => {
    res.send('user test success')
})

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
  router.get("/:id", getUser, (req, res, next) => {
    res.send(res.user);
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
    const { name, email, password, contact } = req.body;

    console.log(name, email, password,contact)
  
    const salt = await bcrypt.genSalt();
    console.log(salt)
    const hashedPassword = await bcrypt.hash(password, salt);
  
    const user = new User({
      name,
      email,
      password: hashedPassword,
      contact
    });
  
    try {
      const newUser = await user.save();
       console.log(newUser)
      try {
        const access_token = jwt.sign(
          JSON.stringify(newUser),
          process.env.MONGO_PASS
        );
        res.status(201).json({ jwt: access_token });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  
  // UPDATE a user
  router.put("/:id", getUser, async (req, res) => {
    const { name, password, about } = req.body;
    if (name) res.user.name = name;
    if (about) res.user.about = about;
    if (password) {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);
      res.user.password = hashedPassword;
    }
  
    try {
      const updatedUser = await res.user.save();
      res.status(201).send(updatedUser);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  
  // DELETE a user
  router.delete("/:id", getUser, async (req, res) => {
    try {
      await res.user.remove();
      res.json({ message: "Deleted user" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
//   //remove this
//     router.get("/appointments", getUser, (req, res, next) => {
//       res.send(res.user);
// //delete this

//  create appointment
 router.post("/:id/appointment", auth, async (req, res) => {
     const newAppointment = new Appointment(req.body);
  
     try {
       const savedAppointment = await newAppointment.save();
       res.status(200).json(savedAppointment);
     } catch (err) {
       res.status(500).json(err);
   }
   });
  
   //UPDATE an appointment
  router.put("/:id/appointment", auth, async (req, res) => {
    try {
      const updatedAppointment = await Appointment.findByIdAndUpdate(
        req.params.id,
        {
           $set: req.body,
         },
        { new: true }
       );
       res.status(200).json(updatedAppointment);
     } catch (err) {
      res.status(500).json(err);
     }
  });
  
   //DELETE from appointment
   router.delete("/:id/appointment", auth, async (req, res) => {
     try {
       await Cart.findByIdAndDelete(req.params.id);
       res.status(200).json("Appointment has been deleted...");
     } catch (err) {
       res.status(500).json(err);
     }
   });
module.exports = router