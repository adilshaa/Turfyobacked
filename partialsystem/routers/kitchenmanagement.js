const express= require('express')

const Router=express()
const kitchenController=require("../controllers/kitchenmanagment")

Router.get("/fetchFoods", kitchenController.fetcheFoods);
Router.post("/listFoods/:id", kitchenController.listFoods);
module.exports = Router

