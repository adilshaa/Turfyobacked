const Staff = require("../models/staffs");
const Food = require("../models/foods");
const Stock = require("../models/stocks");
const Table = require("../models/tables");
const Restaurant = require("../../mainsystem/models/restaurants");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const secretKey = "ResturantAdminkey";

const RestaurantCOntroller = {
  async ControlllerLogin(req, res) {
    try {
      const { email, password } = req.body;
      const retriveData = await Restaurant.findOne({
        owner_email: email,
      }).exec();
      if (!retriveData && retriveData.owner_email != email)
        return res.status(400).send({ message: "Your not authenticated" });

      const matchingPasswaord = bcrypt.compare(retriveData.password, password);
      if (!matchingPasswaord)
        return res.status(400).send({ message: "Your not authenticated" });

      const updateStatus = await Restaurant.updateOne(
        { _id: retriveData._id },
        { $set: { status: true } }
      ).exec();

      if (!updateStatus)
        return res.status(400).send({ message: "Still proccessing" });
      const { _id } = retriveData.toJSON();
      const payload = {
        id: _id,
      };
      const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });
      res.send({
        resId: retriveData._id,
        message: "success",
        token: token,
      });
    } catch (error) {
      console.log(error);
      res.status(404).send({
        message: "Somthing Went Worng !!",
      });
    }
  },
  async ControlllerLoginWithGoogle(req, res) {
    try {
      const email = req.body.email;
      if (!email)
        return res.status(404).send({ message: "resourses are missing" });

      const retrivedata = await Restaurant.findOne({
        owner_email: email,
      }).exec();
      if (!retrivedata)
        return res.status(404).send({ message: "Wrong email address" });

      const updateStatus = await Restaurant.updateOne(
        { _id: retrivedata._id },
        { $set: { status: true } }
      ).exec();

      if (!updateStatus)
        return res.status(400).send({ message: "Still proccessing" });
      const { _id } = retrivedata.toJSON();
      const payload = {
        resId: retrivedata._id,
        id: _id,
      };
      const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });
      res.send({
        resId: retrivedata._id,
        message: "success",
        token: token,
      });
    } catch (error) {
      console.log(error);
      res.status(404).send({
        message: "Somthing Went Worng !!",
      });
    }
  },

  async validateResAdmin(req, res) {
    try {
      let restuarant = req.restuarant.id;
      if (!restuarant)
        return res.status(400).send({
          message: "not authenticated",
        });
      const retriveAdmin = await Restaurant.findOne({ _id: restuarant }).exec();
      if (!retriveAdmin)
        return res.status(400).send({
          message: "not authenticated",
        });
      res.send({
        message: "success",
        data: retriveAdmin,
      });
    } catch (error) {
      res.status(404).send({
        message: "sever error found",
      });
    }
  },
  async addStaff(req, res) {
    try {
      let restuarant = req.restuarant.id;
      if (!restuarant)
        return res.status(400).send({
          message: "not authenticated",
        });
      const {
        employeeName,
        employeePlace,
        employeeEmail,
        employeeNumber,
        employeeAge,
        password,
        employeeDataOFBirth,
        employeeRole,
      } = req.body;
      const salt = await bcrypt.genSalt(10);
      const bcryptPass = await bcrypt.hash(password, salt);
      if (!bcryptPass)
        return res.status(404).send({ message: "Password not hashed" });
      const savingData = new Staff({
        username: employeeName,
        place: employeePlace,
        number: employeeNumber,
        email: employeeEmail,
        age: employeeAge,
        password: bcryptPass,
        dateofbirth: employeeDataOFBirth,
        role: employeeRole,
        resturantId: restuarant,
        status: false,
        // resturantId: resturantId,
      });
      const savingResult = await savingData.save();

      if (!savingResult)
        return res.status(404).send({ message: "Datas not saved" });
      res.send({
        message: "saving process over",
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({ message: "somthing went worng" });
    }
  },
  async verifyStaffs(req, res) {
    try {
      const { email, password, role } = req.body;
      const filterByRole = await Staff.findOne({
        role: role,
      }).exec();
      if (!filterByRole && filterByRole.email != email)
        return res.status(400).send({ message: "Your Not authenticated" });
      const matchingPasswaord = await bcrypt.compare(
        password,
        filterByRole.password
      );
      if (!matchingPasswaord)
        return res.status(400).send({ message: "Your Not authenticated" });
      res.send(filterByRole);
    } catch (error) {
      console.log(error);
      res.status(400).send({
        message: "syntax error ",
      });
    }
  },
  async addFoods(req, res) {
    try {
      let restuarant = req.restuarant.id;
      if (!restuarant)
        return res.status(400).send({
          message: "not authenticated",
        });
      const { dishName, dishDescription, dishCategory, dishPrice } = req.body;
      const saveFood = new Food({
        name: dishName,
        description: dishDescription,
        category: dishCategory,
        price: dishPrice,
        status: true,
        resturantId: restuarant,
        image: req.file.filename,
      });
      const saveResult = await saveFood.save();
      if (!saveResult)
        return res.status(400).send({ message: "Data not saved" });
      res.send({
        message: "success",
      });
    } catch (error) {
      console.log(error);
      res.status(401).send({
        message: "error found",
      });
    }
  },

  async fetchStaffs(req, res) {
    try {
      const { id } = req.restuarant;
      const fetchData = await Staff.find({ resturantId: id }).exec();
      if (!fetchData)
        return res.status(400).send({
          message: "Resourses are not fetched",
        });
      res.send(fetchData);
    } catch (error) {
      console.log(error);
      res.status(400).snd({
        message: "error",
      });
    }
  },
  async getStaff(req, res) {
    try {
      let id = req.params.id;

      if (!id)
        return res.status(400).send({ message: "Resourses are not fetched" });

      const retriveStaff = await Staff.findOne({ _id: id }).exec();

      if (!retriveStaff)
        return res.status(400).send({ message: "Resourses are not fetched" });

      res.send(retriveStaff);
    } catch (error) {
      res.status(500).send({
        message: "Server Error",
      });
    }
  },
  async EditStaffs(req, res) {
    try {
      let id = req.params.id;
      if (!id)
        return res.status(400).send({ message: "Resourses are not fetched" });

      const {
        employeeName,
        employeePlace,
        employeeEmail,
        employeeAge,
        employeeNumber,
        employeeDataOFBirth,
        employeeRole,
      } = req.body;

      const StaffsData = {
        username: employeeName,
        place: employeePlace,
        email: employeeEmail,
        age: employeeAge,
        number: employeeNumber,
        dateofbirth: employeeDataOFBirth,
        role: employeeRole,
      };
      const saveResult = await Staff.findOneAndUpdate(
        { _id: id },
        StaffsData
      ).exec();
      if (!saveResult)
        return res.status(400).send({ message: "Resourses are not fetched" });

      res.send({
        messge: true,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "Server Error",
      });
    }
  },
  async removeStaff(req, res) {
    try {
      let id = req.params.id;
      if (!id)
        return res.status(400).send({ message: "Resourses are not fetched" });

      const deleteStaffs = await Staff.deleteOne({ _id: id }).exec();
      if (!deleteStaffs)
        return res.status(400).send({ message: "Still Processing" });
      res.send({
        message: true,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "Server Error",
      });
    }
  },

  async fetchstocks(req, res) {
    try {
      const fetchAllStoks = await Stock.find({}).exec();
      if (!fetchAllStoks)
        return res.status(404).send({ message: "resorse not fetched " });
      res.send(fetchAllStoks);
    } catch (error) {
      console.log(error);
      res.status(404).send({
        messge: " somthing went worng ",
      });
    }
  },

  async addStocks(req, res) {
    try {
      let restuarant = req.restuarant.id;
      if (!restuarant)
        return res.status(400).send({
          message: "not authenticated",
        });
      if (!req.body)
        return res.status(404).send({ message: "resourses is missing" });
      const { stockName, stockQuantity, stockExpairy } = req.body;
      const createStock = new Stock({
        name: stockName,
        quantity: stockQuantity,
        expairy_Data: stockExpairy,
        resturantId: restuarant,
        stockStatus: true,
      });
      let saveResult = await createStock.save();
      if (!saveResult)
        return res.status(404).send({ message: "data not stored" });
      res.send({ message: true });
    } catch (error) {
      console.log(error);
      res.status(400).send({ message: "somting went worng" });
    }
  },
  async loadEditStock(req, res) {
    try {
      const { id } = req.params;
      const retriveStcok = await Stock.findOne({ _id: id }).exec();
      if (!retriveStcok)
        return res.status(404).send({
          message: "resoruse not fetched",
        });
      res.send({
        message: "sucess",
        stock: retriveStcok,
      });
    } catch (error) {
      res.status(400).send({ message: "somting went worng" });
    }
  },
  async updateStcok(req, res) {
    try {
      const { id } = req.params;
      console.log(id);
      const { stockName, stockQuantity, stockExpairy } = req.body;
      const updateData = {
        name: stockName,
        quantity: stockQuantity,
        expairy_Data: stockExpairy,
      };
      const updatingDatas = await Stock.findOneAndUpdate(
        { _id: id },
        updateData
      );
      if (!updatingDatas)
        return res.status(400).send({
          message: "not updated",
        });
      res.send({ message: "successs" });
    } catch (error) {
      console.log(error);
      res.status(400).send({ message: "somting went worng" });
    }
  },

  async editStock(req, res) {
    try {
      const { id } = req.params;

      const { stockName, stockQuantity, stockExpairy, stockStatus } = req.body;
      const UpdationData = {
        name: stockName,
        quantity: stockQuantity,
        expairy_Data: stockExpairy,
        stockStatus: true,
      };
      const retriveStockData = await Stock.findByIdAndUpdate(
        { _id: id },
        UpdationData
      ).exec();
      if (!retriveStockData)
        return res.status(404).send({ message: "Data Not updated" });
      res.send({ message: "sucessfully updated" });
    } catch (error) {
      console.log(error);
      res.status(404).send({ message: "Somthing went worng " });
    }
  },
  async createTable(req, res) {
    try {
      let id = req.restuarant.id;
      let tableNumber;
      const retriveData = await Table.find({ restaurant_id: id })
        .sort({ table_No: -1 })
        .limit(1);
      if (retriveData[0] === undefined) {
        tableNumber = 1;
      } else {
        tableNumber = parseInt(retriveData[0].table_No) + 1;
      }
      const TableData = new Table({
        table_Name: "T",
        table_No: tableNumber,
        restaurant_id: id,
        table_status: false,
      });
      if (!TableData)
        return res.status(404).send({
          message: "data not saved",
        });
      await TableData.save();
      res.send({
        message: "Sucess",
      });
    } catch (error) {
      console.log(error);
      return res.status(404).send({
        message: "Somthing went wrong",
      });
    }
  },
  async getTables(req, res) {
    try {
      let id = req.restuarant.id;
      if (!id)
        return res.status(404).send({ message: "your not authenticated" });
      const Tables = await Table.find({ restaurant_id: id }).exec();
      if (!Tables)
        return res.status(404).send({ message: "Resourses not fetched" });
      res.send(Tables);
    } catch (error) {
      return res.status(404).send({ message: "Somthing went worng" });
    }
  },
  async LogoutAdmin(req, res) {
    try {
      const updateStatus = await Restaurant.updateOne(
        { _id: req.restuarant.id },
        { $set: { status: false } }
      ).exec();
      if (!updateStatus)
        return res.status(400).send({ message: "Still proccessing" });
      req.restuarant = null;
      res.send({ message: "success" });
    } catch (error) {
      console.log(error);
      res.status(400).send({ message: "somthing went worng" });
    }
  },
};

module.exports = RestaurantCOntroller;
