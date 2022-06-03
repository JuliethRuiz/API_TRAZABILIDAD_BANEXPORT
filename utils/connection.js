
const mongoose = require("mongoose"); 
const configBase = require("./config.json")
const connection =  (req) => { 
  console.log(req.params.sede)
  const bdRest = configBase.filter(base=> base.sede == req.params.sede)
  conn = req.app.get(bdRest[0].bd);
  return conn
};

module.exports = {
  connection,
};