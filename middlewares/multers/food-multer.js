const multer = require("multer")
const path = require("path")
// const public=require("../../public/foods-images")
const food_img_Storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log(req);
        cb(null, path.join(__dirname, "../../public/foods-images"));
    },
    filename: function (req, file, cb) {
        const name = Date.now() + '-' + file.originalname
        cb(null,name)
    }
})
module.exports = food_img_Storage;
