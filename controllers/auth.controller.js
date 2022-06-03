//Archivo de configuración

const config = require("../config");

const Usuario = require("../models/user.model");
const Roles = require("../models/role.model");

//Librería autenticación JWT
const jwt = require("jsonwebtoken");

//Librería para encriptar las contraseñas
const bcrypt = require("bcrypt");

//Librería para enviar los correos de recuperación
const nodemailer = require("nodemailer");
const { connection } = require('../utils/connection');

//Registro Usuarios
exports.signup = async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password.trim(), 10);
  const user = new Usuario({
    nombreUsuario: req.body.nombreUsuario.toLowerCase().trim(),
    idUsuario: req.body.idUsuario,
    email: req.body.email,
    password: hashedPassword,
  });

  user.save((err, usuario) => {
    if (err) {
      res.status(500).send({ message: "El usuario ya existe" });
      return;
    }

    if (req.body.roles) {
      Roles.find(
        {
          nombre: { $in: req.body.roles },
        },
        (err, roles) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          usuario.roles = roles.map((role) => role._id);
          usuario.save((err) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }
            res.send({ message: "Usuario registrado con éxito" });
          });
        }
      );
    } else {
      Roles.findOne({ nombre: "usuario" }, (err, role) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        user.roles = [role._id];
        user.save((err) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          res.send({ status: true, message: "Usuario registrado con éxito" });
        });
      });
    }
  });
};

exports.signin = async (req, res) => {

 const query = [
 
  {
    path: 'roles',
  }
]
  const user = await Usuario.findOne({nombreUsuario: req.body.nombreUsuario.toLowerCase().trim(), estado: true }).populate(query)
   //console.log(user)
   try {
         if (!user) {
        return res.send({ statusLogin: false, message: "Usuario o contraseña incorrectos" });
      }

      var passwordIsValid = await bcrypt.compare(
        req.body.password.trim(),
        user.password
      );
      if (!passwordIsValid) {
        return res.send({
          accessToken: null,
          message: "Usuario o contraseña incorrectos",
          statusLogin: false,
        });
      }

      const payload = { id: user.idUsuario, roles: user.roles, nombreUsuario: user.nombreUsuario}
      var token = jwt.sign(payload, config.config.apiKey, {
        expiresIn: 86400, // 24 HORAS
      });

      await Usuario.updateOne({ _id: user._id }, { $set: { token: token } }).catch(error => { console.log(error) });

      var authorities = [];

      for (let i = 0; i < user.roles.length; i++) {
        authorities.push(user.roles[i].nombre.toUpperCase());
      }
      return res.status(200).send({
        id: user.idUsuario,
        // sede:user.puntos,
        // idDocumento: user.idUsuario,
        nombreUsuario: user.nombreUsuario,
        // email: user.email,
        roles: authorities,
        accessToken: token,
        statusLogin: true,
      });
   }catch (error){
  //  if (error) {
  //       res.status(500).send({ statusLogin: false, message: error });
  //       return;
  //     }
  console.log(error)
   }

 
};

exports.sendMail = async (infoMail) => {
  try {
    const { host, secure, port, service, pass, user } = config.config

    const transporter = nodemailer.createTransport({
      host,
      secure,
      port,
      service,
      auth: { user, pass }
    });

    await transporter.sendMail(infoMail)

    return { success: true, message: 'Revise su correo electrónico para ver si hay un enlace para restablecer su contraseña. Si no aparece en unos minutos, revise su carpeta de spam.' };
  } catch (error) {
    return { success: false, message: 'Error' };
  }
}


exports.resetPassword = async (req, res, next) => {

  try {
  let conn = connection(req);
    const modeloUsuarios= conn.model("usuarios", require("../models/user.model"));
    const usuario = await modeloUsuarios.findOne({ email: req.body.email })
    if (!usuario) {
      return res.send({ success:false,statusLogin: false, message: "Usuario no encontrado" });
    }

    const payload = { sub: usuario.idUsuario };
    const token = jwt.sign(payload, config.config.apiKey, { expiresIn: '15min' });
    const link = `${config.config.urlServidor}/${req.params.sede}/change-password?token=${token}`;
    await modeloUsuarios.updateOne({ _id: usuario._id }, { $set: { recoveryTokenField: token } }).catch(error => { console.log(error) });
    
    
    const mail = {
      from: config.config.user,
      to: `${usuario.email}`,
      subject: "Email para recuperar contraseña:",
      html: `<b>Ingresa a este link => <a href="${link}">Clic aquí</a></b>`,
    }
    const rta = await exports.sendMail(mail);
    res.json(rta);

  } catch (error) {
    res.json(error)
  }
}

exports.changePassword = async (req, res, next) => {
  try {
    let conn = connection(req);
    const modeloUsuarios= conn.model("usuarios", require("../models/user.model"));
    const payload = jwt.verify(req.body.token, config.config.apiKey);
    const usuario = await modeloUsuarios.findOne({ idUsuario: payload.sub })

    if (!usuario) {
      return res.status(404)
        .send({ success: false, message: "Usuario no encontrado" });
    }

    //Se verifica si el token de recuperación es igual al recibido por los usuarios.
    if (usuario.recoveryTokenField !== req.body.token) {
      return res.status(404)
        .send({ success: false, message: "Ha ocurrido un error, intente de nuevo" });
    }
  
    const hash = await bcrypt.hash(req.body.password.trim(), 10);  
    modeloUsuarios.updateOne({ _id: usuario._id }, { $set: { recoveryTokenField: null, password: hash } }).catch(error => { console.log(error) });
    res.json({ success: true, message: 'Contraseña Actualizada' });
  } catch (error) {
    res.json({ success: false, message: `Ha ocurrido un error, intente de nuevo` })
  }
}

exports.usuarioAdministrador  = async (req, res, next) => {

  let conn = connection(req);
  const usuarios= conn.model("usuarios", require("../models/user.model"));
  const rolesUsuario= conn.model("roles", require("../models/role.model"));

  // const usuario = await usuarios.findById(req.usuarioId)
  // const roles =  await rolesUsuario.find({_id:{$in: usuario.roles}})

  // for (let i = 0; i < roles.length; i++) {
  //   if(roles[i].nombre === "usuario"){
  //     next()
  //     return
  //   }
  // }
return res.status(403).json({mensaje : "Requiere un rol de usuario "})
}