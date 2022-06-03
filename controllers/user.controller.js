
const Usuario = require("../models/user.model");



  // exports.userBoard = (req, res) => {
  //   res.status(200).send("User Content.");
  // };
  
  // exports.adminBoard = (req, res) => {
  //   res.status(200).send("Admin Content.");
  // };

  exports.getUsers = async (req,res) =>{
   const usuarios = await Usuario.find({}).populate(['puntos', 'roles'])
    res.status(200).send(usuarios)
  }