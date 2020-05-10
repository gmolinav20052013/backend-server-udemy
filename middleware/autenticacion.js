var express = require('express');
var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

var app = express();

//=====================================
// Verificar Token
//=====================================

exports.verificaToken = function (req, resp, next) {

    var token = '';

    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') { // Authorization: Bearer g1jipjgi1ifjioj
        // Handle token presented as a Bearer token in the Authorization header
        token = req.headers.authorization.split(' ')[1];
    }  else {
        token = req.headers['x-access-token'];
    }

    jwt.verify(token,SEED, (err, decoded) => {

        if (err){
            return resp.status(401).json({ 
                ok: true,
                mensaje: 'Token incorrecto',
                errors: err
            });    
        }

        req.usuario = decoded.usuario;

        next();

    //    return resp.status(200).json({ 
    //         ok: true,        
    //         decoded: decoded
    //     });    

    });

};