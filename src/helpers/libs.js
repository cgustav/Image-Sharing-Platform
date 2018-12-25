//Aquí almacenaremos funciones de ayuda para el resto de nuestra aplicación

const helpers = {};

//Función de ayuda para generar id único para las imágenes
helpers.generateRandomId = () =>{
    const possible = 'abcdefghijklmnopqrstuvwxyz0123456789_';
    let randomKeyId = 0;
    for (let i = 0; i < 7; i++) {
        //seleccionando un caracter aleatorio (de 7 dígitos) dentro del string 
        randomKeyId += possible.charAt(Math.floor(Math.random() * possible.length));
        
    }
    return randomKeyId;
}
module.exports = helpers;