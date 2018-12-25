//se requiere express para llamar a su modulo de routes
const express = require('express');
//Router es un objeto que nos permite las rutas del servidor
const router = express.Router();

const home = require('../controllers/home');
const image = require('../controllers/image');
module.exports = app =>{
    //Ruta que muesta un texto simple de verificación del funcionamiento del servidor
    /*
    app.get('/', (req,res) =>{
        res.send('Index page');
    });
    */
   //Las rutas para manipulación de los recursos específicos en el servidor
   // Cuando el usuario Envía un petitición HTTP que coincida con el siguiente verbo http y ruta (donde efectivamente exista un recurso)realizar [controlador.función] acción
   //
    router.get('/', home.index);
    //dirige a un recurso con id [image_id] dentro de la seccion de imagenes 
    router.get('/images/:image_id', image.index);
    //RUTA POST: enrutador para subir imagenes
    router.post('/images', image.create);
    //RUTA POST: para dar likes a una imagen con id [image_id]
    router.post('/images/:image_id/like', image.like);
    //RUTA POST: para comentar una imagen con id [image_id]
    router.post('/images/:image_id/comment', image.comment);
    //RUTA DELETE:para eliminar una imagen con id [image_id]
    router.delete('/images/:image_id', image.deletion);

    app.use(router);
};