const restaurantModel = require("../models/restaurants");
const bcrypt = require("bcrypt");
const axios = require("axios");
//restaurants Insitail Data SognUp

const SuperAdminResataurantController = {
  async initialReslogin(req, res) {
    try {
      const { name, email } = req.body;
      const retriveData = await restaurantModel
        .findOne({
          owner_email: email,
        })
        .exec();
      if (retriveData)
        return res.status(404).send({ message: "Your Already registered" });

      const saveData = new restaurantModel({
        owner_name: name,
        owner_email: email,
      });
      if (!saveData)
        return res.status(404).send({ message: "Datas are not saved " });

      const saveResult = await saveData.save();
      if (!saveResult)
        return res.status(404).send({ message: "Datas are not saved " });
      const retriveRestaurant = await restaurantModel
        .findOne({
          owner_email: email,
        })
        .exec();
      if (!retriveRestaurant)
        return res.status(404).send({ message: "Your Not registers" });
      res.send({
        message: "sucess",
        resId: retriveRestaurant._id,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        message: "sever error",
      });
    }
  },
  async register(req, res) {
    try {
      console.log("hello");
      let { name, place, password, owner_email, owner_number } = req.body;
      const retriveData = await restaurantModel
        .findOne({ owner_email: owner_email })
        .exec();
      if (retriveData)
        return res
          .status(404)
          .send({ message: "This account already registered" });

      const salt = await bcrypt.genSalt(10);
      let encryptPassword = await bcrypt.hash(password, salt);
      if (!encryptPassword)
        return res.status(404).send({ message: "Your Not authenticated" });
      // let updatedData = {
      //   name: name,
      //   place: place,
      //   owner_email: owner_email,
      //   password: encryptPassword,
      //   owner_number: owner_number,
      //   status: false,
      // };
      const saveData = new restaurantModel({
        name: name,
        place: place,
        owner_email: owner_email,
        password: encryptPassword,
        owner_number: owner_number,
        status: false,
      });
      const saveResult = await saveData.save();
      if (!saveResult)
        return res.status(404).send({ message: "Datas are not saved " });
      res.send({ message: "sucess" });
    } catch (error) {
      console.log(error);
      res.status(400).send({ message: "Somthign went Worng" });
    }
  },

  async getRestaurantsData(req, res) {
    try {
      const retriveData = await restaurantModel.find({}).exec();
      if (!retriveData)
        return res.status(404).send({ message: "Data not fetched" });
      res.send(retriveData);
    } catch (error) {
      console.log(error);
      res.status(400).send({
        message: error,
      });
    }
  },
  async getFullDetails(req, res) {
    try {
      const id = req.params.id;
      if (!id) return res.status(404).send({ message: "Data not fetched" });
      const restaurantData = await restaurantModel.findOne({ _id: id }).exec();

      if (!restaurantData)
        return res.status(404).send({ message: "Data not fetched" });

      res.send(restaurantData);
    } catch (error) {
      console.log(error);
      res.status(404).send({
        error: "somthing went worng",
      });
    }
  },
  async listrestaurant(req, res) {
    try {
      const id = req.params.id;
      const status = req.body.status;
      if (!id && !status)
        return res.status(404).send({ message: "Data not fetched" });
      const afterResult = await restaurantModel
        .findOneAndUpdate({ _id: id }, { $set: { status: status } })
        .exec();
      if (!afterResult)
        return res.status(404).send({ message: "Data not updated" });
      res.send({
        message: "sucess",
      });
    } catch (error) {
      console.log(error);
      res.status(401).send({
        message: "somthing went worng",
      });
    }
  },
  async SaveEditRes(req, res) {
    try {
      const id = req.params.id;
      const { name, place, owner_name, owner_number } = req.body;
      const updatedData = {
        name: name,
        place: place,
        owner_name: owner_name,
        owner_number: owner_number,
      };
      if (!id) return res.status(404).send({ message: "Data not fetched" });
      const updateResult = await restaurantModel
        .findOneAndUpdate({ _id: id }, updatedData)
        .exec();
      if (!updateResult)
        return res.status(404).send({ message: "Data not updated" });
      res.send({
        mesage: "success",
      });
    } catch (error) {
      console.log(error);
      res.status(401).send({
        message: "somthing went worng",
      });
    }
  },
};

module.exports = SuperAdminResataurantController;
