const express = require("express");
const Router = express();

const KitchenController = require("../controllers/posmanagment");

Router.post("/staffLogin", KitchenController.staffLogin);


module.exports = Router;
