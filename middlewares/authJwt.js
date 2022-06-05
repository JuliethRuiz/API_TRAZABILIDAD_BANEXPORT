const jwt = require("jsonwebtoken");
const config = require("../config");

const Usuario = require("../models/user.model");
const Rol=  require("../models/role.model");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1];
  
  if (!token ) {
    return res.status(401).send({ success:false, message: "Token no encontrado" });
  }
  
  jwt.verify(token, config.config.apiKey, async(err, decode) => {
    if (err) {
      return res.send({ message: "No autorizado" });
    }
   
      const user = await Usuario.findOne({ idUsuario: decode.id,estado: true })
    
    if(token === user.token){
      // return res.json({success:true, userId: decode.id})
      req.user = user
      next();
    }else{
      return res.json({success:false})
    }
  });
  next();
};


const admin = (permisos) => {
  return(req, res, next)=>{
  const user = req.params.id || req.user._id

  Usuario.findById(user).exec((err, usuario) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }


    Rol.find(
      {
        _id: { $in: usuario.roles },
      },
      (err, roles) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
       
        for (let i = 0; i < roles.length; i++) {
          if (permisos.includes(roles[i].nombre)) {
            next();
            return;
          }
        }
  
        res.status(403).send({ err:true, message: "Requiere rol de administrador!" });
        // return { message: "Require Admin Role!" };
      }
    );
  });
}
};

const operativo = (req, res, next) => {
  let conn = connection(req);
  const modeloUsuarios= conn.model("usuarios", require("../models/user.model"));
  const Rol= conn.model("roles", require("../models/role.model"));
  
  modeloUsuarios.findById(req.params.id).exec((err, usuario) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }


    Rol.find(
      {
        _id: { $in: usuario.roles },
      },
      (err, roles) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
  
        for (let i = 0; i < roles.length; i++) {
          if (roles[i].nombre === "operativo") {
            next();
            return;
          }
        }

        res.status(403).send({ err:true, message: "No autorizado" });
        // return { message: "Require Admin Role!" };
      }
    );
  });
};
const authJwt = {
  verifyToken,
  admin,
  operativo,
};
module.exports = authJwt;
