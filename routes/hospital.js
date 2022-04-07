var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Hospital = require('../models/hospita');


/**
 * get Hospitales
 */
app.get('/', (req, res, next)=>{

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Hospital.find({})
    .skip(desde)
    .limit(5)
    .populate('usuario','nombre email')
    .exec(
    (err,hospitales)=>{
        if(err){
            return  res.status(500).json({
                    ok:false,
                    mensaje: 'Error cargando hospital',
                    errors: err
            });
        }
        Hospital.count((err, conteo)=>{
            res.status(200).json({
                ok:true,
                total: conteo,
                hospitales: hospitales    
            })
        })
    })

});

/**
 * actualizar Hospital
 */

app.put('/:id', mdAutenticacion.verificaToken,(req,res)=>{
    
    var id = req.params.id;
    var body = req.body;

    Hospital.findById(id,(err,hospital)=>{

        if(err){
            return  res.status(500).json({
                    ok:false,
                    mensaje: 'Error al buscar hospital',
                    errors: err
            });
        }
        if(!hospital){
            return  res.status(400).json({
                ok:false,
                mensaje: 'El hspital no existe',
                errors: {messge:'No existe el hospital'}
            });
        }

        hospital.nombre = body.nombre;
        //hospital.img = body.img;
        hospital.usuario = req.usuario._id;

        hospital.save((err,hospitalGuardado)=>{
            if(err){
                return  res.status(400).json({
                        ok:false,
                        mensaje: 'Error al actualizar hospital',
                        errors: err
                });
            }
            res.status(200).json({
                ok:true,
                hospital: hospitalGuardado 
            }); 
        })

    })
});

/**
 * crear un nuevo Hospital
 */
app.post('/', mdAutenticacion.verificaToken,(req,res)=>{

    var body = req.body;

    var hospital = new Hospital({
        nombre: body.nombre,
        //img: body.img,
        usuario: req.usuario._id
    });

    hospital.save((err,hospitalGuardado)=>{
        if(err){

            return  res.status(400).json({
                ok:false,
                mensaje: 'Error al crear hospital',
                errors: err
            });
        }
        res.status(201).json({
            ok:true,
            hospital: hospitalGuardado
        });
    });

    
});

/**
 * Borrar Usuario
 */
app.delete('/:id', mdAutenticacion.verificaToken,(req,res)=>{
    var id = req.params.id;
    Hospital.findByIdAndRemove(id,(err,hospitalBorrado)=>{
        if(err){

            return  res.status(500).json({
                ok:false,
                mensaje: 'Error al borrar hospital',
                errors: err
            });
        }
        if(!hospitalBorrado){
            return  res.status(400).json({
                ok:false,
                mensaje: 'El hospital no existe',
                errors: {messge:'No existe el hospital'}
            });
        }
        res.status(201).json({
            ok:true,
            hospital: hospitalBorrado 
        });
    });
});


module.exports = app;
