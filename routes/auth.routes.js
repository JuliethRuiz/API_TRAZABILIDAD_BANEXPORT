const express = require("express");
const router = express.Router();
const verifySignUp = require("../middlewares/verifySignUp");
const controller = require("../controllers/auth.controller");
const authJwt = require("../middlewares/authJwt");

router.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

// router.get("/signin", [authJwt.verifyToken], (req, res) => {
//   res.send({ res: "Servidor Banexport" });
// });

//Rutas registro
router.post("/signup",[verifySignUp.checkDuplicate, verifySignUp.checkRoles],controller.signup);

//Rutas inicio de sesión
router.post("/signin", controller.signin);

router.get("/", [authJwt.verifyToken],(req, res, next) => {
      
      res.send({success:true});
      next()
  });


router.get("/:sede/ad/:id", [authJwt.admin(["admin", "operativo"])],(req, res) => {
    res.send({ res: "Servidor Banexport" });
});

// router.get("/:sede/op/:id", [authJwt.operativo],(req, res) => {
//   res.send({ res: "Servidor Banexport" });
// });
//Rutas solicitud cambio contraseña
router.post("/reset",  controller.resetPassword);

//Rutas actualización contraseña
router.post("/change",  controller.changePassword);




module.exports = router;