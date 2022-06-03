const mongoose = require('mongoose')

const rolesSchema= new mongoose.Schema({
   nombre: String
},
{
    timestamp:true,
    versionKey:false,
}
)


module.exports =  mongoose.model("Rol", rolesSchema, "roles");
