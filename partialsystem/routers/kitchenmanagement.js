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
 
Router.get("/readyFood/:id", verifyKitchenStaffs, kitchenController.OrderReady);
Router.get("/listCategory",verifyKitchenStaffs,kitchenController.listCategory);
Router.get("/logoutStaff", verifyKitchenStaffs, kitchenController.logout);
module.exports = Router

