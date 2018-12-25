//Información relacionada a las imágenes //#endregion
//Obtenemos mongoose
const mongoose = require('mongoose'); 
//Obtenemos el constructor schema desde mongoose
const { Schema } = require('mongoose');
const path =  require('path'); 


//TODA LA INFORMACIÒN CON RESPECTO A LAS IMAGENES

const imageSchema = new Schema({
    title: { type: String },
    description: { type: String },
    filename: { type: String },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    timestamp: { type: Date, default: Date.now }
});
//variable virtual: No se generará en la BD, si no que se utilizará al llamar un objeto de este modelo
imageSchema.virtual('uniqueId')
.get(function () {
    //UniqueId quita la extensión al filename (el archivo guardado en /public/upload) y obtiene el nombre autogenerado del archivo, utilizándolo como una id única
    return this.filename.replace(path.extname(this.filename), '');
});
//Creando un nuevo modelo a partir de un esquema
// creando [Image] a partir de [ImageSchema]
module.exports =  mongoose.model('Image', imageSchema);



