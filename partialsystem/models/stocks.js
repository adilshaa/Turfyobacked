const mongoose = require("mongoose");
const { dbKitchen } = require("../../connection/connection");

const stocksModel = mongoose.Schema({
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
  stockStatus: {
    type: Boolean,
    index: true,
  },
});

module.exports = dbKitchen.model("stocks", stocksModel);
