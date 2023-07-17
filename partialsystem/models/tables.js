const { Schema, default: mongoose } = require("mongoose");
const { dbDining } = require("../../connection/Dbconnection");
const TablesModel = new Schema({
  table_Name: {
    type: String,
    rwquried: true,
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
module.exports = dbDining.model("table", TablesModel);
