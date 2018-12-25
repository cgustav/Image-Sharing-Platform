const { Schema, model } = require('mongoose');

const { ObjectId } = Schema;
//Indicamos que le atributo image_id hace referencia a la id de otro objeto 
const commentSchema = new Schema({
    image_id: { type: ObjectId },
    email: { type: String },
    name: { type: String },
    gravatar: { type: String },
    comment: { type: String },
    timestamp: { type: Date, default: Date.now }
});

//Creando objeto a partir del schema
module.exports = model('Comment', commentSchema);