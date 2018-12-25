//Para manejar todas las funciones (controllers) relacionados con el routing de nuestro servidor
//Un controlador es un objeto con funciones para exportar 

const control = {};
const {Image} = require('../models');

//Función Asíncrona (async -- await) debido a que se ejecuta una consulta a la BD y esta consulta requiere tiempo

//Función que se encarga de renderizar el contenido de /views/partials/index
control.index = async (req,res) =>{
    //res.send('<h1>Index page</h1>');
//para ordenar desde los registros más nuevos //forma ascendente 1, de menor a mayor -1
    const images = await Image.find().sort({timestamp: 1});

    //formateando weas
    res.render('index', {images});
};

module.exports = control;