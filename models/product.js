const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: false,
    default: "https://media.gq.com/photos/58c816fc57d9641cec279164/master/w_1280,c_limit/comme-nike-vapormax.jpg",
  },
  price:{
    type: Number,
    required:true,
  },
  date: {
    type: Date,
    required: false,
    default: Date.now,
  },
  author: {
      type: String
  }
});

module.exports = mongoose.model("Product", productSchema);
