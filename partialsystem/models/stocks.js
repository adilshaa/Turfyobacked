const mongoose = require("mongoose");
const { dbKitchen } = require("../../connection/Dbconnection");

const stocksModel = new mongoose.Schema({
  name: {
    type: String,
    index: true,
  },
  quantity: {
    type: String,
    index: true,
  },
  AddingData: {
    type: Date,
    default: Date.now
  },
  expairy_Data: {
    type: Date,
    index: true,
  },
  price: {
    type: Number,
  },
  resturantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "restaurant",
  },
});

const Stock = dbKitchen.model("stocks", stocksModel);

module.exports = Stock;
