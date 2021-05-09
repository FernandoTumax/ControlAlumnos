'use strict'

var User = require('../models/user');
var bcrypt = require('bcrypt-nodejs');
var Curso = require('../models/curso');

var controller = {
    registerUser: function(req, res){
        var user = new User();
        var params = req.body;

        if(params.name && params.lastname && params.username && params.password && params.phone && params.rol){
            if(params.rol == "ROL_ALUMNO" || params.rol == "ROL_MAESTRO"){
                User.findOne({ username: params.username }, (err, userFind) => {
                    if(err){
                        res.status(500).send({
                            message: "Error general", err
                        })
                    } else if(userFind){
                        res.status(200).send({
                            message: "datos ya utilizados"
                        })
                    }else{
                        bcrypt.hash(params.password, null, null, (err, passwordHash) => {
                            if(err){
                                res.status(500).send({
                                    message: "Error en la encriptacion de la contraseña"
                                })
                            }else if(passwordHash){
                                user.password = passwordHash;
                                user.name = params.name;
                                user.lastname = params.lastname;
                                user.username = params.username;
                                user.phone = params.phone;
                                user.rol = params.rol;
                                user.cantidadCurso = 0;
    
                                user.save((err, userSaved)=>{
                                    if(err){
                                        res.status(500).send({
                                            message: "Error al guardar los datos"
                                        })
                                    }else if(userSaved){
                                        res.status(200).send({
                                            message: "Usuario guardado con exito"
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            }else{
                res.status(401).send({
                    message: "Por favor ingrese el rol como se le indica a continuacion: ROL_ALUMNO o ROL_MAESTRO"
                })
            }
        } else {
            res.status(400).send({
                message: "Ingrese todos los datos correctos por favor"
            })
        }
    }, 
    getUser: function(req, res){
        User.find({}).exec((err, users) => {
            if(err){
                res.status(500).send({
                    message: "Error en el servidor"
                })
            }else if (users) {
                res.status(200).send({
                    message: 'usuarios encotrados', users
                })
            } else {
                res.status(204).send({
                    message: "No hay registros"
                })
            }
        })
    },
    login: function(req, res){
        var params = req.body;

        if(params.username && params.password){
            User.findOne({ username: params.username}, (err, login) => {
                if(err){
                    res.status(500).send({
                        message: "Error en el servidor"
                    })
                }else if(login){
                    if(login.rol == "ROL_ALUMNO"){
                        bcrypt.compare(params.password, login.password, (err, checkPasswordAlumn) => {
                            if(err){
                                res.status(500).send({
                                    message: "Error general en el servidor"
                                })
                            }else if(checkPasswordAlumn){
                                res.status(200).send({
                                    message: "Bienvenido alumno: ", nombre: login.name
                                })
                            }else{
                                res.status(400).send({
                                    message: "No eres rol de alumno"
                                })
                            }
                        })
                    }else if(login.rol == "ROL_MAESTRO"){
                        bcrypt.compare(params.password, login.password, (err, checkPasswordMaestro) => {
                            if(err){
                                res.status(500).send({
                                    message: "Error general en el servidor"
                                })
                            }else if(checkPasswordMaestro){
                                res.status(200).send({
                                    message: "Bienvenido Maestro: ", nombre: login.name
                                })
                            }else{
                                res.status(400).send({
                                    message: "No eres rol Maestro"
                                })
                            }
                        })
                    }
                }else{
                    res.status(200).send({
                        message: "No existen datos"
                    })
                }
            })
        }else{
            res.status(200).send({
                message: "Por favor ingrese sus datos"
            })
        }
    },
    updateAlumno: function(req, res){
        let userId = req.params.id;
        let update = req.body;
        let user = new User();

        if(update.username){
            User.findOne({username: update.username}, (err, usernameFind) => {
                if(err){
                    res.status(500).send({
                        message: "Error en el servidor"
                    })
                }else if(usernameFind){
                    res.status(200).send({
                        message: "Nombre de usuario ya existente"
                    })
                }else{
                    User.findOne({rol: "ROL_ALUMNO"}, (err, rolFind) => {
                        if(err){
                            res.status(500).send({
                                message: "Error en el servidor"
                            })
                        }else if(rolFind){
                            if(update.rol == "" || update.rol || update.password == "" || update.password || update.cantidadCurso == 0 || update.cantidadCurso){
                                res.status(200).send({
                                    message:"No se puede modificar la contraseña, el rol o la cantidad de cursos"
                                })
                            }else{
                                User.findByIdAndUpdate(userId, update, {new: true}, (err, updateUser) => {
                                    if(err){
                                        res.status(500).send({
                                            message: "Error al actualizar"
                                        })
                                    }else if(updateUser){
                                        res.status(200).send({
                                            message: "Usuario actualizado", updateUser
                                        })
                                    }else{
                                        res.status(204).send({
                                            message: "No hay registros para actualizar"
                                        })
                                    }
                                })
                            }
                        }else{
                            res.status(403).send({
                                message: "No es rol alumno"
                            })
                        }
                    }) 
                }
            })
        }else{
            res.status(404).send({
                message: "Por favor ingrese todos los campos"
            })
        }
    },

    removeAlumn: function(req, res){
        let userId = req.params.id;

        User.findOne({_id: userId, rol: "ROL_ALUMNO"}, (err, alumnFind)=>{
            if(err){
                res.status(500).send({
                    message: "Error al eliminar"
                })
            }else if(alumnFind){
                User.findByIdAndRemove(userId, (err, userRemoved) => {
                    if(err){
                        res.status(500).send({
                            message: "Error al eliminar"
                        })
                    }else if(userRemoved){
                        res.status(200).send({
                            message: "Alumno eliminado", userRemoved
                        })
                    }else{
                        res.status(204).send({
                            message: "No hay alumnos para eliminar"
                        })
                    }
                })
            }else{
                res.status(403).send({
                    message: "No es rol de alumno"
                })
            }
        })
    },
    setCurso: function(req, res){
        let userId = req.params.id;
        let paramsCurso = req.body;
        let curso = new Curso();
        User.findOne({_id: userId, rol:"ROL_MAESTRO"}, (err, userFind) => {
            if(err){
                res.status(500).send({
                    message: "Error al agregar un curso"
                })
            }else if(userFind){
                if(paramsCurso.name && paramsCurso.description){
                    curso.name = paramsCurso.name;
                    curso.description = paramsCurso.description;

                    User.findByIdAndUpdate(userId, {$push: { cursos: curso}}, {new: true}, (err, userUpdate) => {
                        if(err){
                            res.status(500).send({
                                message: "Error al guardar el curso"
                            })
                        }else if(userUpdate){
                            User.findByIdAndUpdate(userId, {$inc:{cantidadCurso: 1}}, {new: true}, (err, userInc) => {
                                if(err){
                                    res.status(500).send({
                                        message: "Error al incrementar la cantidad de cursos"
                                    })
                                }else if(userInc){
                                    res.status(200).send({
                                        message: "Curso agregado", userInc
                                    })
                                }
                            })
                        }else{
                            res.status(400).send({
                                message: "Curso no creado"
                            })
                        }
                    })
                }else{
                    res.status(200).send({
                        message: "Ingrese los datos minimos para agregar un curso"
                    })
                }
            }else{
                res.status(204).send({
                    message: "No existe el curso"
                })
            }
        })
    },
    updateCurso: function(req, res){
        let userId = req.params.idU;
        let cursoId = req.params.idC;
        let update = req.body;

        if(update.name && update.description){
            User.findOne({_id: userId, rol:"ROL_MAESTRO"}, (err, userFind) => {
                if(err){
                    res.status(500).send({
                        message: "Error General"
                    })
                }else if(userFind){
                    User.findOneAndUpdate({
                        _id: userId,
                        'cursos._id': cursoId
                    },{
                        'cursos.$.name': update.name,
                        'cursos.$.description': update.description
                    }, {new:true}, (err, cursoUpdate) => {
                        if(err){
                            res.status(500).send({
                                message: "Error general al actualizar el curso"
                            })
                        }else if(cursoUpdate){
                            res.status(200).send({
                                message: "Curso actualizado: ", cursoUpdate
                            })
                        }else{
                            res.status(401).send({
                                message: "Curso no actualizado"
                            })
                        }
                    })
                }else{
                    res.status(204).send({
                        message: "El curso no existe", userFind
                    })
                }
            })
        }else{
            res.status(200).send({
                message: "Envie los datos minimos"
            })
        }
    },

    removeCurso: function(req, res){
        let userId = req.params.idU;
        let cursoId = req.params.idC;

        User.findOneAndUpdate({_id: userId,rol: "ROL_MAESTRO", 'cursos._id': cursoId},
        {$pull: {cursos: {_id: cursoId}}}, {new: true}, (err, cursoRemove) => {
            if(err){
                res.status(500).send({
                    message: "Error al eliminar el documento embedido"
                })
            }else if(cursoRemove){
                User.findByIdAndUpdate( userId, {$inc:{cantidadCurso: -1}}, {new:true}, (err, userInc) => {
                    if(err){
                        res.status(500).send({
                            message: "Error al desincrementar el empleado"
                        })
                    }else if(userInc){
                        res.status(200).send({
                            message: "Actualizacion de estado de Colegio", userInc
                        })
                    }  
                })
            }else{
                res.status(204).send({
                    message: 'Empleado no encontrado o ya eliminado'
                })
            }
        })
    }
};

module.exports = controller;