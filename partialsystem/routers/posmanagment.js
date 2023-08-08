const express = require("express");
const Router = express();

const KitchenController = require("../controllers/posmanagment");
const { verifyPos } = require("../../middlewares/auth/verifyToken");
const posController = require("../controllers/posmanagment");

Router.post("/staffLogin", KitchenController.staffLogin);
Router.get("/VerifyPosStaff",verifyPos, KitchenController.VerifyStaff);
// Router.post("/generateQr",verifyPos,posController.generateQRCode);
Router.get("/proceedOrder/:id",verifyPos,posController.ProceedOrder);

module.exports = Router;
