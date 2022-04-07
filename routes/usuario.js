var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Usuario = require('../models/usuario');


/**
 * get Usuarios
 */
app.get('/', (req, res, next)=>{

    Usuario.find({},'nombre email img role')
    .exec(
    (err,usuarios)=>{
        if(err){
            return  res.status(500).json({
                    ok:false,
                    mensaje: 'Error cargando usuarios',
                    errors: err
            });
        }
        res.status(200).json({
            ok:true,
            usuarios: usuarios    
        })
    })

});

/**
 * actualizar usuario
 */

app.put('/:id', mdAutenticacion.verificaToken,(req,res)=>{
    
    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id,(err,usuario)=>{

        if(err){
            return  res.status(500).json({
                    ok:false,
                    mensaje: 'Error al buscar usuarios',
                    errors: err
            });
        }
        if(!usuario){
            return  res.status(400).json({
                ok:false,
                mensaje: 'El usuario no existe',
                errors: {messge:'No existe el usuario'}
            });
        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((err,usuarioGuardado)=>{
            if(err){
                return  res.status(400).json({
                        ok:false,
                        mensaje: 'Error al actualizar usuarios',
                        errors: err
                });
            }
            usuarioGuardado.password= '####',
            res.status(200).json({
                ok:true,
                usuario: usuarioGuardado 
            }); 
        })

    })
});

/**
 * crear un nuevo usuario
 */
app.post('/', mdAutenticacion.verificaToken,(req,res)=>{

    var body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password,10),
        img: body.img,
        role: body.role
    });

    usuario.save((err,usuarioGuardado)=>{
        if(err){

            return  res.status(400).json({
                ok:false,
                mensaje: 'Error al crear usuarios',
                errors: err
            });
        }
        res.status(201).json({
            ok:true,
            usuario: usuarioGuardado,
            usuarioToken: req.usuario,
        });
    });

    
});

/**
 * Borrar Usuario
 */
app.delete('/:id', mdAutenticacion.verificaToken,(req,res)=>{
    var id = req.params.id;
    Usuario.findByIdAndRemove(id,(err,usuarioBorrado)=>{
        if(err){

            return  res.status(500).json({
                ok:false,
                mensaje: 'Error al borrar usuarios',
                errors: err
            });
        }
        if(!usuarioBorrado){
            return  res.status(400).json({
                ok:false,
                mensaje: 'El usuario no existe',
                errors: {messge:'No existe el usuario'}
            });
        }
        res.status(201).json({
            ok:true,
            usuario: usuarioBorrado 
        });
    });
});


module.exports = app;
