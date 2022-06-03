const { connection } = require("../utils/connection");
const { getNextSequenceValue } = require("../utils/getNextSequenceValue");
const config = require("../config");
const documentos = require("../models/documentos")
//Librería para encriptar las contraseñas
const bcrypt = require("bcrypt");
//Librería para enviar los correos de recuperación
const nodemailer = require("nodemailer");
const Puntos = require("../models/puntos");

exports.recibos = async (req, res) => {
    try {
     
        const modeloIncrement = conn.model("autoincrements", require("../models/identity"));
        const idNext = await getNextSequenceValue("Id_Recibo", modeloIncrement);
        const id = idNext.sequence_value;
        req.body.Id = `RB${id.toString().padStart(6, "0")}`;
        console.log(req.body);
        const newRecibo = new documentos(req.body);
        const data = await newRecibo.save();
        res.json(data);
    } catch (error) {
        res.status(500).send(err);
    }
};

exports.getRecibos = async (req, res) => {
    try {
      
        const recibos = await documentos.find({ Id: { $regex: "RB" } }).sort({_id: -1});
       
        res.json(recibos);
    } catch (error) {
        res.status(500).send(error);
    }
};

exports.updateRecibo = async (req, res) =>{
    let conn = connection(req);
    const documentos = conn.model(
        "documentos",
        require("../models/documentos")
    );
    const recibos = await documentos.updateOne({Id: req.body.Id},{...req.body})
    // console.log(recibos)
    res.send(req.body)
}

exports.pedidos = async (req, res) => {

    try {
        const idNext = await getNextSequenceValue( req.body.sede._id, Puntos, "Pedido");
        const id = `${idNext.documentos[0].prefijo}${idNext.documentos[0].id.toString().padStart(6, "0")}`;
        req.body.IdDocumento = id;
        req.body.TipoDocumento = idNext.documentos[0].keyword
        const newRecibo = new documentos(req.body);
        const data = await newRecibo.save();
        res.json(data);
    } catch (error) {
        res.status(500).send(error);
    }
};

exports.getPedidos = async (req, res) => {
    try {
        const recibos = await documentos.find({ 'sede._id': req.params.sede, IdDocumento: { $regex: "OP" } }).sort({_id: -1});
        res.json(recibos);
    } catch (error) {
        res.status(500).send(error);
    }
};

exports.updatePedido = async (req, res) =>{

  const recibos = await documentos.updateOne({IdDocumento: req.body.IdDocumento},{...req.body})
  if(req.body.Estado == "Aprobado"){
    const idNext = await getNextSequenceValue( req.body.sede._id, Puntos, "Recibo");
    const id = `${idNext.documentos[0].prefijo}${idNext.documentos[0].id.toString().padStart(6, "0")}`;
    const remision = await documentos.updateOne({IdDocumento: req.body.IdDocumento},{IdRecibo: id})
    const dataDetalle =  req.body.detalle.map(item=>({...item, "IE": "I"}))
    const dataRecibo = {
        IdDocumento: id,
        fecha: req.body.fecha,
        PuntoInicial: req.body.sede,
        PuntoFinal: req.body.sede,
        Usuario: req.body.Usuario,
        TipoDocumento: idNext.documentos[0].keyword,
        detalle:  dataDetalle,
        Estado : 'En proceso'
    }
    const newRecibo = new documentos(dataRecibo);
    const responseRecibo = await newRecibo.save();
   
}else{
   

}
  // if(req.body.Estado == 'Aprobado'){
    //     const mensaje =  `
    //     <!DOCTYPE html>
    //     <html lang="en">
    //     <head>
    //         <meta charset="UTF-8">
    //         <meta name="viewport" content="width=device-width, initial-scale=1.0">
    //         <meta http-equiv="X-UA-Compatible" content="ie=edge">
    //         <style>
    //         .right{
    //             text-align: right;
    //         }
    //          td, th {
    //             text-align: left;
    //             padding: 8px;
    //           }

    //           table {
    //             border-collapse: collapse;
    //             border: 1px solid #ddd;
    //           }

    //           tr:nth-child(even){
    //               background-color: #f2f2f2
    //             }
            
    //           .logo {
    //             float: right
    //           }
    //         </style>
    //         </head>
    //         <body>
    //         <div class="logo">
    //           <img class="header-logo-img" src="https://cafe18.com.co/wp-content/uploads/2021/11/logohorizontal.png" width="230" height="85" alt="Café 18">
    //         </div>
    //     <h4>Orden Pedido: ${req.body.Id}</h4>
    //     <h4>Proveedor: ${req.body.proveedor}</h4>
    //     <h4>Creada por: ${req.body.personaResponsable}</h4>
    //     <h4>Fecha Pedido: ${new Date(req.body.fecha).toISOString().split("T")[0]}</h4>
    //     <h4>Fecha Entrega: ${new Date(req.body.FechaEntrega).toISOString().split("T")[0]}</h4>
    //     <h4>Forma Pago: ${req.body.FormaPago}</h4>
    //     <div>
    //       <h4>Información de contacto: Paola Chacón</h4>
    //       <h4>Teléfono: 320 2876489 </h4>
    //     </div>
    //     <div>
    //       <h4>Información de Entrega: </h4>
    //       <h4>Dirección: Carrera 9 No. 70 A - 35, piso 5 ° Edificio Andes</h4>
    //      </div>
    //     <table>
    //     <thead>
    //       <tr>
    //         <th>Nombre</th>
    //         <th>Cantidad</th>
    //         <th>Precio</th>
    //         <th>Base Iva</th>
    //         <th>Valor Iva</th>
    //         <th>Total</th>
    //       </tr>
    //     </thead>
    //     <tbody>
    //       ${req.body.detalle.map((producto, id) => (
    //        `<tr>
    //           <td class="right">${producto.name}</td>
    //           <td class="right">${producto.quantity}</td>
    //           <td class="right">$ ${producto.precio}</td>
    //           <td class="right">$ ${producto.baseIva}</td>
    //           <td class="right">$ ${producto.valorIva}</td>
    //           <td class="right">$ ${producto.total}</td>
    //         </tr>`
    //       ))}
    //     </tbody>
    //   </table>
    //   <br/>
    //   <br/>
    //   Atentamente,
    //   <br/>
    //   <b>${req.body.personaResponsable}</b>
    //   </body>
    //   </html>
    //     `

    //     const mail = {
    //         from: config.config.user,
    //         to: `${req.body.email.toLowerCase().trim()}`,
    //         subject: `Café 18 - ${req.body.Id}`,
    //         html: mensaje,
    //       }
    //       const rta = await exports.sendMail(mail);
    //       console.log(rta)
    // }
    // console.log(recibos)
    res.send(req.body)
}

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
  
      return { success: true, message: 'Revise su correo electrónico. Si no aparece en unos minutos, revise su carpeta de spam.' };
    } catch (error) {
      return { success: false, message: error };
    }
  }
  