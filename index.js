require("dotenv").config();

const express = require("express");
const fs = require("fs");
const https=require('https');
const app = express();
const cors = require("cors");
const authJwt=require("./middlewares/authJwt");


//Configuracion de las bases de datos
const configBase = require("./utils/config.json")

const port = 3001;
const mongoose = require("mongoose"); 
const { initial } = require('./utils/initApp')

app.use(cors());
app.use(express.json());

app.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});


app.get(("/"),function(req,res){
  res.send('server loading')
})

mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
})
.then(() => {
  console.log("Mongodb connected...");
});


const authRouter = require("./routes/auth.routes"); 
app.use("/auth", authRouter); 

const userRouter = require("./routes/user.routes"); 
app.use("/users", userRouter);  

const filesRouter = require("./routes/files"); 
app.use("/files", filesRouter); 

app.listen(port, () => {
  console.log(`server running at port :${port}`);
});