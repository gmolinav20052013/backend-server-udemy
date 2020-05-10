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

mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB',
           (err, res) => {

            if (err) throw err;

            console.log('Base de datos: \x1b[32m%s\x1b[0m','online');

           });

//Rutas
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/',appRoutes);



// Escuchar peticiones
app.listen(3000, () => {

    console.log('Express server puerto 3000: \x1b[5m%s\x1b[0m', 'online');

});