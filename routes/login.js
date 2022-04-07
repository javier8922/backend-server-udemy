var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

var app=express();

var Usuario = require('../models/usuario');

app.post('/',(req,res)=>{

    var body = req.body;

    Usuario.findOne({email:body.email},(err,usuarioBD)=>{

        if(err){
            return  res.status(500).json({
                ok:false,
                mensaje: 'Error al buscar usuarios',
                errors: err
            });
        }

        if(!usuarioBD){
            return  res.status(400).json({
                ok:false,
                mensaje: 'Credenciales incorrectas',
                errors: {messge:'Credenciales incorrectas - email'}
            });
        }

        if(!bcrypt.compareSync(body.password, usuarioBD.password)){
            return  res.status(400).json({
                ok:false,
                mensaje: 'Credenciales incorrectas',
                errors: {messge:'Credenciales incorrectas - password'}
            });
        }

        //Crear un Token

        var token = jwt.sign({usuario:usuarioBD},SEED,{expiresIn:14400}); //4 horas
        usuarioBD.password = '#########';
        
        res.status(200).json({
            ok:true,
            usuarioBD,
            token,
            id:usuarioBD._id
        });


    })
});

module.exports = app;