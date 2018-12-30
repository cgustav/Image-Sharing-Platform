/******************************************************* */
/*       CONFIGURACIÓN DEL SERVIDOR                     */
/*******************************************************/

/* Aqui se configura express */
const path = require('path');
//este weon se encarga de mezclar la data del controlador con la vista
const exphbs = require('express-handlebars');
const morgan = require('morgan');
const multer = require('multer');
const express = require('express');
const routes = require('../routes/index');
const errorHandler = require('errorhandler');
/* se obtiene el objeto devuelto por la funcion express() */
module.exports = app => {
    
    //leyendo una variable de entorno (ENVIRONMENT)
    //si es undefined o null el puerto por defecto es 3000
    app.set('port', process.env.PORT || 3000);

    /************************************************** */
    /*       Views y Handlebars Engine                 */
    /****************************************************/
    //Path se utiliza para concatenar directorios [path con la carpeta]
    //__dirname es una variable de js (global) que indica el path desde donde se está ejecutando el script
    app.set('views', path.join(__dirname, '../views'));
    //configurando handlebars, se le indica la carpeta de views para hacer
    //funcionar a [handlebars]
    app.engine('.hbs', exphbs({
        //definiendo el layout por defecto
        defaultLayout: 'main',
        //Los parciales son un tipo de componentes definidos en el controller
        partialsDir: path.join(app.get('views'), 'partials'),
        //Todas las vistas de la aplicación
        layoutsDir: path.join(app.get('views'), 'layouts'),
        //Nombre de la extensión del archivo que tiene que leer la wea
        extname: '.hbs',
        //Helpers son funciones que ayudan a cumplir tareas repetitivas o que requieren de una lógica compleja, separada de las demás funciones 
        helpers: require('./helpers')
    }));
    //Utilizando el engine handlebars
    app.set('view engine', '.hbs');


    /************************************************** */
    /*                    Middlewares                   */
    /****************************************************/

    app.use(morgan('dev'));

    /** A través del [multer], cuando se realice un submit con una propiedad image enviada en un HTTP request, ese archivo:
     * se guardará en public/upload/temp
     * y solo se permitirá guardar 1 imagen
     * Para esto se hace uso del módulo multer
     */
    app.use(multer({ dest: path.join(__dirname, '../public/upload/temp') }).single('image'));
    /* */
    /**
     * UrlEncoded es una función middleware de express para parsear peticiones con payloads urlencoded (de datos que vengan a través de formularios)
     * (desde las plantillas html)
     */
    app.use(express.urlencoded({ extended: false }));
    /* AJAX 
    para manejar los likes
    */
    app.use(express.json());


    
    /************************************************** */
    /*                    Routes                        */
    /****************************************************/

    //enviamos variable a routes/index.js
    routes(app);
    //static files : se configura carpeta public
    app.use('/public', express.static(path.join(__dirname, '../public')))



    /************************************************** */
    /*                    Error Handlers                */
    /****************************************************/


/** manejando variables de entorno de desarrollo 
 * si nos encontramos en entorno development
 * se utilizará el módulo de errorhandler (manejo de errores)
*/
    if('development' === app.get('env')){
        app.use(errorHandler);
    }
/* Retornando el objeto APP (ya configurado) */
    return app;
}