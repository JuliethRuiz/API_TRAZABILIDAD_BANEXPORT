const { connection } = require('../utils/connection')
const User = require("../models/user.model");
const ROLES = require("../models/role.model");

const checkDuplicate = async(req, res, next)=>{

console.log("req",req.body)

const nombre = await User.findOne({  nombreUsuario: req.body.nombreUsuario.toLowerCase()});
const email = await User.findOne({  email: req.body.email.toLowerCase()});
const id = await User.findOne({  idUsuario: req.body.idUsuario});

try {
    if(nombre || email || id){
        console.log("def")
       res.status(400).send({status: false,message: "El usuario ya existe 1"})
        return
    }
    next()
} catch (error) {
    
}
}

const checkRoles = (req, res, next) => {

    if(req.body.roles){
        for(let i = 0; i < req.body.roles.length; i++){
            if(!ROLES.includes(req.body.roles[i])){
                res.status(400).send({
                    message: `Error el ${req.body.roles[i]} no existe`
                })
            }
        }
    }
    next()
}

const verifySignUp = {
    checkDuplicate,
    checkRoles
}

module.exports = verifySignUp