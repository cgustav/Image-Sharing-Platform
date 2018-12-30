//Para manejar todas las funciones (controllers) relacionados con el routing de nuestro servidor
//Un controlador es un objeto con funciones para exportar 

const control = {};
const { Image } = require('../models');
const sidebar = require('../helpers/sidebar');
//Función Asíncrona (async -- await) debido a que se ejecuta una consulta a la BD y esta consulta requiere tiempo

//Función que se encarga de renderizar el contenido de /views/partials/index
control.index = async (req, res) => {
    //para ordenar desde los registros más nuevos //forma ascendente 1, de menor a mayor -1
    const images = await Image.find().sort({ timestamp: 1 });
    //crea let view model con arreglo vacío para las imagenes
    let viewModel = { images: [] };
    //se llena el arreglo con los objetos rescatados desde la base de datos
    viewModel.images = images;
    //se ejecutan las funciones que obtienen los valores pertinentes: ultimos comentarios, estadísticas y otras weas
    viewModel = await sidebar(viewModel);
    //renderizando weas
    res.render('index', viewModel);
    //console.log(viewModel);
};

control.error = (req, res) => {

    //let viewModel = LoadSidebarContent();

    const message = {
        title: "Sorry, something went wrong!",
        detail: "Maybe you are looking for something that does not exists. Or is no longer available",
        link: "/",
        layout: 'submain.hbs'
    };

    res.render('error', message);
}

//LOAD SIDEBAR CONTENT VIA AJAX


module.exports = control;