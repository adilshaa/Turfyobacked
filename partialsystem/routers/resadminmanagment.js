const express = require("express");
const Router = express();
const multer = require("multer");

const resadminController = require("../controllers/resadminmanagmaent");
const storage = require("../../middlewares/food-multer");
const food_img_Storage = require("../../middlewares/food-multer");
const foodDisk = multer({ storage: food_img_Storage });

Router.post("/addStaffs", resadminController.addStaff);
Router.post("/verifyStaffs", resadminController.verifyStaffs);
Router.post("/addfood", foodDisk.single("image"), resadminController.addFoods);
Router.get("/verifyresadmin", resadminController.validateResAdmin);
Router.get("/fetcheStaffs", resadminController.fetchStaffs);
Router.get("/getStaff/:id", resadminController.getStaff);
Router.post("/saveStaffEdits/:id",resadminController.EditStaffs);
Router.get("/removeStaff/:id", resadminController.removeStaff);
Router.post("/ControllerLogin",resadminController.ControlllerLogin);
Router.post("/ControllerLoginGoogle", resadminController.ControlllerLoginWithGoogle);
Router.get("/logout", resadminController.LogoutAdmin);
Router.get("/KitchenStocks", resadminController.fetchstocks);
Router.post("/addStock",resadminController.addStocks);
// Router.get("/fetchFoods",resadminController.fetchFoods);
module.exports = Router;
