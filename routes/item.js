var express = require("express");
var router = express.Router();
var modelItem = require("../models/item");

// Get all item
// http://localhost:3000/item
router.get("/", async function (req, res, next) {
  var data = await modelItem.find();
  res.json(data);
});

// thêm danh sách vào giỏ hàng
// http://localhost:3000/item/add-item
router.post("/add-item", async function (req, res, next) {
  try {
    const { Name, Price, Description } = req.body;
    console.log(req.body);

    // tạo model
    const Data = { Name, Price, Description };

    await modelItem.create(Data);

    res.json({ status: "Thêm thành công !", Data });
  } catch (error) {
    res.json({ status: "Thêm thất bại" });
  }
});

// cập nhập danh sách giỏ hàng
// http://localhost:3000/item/update-item
router.put("/update-item", async function (req, res, next) {
  try {
    const { id, Name, Price, Description } = req.body;
    console.log(req.body);

    // tìm Item để cập nhập
    const Data = { id, Name, Price, Description };

    await modelItem.updateOne({ _id: id }, Data);

    res.json({ status: "Cập nhập thành công !", Data });
  } catch (error) {
    res.json({ status: "Cập nhập thất bại" });
  }
});

// xóa danh sách khỏi giỏ hàng
// http://localhost:3000/item/delete-item
router.delete("/delete-item", async function (req, res, next) {
  try {
    const { id } = req.body;
    console.log(req.body);

    // tìm Item để xóa
    const item = { id };

    await modelItem.deleteOne({ _id: id }, item);

    res.json({ status: "Xóa thành công !", item });
  } catch (error) {
    res.json({ status: "Xóa thất bại" });
  }
});

module.exports = router;
