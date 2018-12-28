const { Comment, Image } = require('../models');

module.exports = {
    //Comentarios nuevos

    async newest() {
        //Obteniendo los 5 comentarios, ordenados Descendentemente según el valor de su propiedad timestamp, (desde el más nuevo al más antiguo)
        const comments = Comment.find().limit(5).sort({ timestamp: -1 });

        for (const comment of comments) {
            const image = Image.findOne({_id: comment.image_id});
            comment.image = image;
        }

        return comments;
    }
}