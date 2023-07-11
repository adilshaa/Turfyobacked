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

const PORT = 5000;



const path = require("path");
const { log } = require("console");
app.use(express.static(path.join(__dirname, "public")));

const server = app.listen(PORT, () => {
  console.log("connected");
});


const socket = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});



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



socket.on("connection", (socket) => {
  console.log(socket.id);
  console.log("socket connected");
  socket.emit("hello", {
    name: "Emitted",
  });
});


module.exports = {
  app,
};
