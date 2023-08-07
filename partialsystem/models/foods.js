const mongoose = require("mongoose");
const { dbKitchen } = require("../../connection/Dbconnection");

const foodsData = new mongoose.Schema({
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "foodcategory",
  },
  price: {
    
    type: Number,
  },
  image: {
    type: String,
  },
  status: {
    type: Boolean,
  },
  stock: {
    type: Number,
    default: 0,
  },
  resturantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "restaurant",
  },
});
const Food = dbKitchen.model("food", foodsData);
module.exports = Food;
