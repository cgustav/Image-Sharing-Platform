const {Image} = require('../models');


module.exports = {

     async popular(){
         //Traer desde la bd 9 imágenes ordenadas descendentemente según sus likes 
        const images =  await Image.find()
        .limit(9)
        .sort({likes : -1});
        return images;
    }
}