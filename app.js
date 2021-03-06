//Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');
var hospitalRoutes = require('./routes/hospital');
var medicoRoutes = require('./routes/medico');
var busquedaRoutes = require('./routes/busqueda');
var uploadRoutes = require('./routes/upload');
var imagenesRoutes = require('./routes/imagenes');

//Inicializar variables
var app= express();

// Body Parser
//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Conexion a la base de datos
mongoose.connect('mongodb://localhost:27017/hospitalDB',(err,res)=>{
    if(err) throw err;
    console.log('Base de datos 27017: \x1b[32m%s\x1b[0m','onLine');
});

//server index config
// var serverIndex = require('serve-index');
// app.use(express.static(__dirname + '/'));
// app.use('uploads', serverIndex(__dirname+'/uploads'));


//Rutas
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/medico', medicoRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/upload', uploadRoutes);
app.use('/img', imagenesRoutes);

app.use('/', appRoutes);


//Escuchar peticiones
app.listen(3000,()=>{
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m','onLine');
})