var express = require('express');

var app = express();

var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');


//==============================
// Busqueda por colección
//==============================

app.get('/coleccion/:tabla/:busqueda', (req, resp, next)  => {

    var tabla = req.params.tabla;
    var busqueda = req.params.busqueda;
    var regex = new RegExp( busqueda,  'i' );
    var promesa;

    switch (tabla)
    {
        case 'hospital':
            promesa =  buscarHospitales(regex);            
            break;
        case 'medico':
            promesa =  buscarMedicos(regex);            
            break;
        case 'usuario':                  
            promesa = buscarUsuario(regex);
            break;         
            default: 
              return resp.status(400).json({
                ok: false,
                mensaje: 'Los tipos de busqueda solo son: usuario, medico, hospital',
                error: { message: 'Tipo de tabla/colección no valida'}
            }); 
    }

    promesa.then( resultado => {
        resp.status(200).json({
            ok: true,
            [tabla]: resultado
        });    
    });



});



//Rutas
app.get('/todo/:busqueda', (req, resp, next)  => {

    var busqueda = req.params.busqueda;
    var regex = new RegExp( busqueda,  'i' );

    Promise.all([
        buscarHospitales(regex),
        buscarMedicos(regex) ,
        buscarUsuario( regex)
        ])
        .then ( respuestas => {

            resp.status(200).json({
                ok: true,
                hospitales: respuestas[0],
                medicos: respuestas[1],
                usuarios: respuestas[2]
            });

        });

});

function buscarHospitales (  regex) {

    return new Promise( (resolve, reject) => {
        Hospital.find( { nombre: regex }, ( err, hospitales) => {

            if (err){
                reject('Error al cargar hospitales');
            } else {
                resolve(hospitales);
            }

        });
    });

}

function buscarMedicos (  regex) {

    return new Promise( (resolve, reject) => {
        Medico.find( { nombre: regex }, ( err, medicos) => {

            if (err){
                reject('Error al cargar medicos');
            } else {
                resolve(medicos);
            }

        });
    });
}

function buscarUsuario (regex) {

    return new Promise( (resolve, reject) => {
        Usuario.find({}, 'nombre role email')
        .or([{nombre: regex }, {email: regex}])  
        .exec ( (err, usuarios) => {

            if (err){
                reject('Error al cargar usuarios');
            } else {
                resolve(usuarios);
            }
        });
    });

}

module.exports = app;

