var express = require("express");
var router = express.Router();
var modelRegister = require("../models/register");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//http://localhost:3000/register
router.get("/", async function (req, res, next) {
  var data = await modelRegister.find();
  res.json(data);
});

// Đăng ký
// http://localhost:3000/register/add-register
router.post("/add-register", async function (req, res, next) {
  try {
    const { Email, Password, Name } = req.body;
    console.log(req.body);

    // Kiểm tra xem người dùng có tồn tại trong cơ sở dữ liệu hay không
    const existingUser = await modelRegister.findOne({ Email });
    if (existingUser) {
      return res.json({ status: 0, message: "Email đã tồn tại" });
    }

    // Hash mật khẩu trước khi lưu vào cơ sở dữ liệu
    const hashedPassword = await bcrypt.hash(Password, 10);

    // Tạo model
    const Data = {
      Email,
      Password: hashedPassword,
      Name,
      Points: 0,
      Coins: 0,
      Position: "",
      Disabled: false,
      Carts: {
        Total: 0,
        CreatedAt: new Date(),
        Products: {
          Name: "",
          Price: 0,
          Quantity: 0,
          idCate: "",
        },
      },
    };

    await modelRegister.create(Data);
    res.json({ status: 1, message: "Đăng ký thành công", Data });
  } catch (err) {
    console.error(err); // Ghi log lỗi cho mục đích gỡ lỗi
    res.json({ status: 0, message: "Đăng ký thất bại", error: err.message });
  }
});

// Cập nhật người dùng
// http://localhost:3000/register/update-register/:id
router.put("/update-register/:id", async function (req, res, next) {
  try {
    const { id } = req.params;

    // Kiểm tra xem id có đúng định dạng ObjectId hay không
    if (!mongoose.isValidObjectId(id)) {
      return res.json({ status: 0, message: "Id không hợp lệ" });
    }

    // Tìm người dùng trong cơ sở dữ liệu dựa trên id
    const user = await modelRegister.findById(id);
    if (!user) {
      return res.json({ status: 0, message: "Người dùng không tồn tại" });
    }

    // Các bước cập nhật thông tin người dùng
    const {
      Email,
      Password,
      Name,
      Points,
      Coins,
      Position,
      Disabled,
      Carts,
      Total,
      CreatedAt,
      Products,
      Price,
      Quantity,
      idCate,
    } = req.body;

    // Cập nhật trường Name nếu có tồn tại trong yêu cầu
    if (Name) {
      user.Name = Name;
    }

    // Hash mật khẩu trước khi cập nhật (nếu có)
    if (Password) {
      const hashedPassword = await bcrypt.hash(Password, 10);
      user.Password = hashedPassword;
    }

    // Cập nhật các trường khác (nếu có)
    user.Points = Points || user.Points;
    user.Coins = Coins || user.Coins;
    user.Position = Position || user.Position;
    user.Disabled = Disabled || user.Disabled;

    // Cập nhật trường Carts (nếu có)
    if (Carts) {
      user.Carts.Total = Total || user.Carts.Total;
      user.Carts.CreatedAt = CreatedAt || user.Carts.CreatedAt;

      // Cập nhật trường Products (nếu có)
      if (Products) {
        user.Carts.Products.Name = Products.Name || user.Carts.Products.Name;
        user.Carts.Products.Price = Price || user.Carts.Products.Price;
        user.Carts.Products.Quantity = Quantity || user.Carts.Products.Quantity;
        user.Carts.Products.idCate = idCate || user.Carts.Products.idCate;
      }
    }

    await user.save();

    res.json({ status: 1, message: "Cập nhật thành công", Data: user });
  } catch (err) {
    console.error(err); // Ghi log lỗi cho mục đích gỡ lỗi
    res.json({ status: 0, message: "Cập nhật thất bại", error: err.message });
  }
});

// Xóa người dùng
//http://localhost:3000/register/delete-register
router.delete("/delete-register", async function (req, res, next) {
  try {
    const { id } = req.body;
    console.log(req.body);

    // Tạo model
    const Data = {
      id,
    };

    await modelRegister.deleteOne({ _id: id }, Data);

    res.json({ status: 1, message: "Xóa thành công", Data });
  } catch (err) {
    console.error(err); // Ghi log lỗi cho mục đích gỡ lỗi
    res.json({ status: 0, message: "Xóa thất bại", error: err.message });
  }
});

// Đăng nhập
// http://localhost:3000/register/login
router.post("/login", async function (req, res, next) {
  try {
    const { Email, Password } = req.body;
    console.log(req.body);

    // Tìm người dùng trong cơ sở dữ liệu dựa trên email
    const user = await modelRegister.findOne({ Email });

    if (!user) {
      return res.status(422).json({
        error: true,
        statusCode: 422,
        message: "Người dùng không tồn tại",
      });
    }

    // So sánh mật khẩu đã nhập với mật khẩu đã lưu trong cơ sở dữ liệu
    const isPasswordMatch = await bcrypt.compare(Password, user.Password);

    if (!isPasswordMatch) {
      return res.status(422).json({
        error: true,
        statusCode: 422,
        message: "Mật khẩu không chính xác",
      });
    }

    // Tạo token xác thực
    const token = jwt.sign({ userId: user._id }, "your_secret_key");

    // Trả về thông tin người dùng và token
    res.json({
      error: false,
      statusCode: 200,
      message: "Đăng nhập thành công",
      user: {
        id: user._id,
        Email: user.Email,
        Name: user.Name,
        Points: user.Points,
        Coins: user.Coins,
        Position: user.Position,
        Disabled: user.Disabled,
        Carts: {
          Total: user.Carts.Total,
          CreatedAt: user.Carts.CreatedAt,
          Products: {
            Name: user.Carts.Products.Name,
            Price: user.Carts.Products.Price,
            Quantity: user.Carts.Products.Quantity,
            idCate: user.Carts.Products.idCate,
          },
        },
      },
      token: token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: true,
      statusCode: 500,
      message: "Đăng nhập thất bại",
      error: error.message,
    });
  }
});

module.exports = router;
