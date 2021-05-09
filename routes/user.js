var express = require('express');

var userController = require('../controller/user');

var api = express.Router();

api.get('/getUsers', userController.getUser);

api.post('/saveUser', userController.registerUser);

api.post('/login', userController.login);

api.put('/alumn/updateAlumn/:id', userController.updateAlumno);

api.delete('/alumn/removeAlumn/:id', userController.removeAlumn);

//ingresar cursos

api.put('/maestro/setCurso/:id', userController.setCurso);

api.put('/maestro/:idU/updateCurso/:idC', userController.updateCurso);

api.put('/maestro/:idU/removeCurso/:idC', userController.removeCurso);

module.exports = api;