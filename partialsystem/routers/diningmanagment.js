const expres = require("express");
const Router = expres();

const diningController = require("../controllers/diningmanagment");
const { dinigStaffsVerify } = require("../../middlewares/auth/verifyToken");
Router.get("/fetchFoods", dinigStaffsVerify, diningController.fetchFoodsData);
Router.get("/loadTable", dinigStaffsVerify, diningController.loadTables);
Router.post("/dinigLogin", diningController.Login);
Router.get("/verifyStaff", dinigStaffsVerify, diningController.verifyStaff);
Router.get("/logoutStaff", dinigStaffsVerify, diningController.logout);
Router.post("/orderFoods", dinigStaffsVerify, diningController.orderFood);
Router.get("/allOrder", dinigStaffsVerify, diningController.getOrders);
Router.get("/updatingStatus/:id",dinigStaffsVerify,diningController.updateServeStatus);
Router.get("/filterFood/:id", dinigStaffsVerify, diningController.filterFoods);
module.exports = Router;
