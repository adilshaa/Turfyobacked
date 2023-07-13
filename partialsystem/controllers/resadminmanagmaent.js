const staffModel = require("../models/staffs");
const foodModel = require("../models/foods");
const jwt = require("jsonwebtoken");
const resModel = require("../../mainsystem/models/restaurants");
const bcrypt = require("bcrypt");
const { findOneAndUpdate } = require("../../mainsystem/models/restaurants");
const secretKey = "ResturantAdminkey";
const addStaff = async (req, res) => {
  try {
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
    const savingData = new staffModel({
      username: employeeName,
      place: employeePlace,
      number: employeeNumber,
      email: employeeEmail,
      age: employeeAge,
      password: bcryptPass,
      dateofbirth: employeeDataOFBirth,
      role: employeeRole,
      status: false,
      // resturantId: resturantId,
    });
    const savingResult = await savingData.save();
    if (savingResult) {
      res.send({
        message: "saving process over",
      });
    } else {
      res.status(401).send({
        message: "somthing went worng",
      });
    }
  } catch (error) {
    res.status(400).send({ message: "somthing went worng" });
  }
};

const verifyStaffs = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const filterByRole = await staffModel.findOne({
      role: role,
      // username: username,
    });
    if (filterByRole && filterByRole.email == email) {
      const matchingPasswaord = await bcrypt.compare(
        password,
        filterByRole.password
      );
      if (matchingPasswaord) {
        res.send(filterByRole);
      } else {
        res.status(400).send({
          message: "password is in correct",
        });
      }
    } else {
      res.status(400).send({
        message: "Email is incorrect ",
      });
    }
  } catch (error) {
    res.status(400).send({
      message: "syntax error ",
    });
  }
};



const addFoods = async (req, res) => {
  try {
    const { dishName, dishDescription, dishCategory, dishPrice } = req.body;
    const saveFood = new foodModel({
      name: dishName,
      description: dishDescription,
      category: dishCategory,
      price: dishPrice,
      status: true,
      image: req.file.filename,
    });
    const saveResult = await saveFood.save();
    if (saveResult) {
      res.send({
        message: "success",
      });
    } else {
      res.status(400).send({
        message: "error found",
      });
    }
  } catch (error) {
    res.status(401).send({
      message: "error found",
    });
  }
};



const validateResAdmin = async (req, res) => {
  try {
    const AuthHeader = req.headers.authorization;
    const retriveToken = AuthHeader && AuthHeader.split(" ")[1];
    const verifyToken = jwt.verify(retriveToken, secretKey);
    if (!verifyToken) {
      res.status(400).send({
        message: "not authenticated",
      });
    } else {
      const retriveAdmin = await resModel.findOne({ _id: verifyToken.aud });
      if (!retriveAdmin) {
        res.status(400).send({
          message: "not authenticated",
        });
      } else {
        res.send({
          message: "success",
          data: retriveAdmin,
        });
      }
    }
  } catch (error) {
    res.status(404).send({
      message: "sever error found",
    });
  }
};



const fetchStaffs = async (req, res) => {
  try {
    const fetchData = await staffModel.find({});
    if (fetchData) {
      res.send(fetchData);
    } else {
      res.status(400).snd({
        message: "error",
      });
    }
  } catch (error) {
    res.status(400).snd({
      message: "error",
    });
  }
};



const getStaff = async (req, res) => {
  try {
    let id = req.params.id;
    if (id) {
      const retriveStaff = await staffModel.findOne({ _id: id });
      if (retriveStaff) {
        res.send(retriveStaff);
      } else {
        res.status(404).send({
          message: "Resouses are missing",
        });
      }
    } else {
      res.status(404).send({
        message: "Resouses are missing",
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Server Error",
    });
  }
};



const EditStaffs = async (req, res) => {
  try {
    let id = req.params.id;
    if (id) {
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
      const saveResult = await staffModel.findOneAndUpdate(
        { _id: id },
        StaffsData
      );
      if (saveResult) {
        res.send({
          messge: true,
        });
      } else {
        res.status(404).send({
          message: "Resouses are missing",
        });
      }
    } else {
      res.status(404).send({
        message: "Resouses are missing",
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Server Error",
    });
  }
};



const removeStaff = async (req, res) => {
  try {
    let id = req.params.id;
    if (id) {
      const deleteStaffs = await staffModel.deleteOne({ _id: id });
      if (deleteStaffs) {
        res.send({
          message: true,
        });
      } else {
        res.status(404).send({
          message: "Resouses are missing",
        });
      }
    } else {
      res.status(404).send({
        message: "Resouses are missing",
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Server Error",
    });
  }
};



const ControlllerLogin = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const retriveData = await resModel.findOne({ owner_email: email });
    if (retriveData && retriveData.owner_email == email) {
      const matchingPasswaord = bcrypt.compare(retriveData.password, password);
      if (matchingPasswaord) {
        const { _id } = retriveData.toJSON();
        const payload = {
          aud: _id,
        };
        const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });
        res.send({
          resId: retriveData._id,
          message: "success",
          token: token,
        });
      } else {
        res.status(404).send({
          message: "Account Not Recognised",
        });
      }
    } else {
      res.status(404).send({
        message: "Datas Not Authenticated",
      });
    }
  } catch (error) {
    res.status(404).send({
      message: "Somthing Went Worng !!",
    });
  }
};



const ControlllerLoginWithGoogle = async (req, res) => {
  try {
    const email = req.body.email;
  } catch (error) {}
};


const LogoutAdmin = async (req, res) => {
  try {
  } catch (error) {}
};

module.exports = {
  addStaff,
  verifyStaffs,
  addFoods,
  validateResAdmin,
  fetchStaffs,
  getStaff,
  EditStaffs,
  removeStaff,
  ControlllerLogin,
  ControlllerLoginWithGoogle,
  LogoutAdmin,
};
