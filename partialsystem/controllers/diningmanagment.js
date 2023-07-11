const foodModel = require("../models/foods");




const fetchFoodsData = async (req, res) => {
  console.log("am dinig");
  try {
    const fetchData = await foodModel
      .find({ status: true })
      .sort({ status: 1 });
    if (fetchData) {
      res.send(fetchData);
    } else {
      res.status(404).send({
        message: "worng",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(404).send({
      message: "worng",
    });
  }
};



module.exports = {
  fetchFoodsData,
};
