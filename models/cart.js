
const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  user_id:{
    type: String
  }
  ,
  cart:{
      type: Array,
      default:[]
  },
});

module.exports = mongoose.model("Cart", cartSchema);
