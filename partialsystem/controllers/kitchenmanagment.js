const foodModel = require("../models/foods");
const KitcheController = {
  async fetcheFoods(req, res) {
    try {
      const fetchData = await foodModel.find({}).sort({ status: -1 });
      if (fetchData) {
        res.send(fetchData);
      } else {
        res.status(404).send({
          mesage: "error",
        });
      }
    } catch (error) {
      res.status(401).send({
        mesage: " syntax error",
      });
    }
  },
  async listFoods(req, res) {
    try {
      let id = req.params.id;
      let status = req.body.status;

      console.log(id, status);
      const listResult = await foodModel.updateOne(
        { _id: id },
        { $set: { status: status } }
      );
      if (listResult) {
        res.send({ message: true });
      } else {
        res.status(404).send({
          mesage: "error",
        });
      }
    } catch (error) {
      console.log(error);
      res.status(401).send({
        mesage: " syntax error",
      });
    }
  },
};

module.exports = KitcheController;
