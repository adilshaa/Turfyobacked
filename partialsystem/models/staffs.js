const mongoose = require("mongoose");
const { dbResAdmins } = require("../../connection/Dbconnection");

const StaffsData = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  place: {
    type: String,
    required: true,
  },
  number: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  photo: {
    type: String,
    // required: true,
  },
  dateofbirth: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  idproof: {
    type: String,
    // required: true,
  },
  resturantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "restaurant",
  },
  status: {
    type: Boolean,
    required: true,
  },
});

module.exports = dbResAdmins.model("staff", StaffsData);
