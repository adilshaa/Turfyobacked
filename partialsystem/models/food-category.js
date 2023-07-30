const mongoose = require("mongoose");
const { dbKitchen } = require("../../connection/Dbconnection");

const FoodCategoryModel = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  resId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "restaurant",
  },
});

const FoodCategory = dbKitchen.model("foodcategory", FoodCategoryModel);
module.exports = FoodCategory;
