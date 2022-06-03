const mongoose = require("mongoose");
const rolesSchema = require("../models/role.model")

const Schema = mongoose.Schema;
const userSchema = new mongoose.Schema(
  {
  
    idUsuario: {
      type: Number,
      unique: true,
      required: true,
    },
    nombreUsuario: String,
    email: {
      type: String,
      unique: true,
      required: true, 
    },
    password: String,
    recoveryTokenField : {
      type: String,
      default: null
    },
    token : {
      type: String,
      default: null
    },
    roles: [{ type: Schema.Types.ObjectId, ref: "Rol" }],
  },
  {
    timestamp: true,
    versionKey: false,
  }
);

module.exports =  mongoose.model("usuarios", userSchema);
