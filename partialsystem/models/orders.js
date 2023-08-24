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
    type: String,
    default: "pendding",
  },
  orderId: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    default: Date.now, // This will set the expiration time to the current date and time by default
    expires: "1444m", // The 'expires' option is set to '30m' to automatically delete the document after 30 minutes
  },
});

const Order = dbDining.model("order", orderModel);

module.exports = Order;
