const mongoose = require("mongoose");
// const resoMdel = require("../models/restaurants");

let TurfyoADmin = mongoose.createConnection("mongodb://127.0.0.1:27017/turfyoData", {
   
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
let dbResAdmins= mongoose.createConnection(`mongodb://127.0.0.1:27017/adminsData`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
let dbKitchen = mongoose.createConnection(`mongodb://127.0.0.1:27017/kitchensData`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = {
  TurfyoADmin: TurfyoADmin,
  dbResAdmins: dbResAdmins,
  dbKitchen:dbKitchen
};
