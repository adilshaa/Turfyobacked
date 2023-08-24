const Staff = require("../models/staffs");
const Food = require("../models/foods");
const Stock = require("../models/stocks");
const Table = require("../models/tables");
const FoodCategory = require("../models/food-category");

const Restaurant = require("../../mainsystem/models/restaurants");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { composeEmailToStaff } = require("../api/nodemail");
const secretKey = process.env.RES_ADMIN_TOKEN;
const RestaurantCOntroller = {
  async ControlllerLogin(req, res) {
    try {
      const { email, password } = req.body;
      const retriveData = await Restaurant.findOne({
        owner_email: email,
      }).exec();
      if (!retriveData || retriveData.owner_email != email)
        return res.status(400).send({ message: "Emial is not authenticated" });

      const matchingPasswaord = bcrypt.compare(retriveData.password, password);
      if (!matchingPasswaord)
        return res.status(400).send({ message: "incorrect password" });

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
      const token = jwt.sign(payload, secretKey, { expiresIn: "100h" });

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
      const token = jwt.sign(payload, secretKey, { expiresIn: "100h" });

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

      const verifyStaff = await Staff.findOne({ email: employeeEmail });
      if (verifyStaff)
        return res
          .status(404)
          .send({ message: "This email is already registered" });
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
      });
      const savingResult = await savingData.save();

      if (!savingResult)
        return res.status(404).send({ message: "Datas not saved" });
      const retrieRestarurantData = await Restaurant.findById(
        restuarant
      ).exec();
      const StaffEmailData = {
        staffname: employeeName,
        resName: retrieRestarurantData.name,
        staffEmail: employeeEmail,
        resEmail: retrieRestarurantData.owner_email,
      };
      composeEmailToStaff(StaffEmailData);
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
        message: "Somthing wwnt worng",
      });
    }
  },
  async filterFoods(req, res) {
    try {
      const { id } = req.params;
      let restuarant = req.restuarant.id;
      const filterdData = await Food.find({
        resturantId: restuarant,
        category: id,
      })
        .populate("category", null, FoodCategory)
        .populate("resturantId", null, Restaurant)
        .exec();
      const count = await Food.countDocuments({
        resturantId: restuarant,
        category: id,
      });
      // console.log(filterdData);

      res.send({ food: filterdData, count: count });
    } catch (error) {
      console.log(error);
      res.status(401).send({
        message: "Somthing wwnt worng",
      });
    }
  },

  async editFoodImage(req, res) {
    try {
      console.log("reached");

      let restuarant = req.restuarant.id;
      let foodid = req.params.id;
      let image = req.file.filename;
      if (!restuarant)
        return res.status(400).send({
          message: "not authenticated",
        });
      if (!foodid || !image)
        return res.status(400).send({
          message: "Image id not recived",
        });

      const updateImage = await Food.updateOne(
        { _id: foodid },
        { $set: { image: image } }
      );
      if (!updateImage)
        return res.status(400).send({
          message: "Image id not updated",
        });
      res.send({ messge: true });
    } catch (error) {
      console.log(error);
      res.status(401).send({
        message: "error found",
      });
    }
  },
  async editFoodCnt(req, res) {
    try {
      const { id } = req.params;
      const { name, price } = req.body;

      if (!name || !price)
        return res.status(400).send({
          message: "Data Not reciveds",
        });

      const udataData = {
        name: name,
        price: price,
      };
      const updateResult = await Food.findByIdAndUpdate(id, udataData).exec();
      if (!updateResult)
        return res.status(400).send({
          message: "Data Not Updated",
        });
      res.send({ message: true });
    } catch (error) {
      console.log(error);
      res.status(401).send({
        message: "error found",
      });
    }
  },
  async AddFoodCategory(req, res) {
    try {
      let { name } = req.body;
      let restuarant = req.restuarant.id;

      if (!name)
        return res.status(400).send({
          message: "Data Not Recived",
        });
      name = name.trim();
      const retriveCategory = await FoodCategory.find({
        resId: restuarant,
      }).exec();

      let duplicate = retriveCategory.find((category) => category.name == name);
      if (duplicate)
        return res.status(400).send({
          message: "This item already existing",
        });

      let saveCategory = new FoodCategory({
        name: name,
        resId: restuarant,
      });

      if (!saveCategory)
        return res.status(400).send({
          message: "Data Not Added",
        });
      await saveCategory.save();
      res.send({ message: true });
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
      let restuarant = req.restuarant.id;
      let { id } = req.params;
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

      const salt = await bcrypt.genSalt(10);
      const saveResult = await Staff.findOneAndUpdate(
        { _id: id },
        StaffsData
      ).exec();
      if (!saveResult)
        return res.status(400).send({ message: "Resourses are not fetched" });

      const retrieRestarurantData = await Restaurant.findById(
        restuarant
      ).exec();

      // const StaffEmailData = {
      //   staffname: employeeName,
      //   resName: retrieRestarurantData.name,
      //   staffEmail: employeeEmail,
      //   resEmail: retrieRestarurantData.owner_email,
      // };
      // composeEmailToStaff(StaffEmailData);
      res.send({
        messge: true,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "Server somthing went worng",
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
      let restuarant = req.restuarant.id;

      const fetchAllStoks = await Stock.find({ _id: restuarant }).exec();
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
      const { stockName, stockQuantity, stockExpairy, stockprice } = req.body;
      const createStock = new Stock({
        name: stockName,
        quantity: stockQuantity,
        expairy_Data: stockExpairy,
        resturantId: restuarant,
        price: stockprice,
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
      const { stockName, stockQuantity, stockExpairy, stockprice } = req.body;
      const updateData = {
        name: stockName,
        quantity: stockQuantity,
        expairy_Data: stockExpairy,
        price: stockprice,
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
      let tables = await Table.find({ restaurant_id: id });
      res.send({
        message: "Sucess",
        tables: tables,
      });
    } catch (error) {
      console.log(error);
      return res.status(404).send({
        message: "Somthing went wrong",
      });
    }
  },
  async delteTable(req, res) {
    try {
      console.log("heare");
      const tableId = req.params.id;
      const resid = req.restuarant.id;
      let deltingTable = await Table.findOne({
        _id: tableId,
        restaurant_id: resid,
      });
      // if (!deletedTable)
      //   return res.status(404).json({ error: "Table not found" });
      // console.log(deletedTable);
      const reminingTable = await Table.find({
        table_No: { $gt: deltingTable.table_No },
        restaurant_id: deltingTable.restaurant_id,
      });

      for (let tables of reminingTable) {
        tables.table_No -= 1;
        await tables.save();
      }

      const deletedTable = await Table.deleteOne({ _id: tableId }).exec();

      let tables = await Table.find({
        restaurant_id: resid,
        restaurant_id: resid,
      });
      res.send({ message: true, tables: tables });
    } catch (error) {
      console.log(error);
      return res.status(404).send({ message: "Somthing went worng" });
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
