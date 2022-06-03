const initial = (bd)=>{
    const Roles = bd.model("roles", require("../models/role.model"));

    Roles.estimatedDocumentCount((err, count) =>{
    if(!err && count === 0){
      new Roles({
        nombre: 'admin'
      }).save(err => {
        if (err) {
          console.log("error", err);
        }
      })
      console.log("Rol admin creado!")
      new Roles({
        nombre: 'usuario'
      }).save(err => {
        if (err) {
          console.log("error", err);
        }
      })
      console.log("Rol usuario creado!")
    }
  })
  }
  
  module.exports = {
    initial,
  };
  