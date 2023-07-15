const express = require("express");
const cors = require("cors");
const app = express();
const body_parser = require("body-parser");

app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: true }));

const restaurantRouter = require("./mainsystem/routers/restaurants");
const superAdminRouter = require("./mainsystem/routers/admin");
const resAdminRouter = require("./partialsystem/routers/resadminmanagment");
const diningRouter = require("./partialsystem/routers/diningmanagment");
const kitcheRouter = require("./partialsystem/routers/kitchenmanagement");
const SocketController=require("./partialsystem/controllers/socketControllers")



const path = require("path");
app.use(express.static(path.join(__dirname, "public")));


const PORT = 5000;


const server = app.listen(PORT, () => {
  console.log("connected");
});

SocketController(server);

app.use(
  cors({
    credentials: true,
    origin: [
      "http://localhost:5200",
      "http://localhost:4200",
      "http://localhost:3200",
      "http://localhost:2200",
      "http://localhost:1200",
    ],
  })
);


app.use("/restaurants", restaurantRouter);
app.use("/superadmin", superAdminRouter);
app.use("/resadmin", resAdminRouter);
app.use("/dining", diningRouter);
app.use("/kitchen", kitcheRouter);




module.exports = {
  app,
};
