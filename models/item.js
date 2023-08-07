const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

// Get item
const item = new Schema(
  {
    id: { type: ObjectId }, //khóa chính
    Name: { type: String, required: true },
    Price: { type: Number, required: true },
    Description: { type: String, required: true },
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.models.item || mongoose.model("item", item);
