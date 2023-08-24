const express = require("express");
const Router = express();

const KitchenController = require("../controllers/posmanagment");
const { verifyPos } = require("../../middlewares/auth/verifyToken");
const posController = require("../controllers/posmanagment");

Router.post("/staffLogin", KitchenController.staffLogin);
Router.get("/VerifyPosStaff",verifyPos, KitchenController.VerifyStaff);
// Router.post("/generateQr",verifyPos,posController.generateQRCode);
Router.post("/proceedOrder/:id",verifyPos,posController.ProceedOrder);
Router.post("/filterSales", verifyPos, posController.filterSales);
Router.get("/currentOrder/:id",verifyPos,posController.takeCurrentorder);
module.exports = Router;
