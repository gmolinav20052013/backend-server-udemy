// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');



// Inicializar variables
var app = express();
// Body-Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());



// app.use(function (req, res) {
//   res.setHeader('Content-Type', 'text/plain')
//   res.write('you posted:\n')
//   res.end(JSON.stringify(req.body, null, 2))
// })

//Importar rutas
var appRoutes = require('./rutas/app');
var usuarioRoutes = require('./rutas/usuario');
var loginRoutes = require('./rutas/login');
var hospitalRoutes = require('./rutas/hospital');
var medicoRoutes = require('./rutas/medico');
var busquedaRoutes = require('./rutas/busqueda');
var uploadRoutes = require('./rutas/upload');
var imagenesRoutes = require('./rutas/imagenes');

mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB',
           (err, res) => {

            if (err) throw err;

            console.log('Base de datos: \x1b[32m%s\x1b[0m','online');

           });

// var serveIndex = require('serve-index');
// app.use(express.static(__dirname + '/'));
// app.use('/uploads',serveIndex(__dirname + '/uploads'));


//Rutas
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/medico', medicoRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/upload', uploadRoutes);
app.use('/imagenes',imagenesRoutes);
app.use('/',appRoutes);



// Escuchar peticiones
app.listen(3000, () => {

    console.log('Express server puerto 3000: \x1b[5m%s\x1b[0m', 'online');

});