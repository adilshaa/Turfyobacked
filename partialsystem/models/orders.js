const mongoose = require("mongoose");
const { dbDining } = require("../../connection/Dbconnection");

const orderModel = new mongoose.Schema({
  tableId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "table",
    required: true,
  },
  staffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "staff",
    required: true,
  },
  resId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "restaurant",
    required: true,
  },
  foods: [
    {
      food_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "food",
        required: true,
      },
      food_quantity: {
        type: Number,
        default: 1,
      },
      food_totalprice: {
        type: Number,
      },
      note: {
        type: String,
      },
    },
  ],
  total_price: {
    type: Number,
  },
  order_status: {
    type: Boolean,
  },
  cooking_Status: {
    type: Boolean,
    default:true
  },
});

const Order = dbDining.model("order", orderModel);

module.exports = Order;
