const mongoose = require("mongoose");
const { TurfyoADmin } = require("../../connection/Dbconnection");
const adminData =new  mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  number: {
    type: Number,
  },
  password: {
    type: String,
    required: true,
  },
});
module.exports = TurfyoADmin.model("admin", adminData);
