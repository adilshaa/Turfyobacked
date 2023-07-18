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
  expairy_Data: {
    type: Date,
    index: true,
  },
  resturantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "restaurant",
  },
  stockStatus: {
    type: Boolean,
    index: true,
  },
});

const Stock = dbKitchen.model("stocks", stocksModel);

module.exports = Stock;
