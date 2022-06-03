const express = require("express");
const router = express.Router();
const { getNextValue } = require('../utils/getNextSequenceValue')
const { connection } = require('../utils/connection')
const { upload, s3 } = require("../libs/multer");
const { S3_ENDPOINT, BUCKET_NAME } = process.env;
const modeloFiles = require("../models/files")
const modeloIncrement = require("../models/identity")
const Soportes = req =>
  req.files.map((file) => {
    const soportes = {
      name: file.key,
      url: file.location,
      type: file.mimetype,
      size: file.encoding,
    };
    return soportes;
  });

router.get("/", async (req, res) => {
  try {
    const files = await modeloFiles.find().sort({ id: -1 });
    res.json(files);
    
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});


router.get("/:id", async (req, res) => {
  try {
    let id = req.params.id;; 
    const files = await modeloFiles.find({
      id: id,
    });
    res.json(files);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

router.post("/", async (req, res, next) => {
  upload(req, res,async function (error) {
  try {
    const resultId = await getNextValue("Id_File");
    const id = resultId.Id
    const dataSoportes = Soportes(req)
    console.log(dataSoportes)
    const data = { 
      id: id,
      ...dataSoportes[0]
   };
    const newFile = new modeloFiles(data);
    newFile.save(function (err, result) {
      err ? console.log(err) : res.json(result);
    });
    
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
});

router.patch("/:id",async (req,res)=>{
  upload(req, res,async function (error) {
  if(req.body.filesDelete.length > 0){
    var params = {
        Bucket: `${BUCKET_NAME}`, 
        Delete: {
          Objects: JSON.parse(req.body.filesDelete), 
        }
      };
      s3.deleteObjects(params, function(err, data) {
        if (err) console.log(err)     
        else console.log(data);   
      });
  }
  const dataSoportes = Soportes(req)
  const soportes = [...dataTercero.Soportes, ...dataSoportes]
  res.json(response)
});
})


module.exports = router;
