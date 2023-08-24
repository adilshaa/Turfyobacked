const { Schema, default: mongoose } = require("mongoose");
const { dbDining } = require("../../connection/Dbconnection");
const TablesModel = new Schema({
  table_Name: {
    type: String,
    requried: true,
  },
  table_No: {
    type: Number,
  },
  table_status: {
    type: Boolean,
  },
  restaurant_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "restaurant",
  },
});
const Table = dbDining.model("table", TablesModel);

module.exports = Table;
