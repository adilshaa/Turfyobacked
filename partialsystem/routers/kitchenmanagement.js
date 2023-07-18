const express= require('express')
const Router=express()
const kitchenController=require("../controllers/kitchenmanagment");
const { verifyKitchenStaffs } = require('../../middlewares/auth/verifyToken');

Router.get("/fetchFoods",verifyKitchenStaffs, kitchenController.fetcheFoods);
Router.post("/listFoods/:id",verifyKitchenStaffs, kitchenController.listFoods);
Router.post("/loginStaff", kitchenController.Login);
Router.get("/verfiyStaff", verifyKitchenStaffs, kitchenController.verifyStaff);
module.exports = Router

