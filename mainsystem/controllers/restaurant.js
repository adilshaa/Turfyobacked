const restaurantModel = require("../models/restaurants");
const bcrypt = require("bcrypt");

//restaurants Insitail Data SognUp

const initialReslogin = async (req, res) => {
  try {
    let name = req.body.name;
    let email = req.body.email;

    const retriveData = await restaurantModel.findOne({ owner_email: email });
    console.log(retriveData || retriveData == null);
    if (!retriveData) {
      console.log(name, email);
      const saveData = new restaurantModel({
        owner_name: name,
        owner_email: email,
      });
      console.log("done");

      const saveResult = await saveData.save();
      if (saveResult) {
        const retriveData = await restaurantModel.findOne({
          owner_email: email,
        });

        console.log("done");
        res.send({
          message: "sucess",
          resId: retriveData._id,
        });
      } else {
        res.status(400).send({
          message: "sever error",
        });
      }
    } else {
      res.status(400).send({
        message: " Sorry !! ,This Email is Already Registerd",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: "sever error",
    });
  }
};

const register = async (req, res) => {
  try {
    let resId = req.params.id;
    console.log("reached");
    let email = req.body.owner_email;
    const retriveData = await restaurantModel.findOne({ _id: resId });
    console.log(retriveData);

    if (retriveData && retriveData.owner_email == email) {
      let name = req.body.name;
      let place = req.body.place;
      let password = req.body.password;
      let owner_number = req.body.owner_number;
      console.log("register");
      const salt = await bcrypt.genSalt(10);
      let encryptPassword = await bcrypt.hash(password, salt);

      let updatedData = {
        name: name,
        place: place,
        password: encryptPassword,
        owner_number: owner_number,
        status: true,
      };
      console.log(updatedData);
      console.log("....");
      const saveRemaingDatas = await restaurantModel.findOneAndUpdate(
        { owner_email: retriveData.owner_email },
        updatedData
      );
      console.log(saveRemaingDatas);
      if (saveRemaingDatas) {
        res.send({ message: "sucess" });
      } else {
        res.status(400).send({ message: "This Email is not Recognized" });
      }
    } else {
      res.status(400).send({ message: "This Email is not Recognized" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: "Somthign went Worng" });
  }
};

const getRestaurantsData = async (req, res) => {
  try {
    console.log("get restarant all data");
    const retriveData = await restaurantModel.find({});
    // console.log(retriveData);
    if (retriveData) {
      console.log("yes");
      // console.log(retriveData);
      res.send(retriveData);
    } else {
      res.status(401).send({
        message: "somthing went worng",
      });
    }
  } catch (error) {
    res.status(400).send({
      message: error,
    });
  }
};
const getFullDetails = async (req, res) => {
  try {
    console.log("full details of resturatn");

    const id = req.params.id;
    if (id) {
      const restaurantData = await restaurantModel.findOne({ _id: id });
      if (restaurantData) {
        res.send(restaurantData);
      } else {
        res.status(400).send({
          error: "somthing went worng",
        });
      }
    } else {
      res.status(400).send({
        error: "somthing went worng",
      });
    }
  } catch (error) {
    res.status(404).send({
      error: "somthing went worng",
    });
  }
};
const listrestaurant = async (req, res) => {
  try {
    console.log("deelte");
    const id = req.params.id;
    const status = req.body.status;
    console.log(status);
    if (id) {
      const afterResult = await restaurantModel.findOneAndUpdate(
        { _id: id },
        { $set: { status: status } }
      );
      if (afterResult) {
        res.send({
          message: "sucess",
        });
      } else {
        res.status(400).send({
          message: "somthing went worng",
        });
      }
    } else {
      res.status(400).send({
        message: "somthing went worng",
      });
    }
  } catch (error) {
    res.status(401).send({
      message: "somthing went worng",
    });
  }
};

const SaveEditRes = async (req, res) => {
  try {
    console.log("edit");
    const id = req.params.id;
    const { name, place, owner_name } = req.body;
    const updatedData = {
      name: name,
      place: place,
      owner_name: owner_name,
    };
    // let
    // console.log(id);
    if (id) {
      console.log("update");
      const updateResult = await restaurantModel.findOneAndUpdate(
        { _id: id },
        updatedData
      );
      if (updateResult) {
        res.send({
          mesage: "success",
        });
      } else {
        res.status(400).send({
          message: "somthing went worng",
        });
      }
    } else {
      res.status(400).send({
        message: "somthing went worng",
      });
    }
  } catch (error) {
    res.status(401).send({
      message: "somthing went worng",
    });
  }
};
module.exports = {
  initialReslogin,
  register,
  getRestaurantsData,
  getFullDetails,
  listrestaurant,
  SaveEditRes,
};
