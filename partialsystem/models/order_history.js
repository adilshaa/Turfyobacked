const mongoose = require("mongoose");
const data = require("../../mainsystem/models/restaurants");
const { dbResAdmins } = require("../../connection/Dbconnection");

const OrderhistoryModel = new mongoose.Schema({
  order_Staff: [
    {
      staff_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "staff",
        required: true,
      },
      res_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "restaurant",
      },
    },
  ],
  res_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "restaurant",
    required: true,
  },
  order_data: {
    type: Date,
    default: Date.now, // This will set the expiration time to the current date and time by default
  },
  Order_id: {
    type: String,
    required: true,
  },
  Total_order_Amount: {
    type: Number,
    required: true,
  },
  Total_foods: {
    type: Number,
  },
  Ordered_foods: [
    {
      food_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "food",
      },
      food_Name: {
        type: String,
      },
      food_quantity: {
        type: String,
      },
      food_amount: {
        type: String,
      },
    },
  ],
  payment_method: {
    type: String,
  },
});
const Order_history = dbResAdmins.model("Order_history", OrderhistoryModel);
module.exports = Order_history;
