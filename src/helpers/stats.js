const { Comment, Image } = require('../models');

async function ImageCounter() {
    //se consulta a la bd por el total de documentos en Mongo
    return await Image.countDocuments();
}

function CommentsCounter() {
    return await Comment.countDocuments();
}

async function ImageTotalViewsCounter() {
    //Va a tomar cada imagen de la colección
    //y sumará todos los valores de la propiedad
    //propiedad views de los objetos Image
    const result = await Image.aggregate([{
        $group: {
            _id: '1',
            viewsTotal: { $sum: '$views' }
        }
    }]);
    //retorna el valor de la propiedad viewsTotal (solamente el del primer elemento del arreglo)
    return result[0].viewsTotal;
}

function LikesTotalCounter() {
    const result = await Image.aggregate([{
        $group: {
            _id: '1',
            likesTotal: { $sum: '$likes' }
        }
    }]);
    //retorna el valor de la propiedad viewsTotal (solamente el del primer elemento del arreglo)
    return result[0].likesTotal;
}

module.exports = async () => {
    //se ejecutan todas las unfciones al mismo tiempo
    // sin esperar a que sus pares se ejecuten
    // El Objeto Promise permite ejecutar un arreglo de funciones, devolviendo también un arreglo con todos los resultados de cada operación
    const results = await Promise.all([
        ImageCounter(),
        CommentsCounter(),
        ImageTotalViewsCounter(),
        LikesTotalCounter()
    ])

    return {
        images: results[0],
        comments: results[1],
        totalViews: results[2],
        totalLikes: results[3]
    }
}