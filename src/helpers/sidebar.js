/******************************************************* */
/*         CONSTRUCCIÓN SIDEBAR CON AJAX                 */
/*******************************************************/

//Se importan las 3 secciones: comments, images y stats
const Comments = require('./comments');
const Images = require('./images');
const Stats = require('./stats');

//Exportando una función 
const rep = 0;


module.exports = async viewModel => {
    //this is the same than //#endregion
    //module.exports = async function (viewModel) {

    //        }

    //Ejecutando todas las funciones al mismo tiempo
    //----> El Objeto Promise permite ejecutar un arreglo de funciones, devolviendo también un arreglo con todos los resultados de cada operación
    const results = await Promise.all([
        Stats(),
        Images.popular(),
        Comments.newest()
    ]);
     viewModel.sidebar = {
        stats: results[0],
        popular: results[1],
        comment: results[2]
    }
    return viewModel;
}

