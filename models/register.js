const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

// Post đăng ký
const register = new Schema(
  {
    id: { type: ObjectId }, //khóa chính
    Email: { type: String, required: true },
    Password: { type: String, required: true },
    Name: { type: String, required: true },
    Points: { type: Number },
    Coins: { type: Number },
    Position: { type: String },
    Disabled: { type: Boolean },
    Carts: {
      Total: { type: Number },
      CreatedAt: { type: Date },
      Products: {
        Name: { type: String },
        Price: { type: Number },
        Quantity: { type: Number },
        idCate: { type: String, ObjectId },
      },
    },
  },
  {
    versionKey: false,
  }
);

module.exports =
  mongoose.models.register || mongoose.model("register", register);
