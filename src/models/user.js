const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const { ObjectId } = Schema;



const userSchema = new Schema({
    user_id: { type: ObjectId },
    firstname: { type: String },
    lastname: { type: String },
    birthdate: { type: Date },
    gender: { type: String },
    email: { type: String },
    password: { type: String },
    state: { type: Boolean },
    sincedate: { type: Date, default: Date.now }
});

//Creando objeto a partir del schema
module.exports = model('User', userSchema);