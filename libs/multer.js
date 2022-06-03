//Permite configurar el endpoint
const aws = require('aws-sdk') 
const multer = require('multer')
const multerS3 = require('multer-s3')


//Variables de entorno => archivo .env
const { S3_ENDPOINT, BUCKET_NAME } = process.env;

//Configuración URL S3 aws
const spacesEndpoint = new aws.Endpoint(S3_ENDPOINT);
const s3 = new aws.S3({
    endpoint: spacesEndpoint,
  });
  
//Configuración almacenamiento de los archivos
// bucket=>Nombre del space 
// acl => permisos de los archivos
// metadata => que datos se van a guardar
// key => Colocar el nombre con la ext de la imagen
const upload = multer({
    storage: multerS3({
        s3,
        bucket: `${BUCKET_NAME}/trazabilidad`,
        acl: 'public-read',
        metadata: (req, file, cb) => {
          // console.log("file",file);
            cb(null, {
              fieldName: file.fieldname,
            });
          },
          key: (request, file, cb) => {
            // console.log("req",file);
            cb(null, `${Date.now().toString()}_${file.originalname}`);
          },
    })
}).array('file') // Nombre del input para subir los archivos, single => uno, array => varios

module.exports = {
    upload,
    s3
}