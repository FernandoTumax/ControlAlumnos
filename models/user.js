'use strict'

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = Schema({
    name: String,
    lastname: String,
    username: String,
    password: String,
    phone: String,
    rol: String,
    cantidadCurso: Number,
    cursos: [{
        name: String,
        description: String
    }]
});

module.exports = mongoose.model('user', userSchema);