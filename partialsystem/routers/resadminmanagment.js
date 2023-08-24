const express = require("express");
const Router = express();
const multer = require("multer");

const resadminController = require("../controllers/resadminmanagmaent");
const storage = require("../../middlewares/multers/food-multer");
const food_img_Storage = require("../../middlewares/multers/food-multer");
const { resAdmintokenVerify } = require("../../middlewares/auth/verifyToken");
const foodDisk = multer({ storage: food_img_Storage });

Router.post("/addStaffs", resAdmintokenVerify, resadminController.addStaff);
Router.post(
  "/verifyStaffs",
  resAdmintokenVerify,
  resadminController.verifyStaffs
);
Router.post(
  "/addfood",
  resAdmintokenVerify,
  foodDisk.single("image"),
  resadminController.addFoods
);

Router.post(
  "/editImage/:id",
  resAdmintokenVerify,
  foodDisk.single("image"),
  resadminController.editFoodImage
);
Router.post(
  "/editFoodCnt/:id",
  resAdmintokenVerify,
  resadminController.editFoodCnt
);
Router.get(
  "/filterFood/:id",
  resAdmintokenVerify,
  resadminController.filterFoods
);
Router.get(
  "/verifyresadmin",
  resAdmintokenVerify,
  resadminController.validateResAdmin
);
Router.post(
  "/addfoodCategory",
  resAdmintokenVerify,
  resadminController.AddFoodCategory
);
Router.get(
  "/fetcheStaffs",
  resAdmintokenVerify,
  resadminController.fetchStaffs
);
Router.get("/getStaff/:id", resAdmintokenVerify, resadminController.getStaff);
Router.post(
  "/saveStaffEdits/:id",
  resAdmintokenVerify,
  resadminController.EditStaffs
);
Router.get(
  "/removeStaff/:id",
  resAdmintokenVerify,
  resadminController.removeStaff
);
Router.post("/ControllerLogin", resadminController.ControlllerLogin);
Router.post("/googleLogin", resadminController.ControlllerLoginWithGoogle);
Router.get(
  "/KitchenStocks",
  resAdmintokenVerify,
  resadminController.fetchstocks
);
Router.post("/addStock", resAdmintokenVerify, resadminController.addStocks);
Router.get(
  "/loadEditableStock/:id",
  resAdmintokenVerify,
  resadminController.loadEditStock
);
Router.post(
  "/updateStock/:id",
  resAdmintokenVerify,
  resadminController.updateStcok
);
Router.get("/createTable", resAdmintokenVerify, resadminController.createTable);
Router.delete("/deletetable/:id",resAdmintokenVerify,resadminController.delteTable);
Router.get("/getTables", resAdmintokenVerify, resadminController.getTables);
Router.get("/logout", resAdmintokenVerify, resadminController.LogoutAdmin);

module.exports = Router;
