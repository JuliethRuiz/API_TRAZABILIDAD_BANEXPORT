
const express = require("express");
const router = express.Router();
const authJwt  = require("../middlewares/authJwt")
const controller = require("../controllers/user.controller")

router.use(function (req, res, next) {
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token,Origin, Content-Type, Accept"
    );
    next()
})

router.get("/", controller.getUsers)


module.exports = router