const foodModel = require("../models/foods");
const KitcheController = {
  async fetcheFoods(req, res) {
    try {
      const fetchData = await foodModel.find({}).sort({ status: -1 });
      if (!fetchData)
        return res.status(404).send({
          message: "Datas not fetched",
        });
      res.send(fetchData);
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

      const listResult = await foodModel
        .updateOne({ _id: id }, { $set: { status: status } })
        .exec();
      if (!listResult)
        return res.status(401).send({
          message: "Still processing",
        });
      res.send({ message: true });
    } catch (error) {
      console.log(error);
      res.status(401).send({
        message: " syntax error",
      });
    }
  },
};

module.exports = KitcheController;
