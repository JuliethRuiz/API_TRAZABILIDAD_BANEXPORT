const mongoose = require("mongoose");

const filesSchema = new mongoose.Schema(
  {
  
  },
  {
    versionKey: false,
    strict: false,
  }
);

module.exports =  mongoose.model("files", filesSchema);
