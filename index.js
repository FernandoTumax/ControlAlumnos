'use strict'

var mongoose = require('mongoose');
var app = require('./app')

var port = 3200

mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', false);

mongoose.connect('mongodb://localhost:27017/ControlAlumnoAM', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() =>{
        console.log("La conexion a la base de datos esta funcionando correctamente");
        app.listen(port, ()=> {
            console.log('El servidor esta encendido');
        })
    }).catch(err => {
        console.log("El error es: ", err)
    })