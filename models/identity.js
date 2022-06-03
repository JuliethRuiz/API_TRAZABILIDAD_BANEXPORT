const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const counterSchema = new Schema({
  keyword: { type: String, required: true },
  Id: { type: Number },
});

module.exports = mongoose.model("autoincrements", counterSchema);