const express= require('express')
const Router=express()
const kitchenController=require("../controllers/kitchenmanagment");
const { verifyKitchenStaffs } = require('../../middlewares/auth/verifyToken');

Router.get("/fetchFoods",verifyKitchenStaffs, kitchenController.fetcheFoods);
Router.post(
  "/updateStock/:id",
  verifyKitchenStaffs,
  kitchenController.listFoods
);
Router.post("/loginStaff", kitchenController.Login);
Router.get("/verfiyStaff", verifyKitchenStaffs, kitchenController.verifyStaff);
Router.get("/fetchOrders",verifyKitchenStaffs,kitchenController.fetchOrders);

Router.get("/logoutStaff", verifyKitchenStaffs, kitchenController.logout);
module.exports = Router

