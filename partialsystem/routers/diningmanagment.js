const expres = require("express")
const Router = expres()
const diningController=require("../controllers/diningmanagment")
Router.get("/fetchFoods", diningController.fetchFoodsData);
Router.get("/loadTable", diningController.loadTables);
Router.post("/dinigLogin",diningController.Login);
module.exports=Router