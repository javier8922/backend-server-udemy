var express = require('express');
var app = express();

var Hospital = require('../models/hospita');
var Medico = require('../models/medico');
const usuario = require('../models/usuario');
var Usuario = require('../models/usuario');
/**
 * Busqueda General
 */
app.get('/todo/:busqueda', (req, res, next)=>{

    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');

    Promise.all([
        buscarHospitales(busqueda,regex),
        buscarMedicos(busqueda,regex),
        buscarUsuario(busqueda, regex)
    ]).then(respuestas=>{
        res.status(200).json({
            ok:true,
            hospitales: respuestas[0],
            medicos: respuestas[1],
            usuarios: respuestas[2]
        });    
    })

});
/**
 * busqueda por coleccion
 */
app.get('/coleccion/:tabla/:busqueda',(req,res)=>{
    var busqueda = req.params.busqueda;
    var tabla = req.params.tabla;
    var regex = new RegExp(busqueda, 'i');
console.log(regex)
    switch(tabla){
        case 'usuarios':
            promesa = buscarUsuario(busqueda, regex);
            break;
        case 'medicos':
            promesa = buscarMedicos(busqueda, regex);
            break;
        case 'hospitales':
            promesa = buscarHospitales(busqueda, regex);
            break;
        default:
            return res.status(400).json({
                ok:false,
                mensaje: 'Los tipos de busquedas solo son: usuarios, medicos y hospitales ',
                error: { message: 'Tipo de tabla/coleccion no valido'}
            })
    }
    promesa.then(data=>{
        res.status(200).json({
            ok:true,
            [tabla]:data
        })
    });
});

function buscarHospitales( busqueda, regex ){
    return new Promise((resolve,reject)=>{
        Hospital.find({nombre:regex},(err, hospitales)=>{
            if(err){
                reject('Error al cargar hospitales', err);
            }else{
                resolve(hospitales)
            }
        });
    });
}
function buscarMedicos( busqueda, regex ){
    return new Promise((resolve,reject)=>{
        Medico.find({nombre:regex},(err, medicos)=>{
            if(err){
                reject('Error al cargar medicos', err);
            }else{
                resolve(medicos)
            }
        });
    });
}
function buscarUsuario( busqueda, regex ){
    return new Promise((resolve,reject)=>{
        Usuario.find({},'nombre email')
            .or([{'nombre': regex},{'email': regex}])
            .exec((err,usuarios)=>{
                if(err){
                    reject('Error al cargar usuarios', err);
                }else{
                    resolve(usuarios)
                }
            })
    });
}

module.exports = app;
