const Staff = require("../models/staffs");
const Restaurnt = require("../../mainsystem/models/restaurants");
const Order_history = require("../models/order_history");
const Order = require("../models/orders");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const https = require("https");
const PaytmChecksum = require("PaytmChecksum");
const Table = require("../models/tables");

const secretkey = process.env.RES_POS_TOKEN;
const posController = {
  async staffLogin(req, res) {
    try {
      if (!req.body)
        return res.status(404).send({ message: "Resourses are not found" });
      const { email, password } = req.body;
      const retriveStaff = await Staff.findOne({ email: email }).exec();
      if (!retriveStaff)
        return res.status(404).send({ message: "Email is incorrect" });
      let encodePas = await bcrypt.compare(password, retriveStaff.password);
      if (!encodePas)
        return res.status(404).send({ message: "Password is incorrect" });
      const { _id, resturantId } = retriveStaff.toJSON();
      const payload = {
        id: _id,
        resId: resturantId,
      };
      const gernerateToken = jwt.sign(payload, secretkey, {
        expiresIn: "1h",
      });
      if (!gernerateToken)
        return res.status(400).send({ message: "your not authenticated " });
      const updateStaff = await Staff.updateOne(
        {
          _id: _id,
        },
        { $set: { status: true } }
      );
      if (!updateStaff)
        return res.status(400).send({ message: "your not authenticated " });
      const resData = await Restaurnt.findOne({
        _id: retriveStaff.resturantId,
      });
      if (!resData)
        return res.status(400).send({ message: "Your not a staff" });
      if (resData.status != true)
        return res.status(400).send({ message: "Restaurant Not opened" });
      res.send({
        resId: resData._id,
        token: gernerateToken,
        message: "success",
      });
    } catch (error) {
      console.log(error);
      return res.status(400).send({ message: "Somthing went worng" });
    }
  },
  async VerifyStaff(req, res) {
    try {
      const { id, resId } = req.Staff;
      if ((!id, !resId))
        return res.status(400).send({ message: "Your Not authenticated" });
      const cheakRestatus = await Restaurnt.findOne({
        _id: resId,
        status: true,
      }).exec();
      if (!cheakRestatus)
        return res.status(400).send({ message: "Restaurant is clossed" });
      res.send({ message: "sucess" });
    } catch (error) {
      console.log(error);
      return res.status(400).send({ message: "Somthing went worng" });
    }
  },
  // async generateQRCode(req, res) {
  //   try {
  //     console.log("heyyy ");
  //     var paytmParams = {};

  //     paytmParams.body = {
  //       mid: "YOUR_MID_HERE",
  //       orderId: "OREDRID98765",
  //       amount: "1303.00",
  //       businessType: "UPI_QR_CODE",
  //       posId: "S12_123",
  //     };
  //     /*
  //      * Generate checksum by parameters we have in body
  //      * Find your Merchant Key in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys
  //      */
  //     PaytmChecksum.generateSignature(
  //       JSON.stringify(paytmParams.body),
  //       "YOUR_MERCHANT_KEY"
  //     ).then(function (checksum) {
  //       paytmParams.head = {
  //         clientId: "C11",
  //         version: "v1",
  //         signature: checksum,
  //       };

  //       var post_data = JSON.stringify(paytmParams);

  //       var options = {
  //         /* for Staging */
  //         hostname: "securegw-stage.paytm.in",

  //         /* for Production */
  //         // hostname: 'securegw.paytm.in',

  //         port: 443,
  //         path: "/paymentservices/qr/create",
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           "Content-Length": post_data.length,
  //         },
  //       };

  //       var response = "";
  //       var post_req = https.request(options, function (post_res) {
  //         post_res.on("data", function (chunk) {
  //           response += chunk;
  //         });

  //         post_res.on("end", function () {
  //           console.log("Response: ", response);
  //         });
  //       });
  //       post_req.write(post_data);
  //       console.log(post_data);
  //       post_req.end();
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // },
  async ProceedOrder(req, res) {
    try {
      const orderId = req.params.id;

      let order;
      console.log("hey");
      order = await Order.findOne({ _id: orderId });
      if (!order) return;
      let allFoods = order.foods.map((item) => ({
        food_id: item.food_id,
        food_Name: item.food_id.name,
        food_quantity: item.food_quantity,
        food_amount: item.food_totalprice / item.food_quantity,
        food_total_amount: item.food_totalprice,
      }));

      const SaveOrderHistory = new Order_history({
        order_Staff: { staff_id: order.staffId, res_id: order.resId },
        res_id: order.resId,
        Order_id: undefined,
        Total_order_Amount: order.total_price,
        Total_foods: order.foods.length,
        Ordered_foods: allFoods,
        Ordered_table: order.tableId,
        payment_method: undefined,
      });
      const thenSavingOrderHistory = await SaveOrderHistory.save();
      if (!thenSavingOrderHistory) return false;

      const changeTableStatus = await Table.updateOne(
        { _id: order.tableId },
        { $set: { table_status: false } }
      ).exec();
      if (!changeTableStatus) return false;
      let delteOrder = await Order.deleteOne({ _id: order._id }).exec();
      if (!delteOrder) return false;

      res.send({ message: true });
      console.log("order delted sucess fully");
    } catch (error) {
      console.log(error);
      return res.status(400).send({ message: "Somthing went worng" });
    }
  },
};
module.exports = posController;
