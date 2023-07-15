const mongoose = require("mongoose");
const { dbKitchen } = require("../../connection/connection");


const foodsData = mongoose.Schema({
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  category: {
    type: String,
  },
  price: {
    type: Number,
  },
  image: {
    type:String
  },
  status: {
    type:Boolean
  },
  resturantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "restaurant",
  },
});
module.exports = dbKitchen.model("foods", foodsData);