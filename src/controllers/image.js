//Todas las funciones (controllers) para las imágenes
const path = require('path');
const { generateRandomId } = require('../helpers/libs');
//importando fileSystem Extra
const fs = require('fs-extra');
//Importando módulo md5 para generar HASH
const md5 =  require('md5');
//importando el modelo 
const { Image, Comment } = require('../models');
const control = {};

control.index = async (req, res) => {
    //acciones dentro de la funcion index
    //buscsando todas las imagenes que cumplan con el parámnetro (id)
    //donde filename conincida con una expresión regular refernciando al id de la imagen
    const result = await Image.findOne({ filename: { $regex: req.params.image_id } });
    console.log(result);
    //renderizando images.hbs
    //pasando el objeto obtenido desde mongo a images.hbs a través de un objeto 'result'
    res.render('images', { result });
};

control.create = async (req, res) => {

    const saveImage = async () => {
        //---> Generando random Id para la imagen a subir
        const imageId = generateRandomId();
        //--> {Buscando todas las imagenes que coincidan con el randomId generado}
        const images = await Image.find({ filename: imageId });
        //Si se encuentran coincidencias, volver a generar id
        if (images.length > 0) {
            //TODO: RECURSIVIDAD: una función que se llama a si misma 
            saveImage();
        } else {

            //TODO:obteniendo datos de la imagen subida

            //---> Obteniendo la extensión del archivo
            const ext = path.extname(req.file.originalname).toLowerCase();
            //---> Obteniendo el path del archivo
            //req.file se toma desde el paquete multer 
            const imageTempPath = req.file.path;

            //---> Generando una URL para el almacenamiento del archivo en el servidor
            const targetPath = path.resolve('src/public/upload/' + imageId + '' + ext + '');
            //console.log('el path es', targetPath);

            if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif') {
                //el método rename del módulo filesystem extra permite mover un archivo de un directorio a otro
                //Dado que rename funciona de manera asíncrona, se hace necesario hacer uso de Async Await
                //console.log('processing...')
                await fs.rename(imageTempPath, targetPath);
                //Creando objeto según modelo Image importado para luego ser almacenado en la BD
                const newImg = new Image({
                    title: req.body.title,
                    filename: imageId + ext,
                    description: req.body.description
                });
                //Guardando de manera asíncrona en la BD
                const imageSaved = newImg.save();
                //res.redirect('/images');
                //console.log(newImg);
                res.redirect('/images/' + imageId);
            } else {
                //en caso de que el ususario suba un archivo sin la extensión permitida: eliminar el archivo de la carpeta temporal
                //Unlink es una función de fs extra que permite eliminar un archivo
                await fs.unlink(imageTempPath);
                //Se devuelve un codigo http 500 (error interno del servidor) junto a un JSON con el mensaje de error correspondiente
                res.status(500).json({ error: 'Only images are allowed' });
            }

        }
    };

    saveImage();

};

control.like = (req, res) => {
    //acciones para la creación de likes dentro de una imagen 
};

control.comment = async (req, res) => {
    //acciones para la creación de comentarios dentro de una imagen
    //---> Se busca el objeto de la imagen según el id de imagen capturado por el request.
    const imageFore = await Image.findOne({ filename: { $regex: req.params.image_id } });
    //---> si coincide.
    if (imageFore) {
        //creando un nuevo modelo de comentario a partir del request body
        const newComment = new Comment(req.body);
        //hash MD5 para cifrar el correo para el servicio gravatar
        newComment.gravatar = md5(newComment.email);
        //Relacionando el comentario con un objeto de imagen ya existente
        newComment.image_id = imageFore._id;
        //Guardando comentario en la base de datos
        await newComment.save();

        //console.log(newComment); 
        res.redirect('/images/'+imageFore.uniqueId);
    }

    //console.log(newComment);

};

control.deletion = (req, res) => {
    //acciones para la eliminar una imagen
};
module.exports = control;