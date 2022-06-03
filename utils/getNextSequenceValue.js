
const counterModel = require("../models/identity");

async function getNextValue(sequenceName) {
  const sequenceDocument = await counterModel.updateOne(
  { keyword: sequenceName },
  { $inc: { Id: 1 } },
  { new: true, upsert: true }
  );
  let id = await counterModel.findOne({ keyword: sequenceName });
  return id;
}

module.exports = {

  getNextValue
};
