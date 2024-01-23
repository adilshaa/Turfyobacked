const express = require("express");
const cors = require("cors");
const app = express();
const body_parser = require("body-parser");
const helmet = require("helmet");

app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: true }));

const restaurantRouter = require("./mainsystem/routers/restaurants");
const superAdminRouter = require("./mainsystem/routers/admin");
const resAdminRouter = require("./partialsystem/routers/resadminmanagment");
const diningRouter = require("./partialsystem/routers/diningmanagment");
const kitcheRouter = require("./partialsystem/routers/kitchenmanagement");
const posRouter = require("./partialsystem/routers/posmanagment");
const SocketController = require("./partialsystem/controllers/socketControllers");

const path = require("path");
app.use(express.static(path.join(__dirname, "public")));

const PORT = 5000;

const server = app.listen(PORT, () => {
  console.log("connected");
});

SocketController(server);


app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "trusted-scripts.com"],
      // Add other directives as needed
    },
  })
);

app.use(
  cors({
    credentials: true,
    origin: [
      // "http://localhost:4200", // pOS application
      // "http://localhost:3200", //  super admin app
      // "http://localhost:2200", //  restaurant control app
      // "http://localhost:1200", // kitchen  app
      // "http://localhost:5200", // dining app
      
      "https://oxres-kitchen.netlify.app", // pOS application
      "https://oxres-superadmin.netlify.app", //  super admin app
      "https://oxres-rescontrols.netlify.app", //  restaurant control app
      "https://oxres-pos.netlify.app", // kitchen  app
      "https://oxres-dining.netlify.app", // dining app
    ],
  })
);

app.use("/restaurants", restaurantRouter);
app.use("/superadmin", superAdminRouter);
app.use("/resadmin", resAdminRouter);
app.use("/dining", diningRouter);
app.use("/kitchen", kitcheRouter);
app.use("/pos", posRouter);

module.exports = {
  app,
};
