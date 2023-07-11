const mongoose = require("mongoose");
const { TurfyoADmin } = require("../../connection/connection");

const restaurantData = new mongoose.Schema({
  name: {
    type: String,
  },
  place: {
    type: String,
  },
  owner_name: {
    type: String,
  },
  owner_email: {
    type: String,
  },
  password: {
    type: String,
  },
  owner_number: {
    type: Number,
  },
  poc_doc: {
    type: String,
    // required:true,
  },
  registration_data: {
    type: Date,
    // required:true,
  },

  registration_id: {
    type: Date,
    // required:true,
  },
  restaurant_no: {
    type: Date,
    // required:true,
  },
  license: {
    type: Date,
    // required:true,
  },
  status: {
    type: Boolean,
  },
});

const data = TurfyoADmin.model("restaurant", restaurantData);
module.exports = data;
