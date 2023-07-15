const express = require("express");
const Router = express();
const multer = require("multer");

const resadminController = require("../controllers/resadminmanagmaent");
const storage = require("../../middlewares/multers/food-multer");
const food_img_Storage = require("../../middlewares/multers/food-multer");
const { tokenVerify } = require("../../middlewares/auth/verifyToken");
const foodDisk = multer({ storage: food_img_Storage });


Router.post("/addStaffs", tokenVerify, resadminController.addStaff);
Router.post("/verifyStaffs", tokenVerify, resadminController.verifyStaffs);
Router.post(
  "/addfood",
  tokenVerify,
  foodDisk.single("image"),
  resadminController.addFoods
);
Router.get("/verifyresadmin", tokenVerify, resadminController.validateResAdmin);
Router.get("/fetcheStaffs", tokenVerify, resadminController.fetchStaffs);
Router.get("/getStaff/:id", tokenVerify, resadminController.getStaff);
Router.post("/saveStaffEdits/:id", tokenVerify, resadminController.EditStaffs);
Router.get("/removeStaff/:id", tokenVerify, resadminController.removeStaff);
Router.post("/ControllerLogin", resadminController.ControlllerLogin);
Router.post("/googleLogin", resadminController.ControlllerLoginWithGoogle);
Router.get("/logout", tokenVerify, resadminController.LogoutAdmin);
Router.get("/KitchenStocks", tokenVerify, resadminController.fetchstocks);
Router.post("/addStock", tokenVerify, resadminController.addStocks);


module.exports = Router;
