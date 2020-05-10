var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;


var app = express();

var Usuario = require('../models/usuario');


app.post('/', (req, resp) => {

    var bodyreq = req.body;

    Usuario.findOne({ email: bodyreq.email }, (err, usuarioDB) => {

        if (err) {
            return resp.status(500).json({ 
                ok: true,
                mensaje: 'Error al buscar usuario!!!',
                errors: err
            });        
        }

        if (!usuarioDB) {
            return resp.status(400).json({ 
                ok: true,
                mensaje: 'Usuario con email '+ bodyreq.email + ' no encontrado!!!',
                errors: { message: 'No existe un usuario con ese email'} 
            });        
        }


        if (!bcrypt.compareSync(bodyreq.password, usuarioDB.password) )
        {
            return resp.status(400).json({ 
                ok: true,
                mensaje: 'Password Inválido',
            });        
        }

        usuarioDB.password = ":)";

        var token = jwt.sign(
            { usuario: usuarioDB},
            SEED,
            {expiresIn: 14400}
            );

        resp.status(200).json({
            ok: true,           
            usuario: usuarioDB,
            token: token,
            id: usuarioDB.id
        });
    });

});






module.exports = app;

