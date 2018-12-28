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
    //objeto que contiene los elementos que pertenecen a la vista
    const viewModel = {image: {}, comments:{}};
    //acciones dentro de la funcion index
    //buscsando todas las imagenes que cumplan con el parámnetro (id)
    //donde filename conincida con una expresión regular refernciando al id de la imagen
    const result = await Image.findOne({ filename: { $regex: req.params.image_id } });

    if (result) {
        viewModel.image = result;
        //Actualizando las vistas (views) a la imagen 
        result.views = result.views + 1;
        await result.save();
        const comments = await Comment.find({ image_id: result._id });
        viewModel.comments = comments;
        //renderizando images.hbs
        //pasando el objeto obtenido desde mongo a images.hbs a través de un objeto 'result' y 'comments'
        res.render('images', viewModel);
    }else{
        res.status(500).json({ error: 'Internal Error' });
    }
    
    
    
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

control.like = async (req, res) => {
    //acciones para la creación de likes dentro de una imagen 
   const image =  await Image.findOne({filename: {$regex: req.params.image_id}});
    if (image) {
        image.likes = image.likes + 1;
        await image.save();
        res.json({likes: image.likes});
    }else{
        res.status(500).json({error: 'Internal Error'});
    }
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
    }else{
        res.redirect('/index');
    }

    //console.log(newComment);

};

control.deletion = async (req, res) => {
    //acciones para la eliminar una imagen
    const image = await Image.findOne({filename: {$regex: req.params.image_id}});

    if (image) {
        //Eliminando del alamacenamiento en servidor
        await fs.unlink(path.resolve('./src/public/upload/'+ image.filename));
        //Eliminando comentarios relacionados a la imagen en Mongo
        await Comment.deleteOne({image_id: image._id});
        //Eliminando imagen en Mongo
        await image.remove();
        //Devolviendo la confirmación de la eliminación de la imagen  
        res.json(true);
    }else{
        res.json({response: 'Bad request.'});
    }
};

module.exports = control;



//Para comprobar si un objeto (request) está vacío
//FIXME: ¿Debe ir en carpeta helpers, se debe crear un helper dentro de esta carpeta o está bien que vaya aquí?
/*
function isEmpty(obj) {
    if (Object.keys(obj).length === 0 ) {
        return true;
    }
    return false;
}
*/