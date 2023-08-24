const mongoose = require("mongoose");
// const resoMdel = require("../models/restaurants");
require('dotenv').config()
let TurfyoADmin = mongoose.createConnection(process.env.MONGOOSE_OXRES_DATA, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let dbResAdmins = mongoose.createConnection(
  process.env.MONGOOSE_RESTAURANT_DATA,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

let dbKitchen = mongoose.createConnection(
  process.env.MONGOOSE_KITHCEN_DATA,

  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

let dbDining = mongoose.createConnection(
  process.env.MONGOOSE_DINING_DATA,

  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
module.exports = {
  TurfyoADmin: TurfyoADmin,
  dbResAdmins: dbResAdmins,
  dbKitchen: dbKitchen,
  dbDining:dbDining
};


