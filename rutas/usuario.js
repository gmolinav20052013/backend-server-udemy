var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');


var mdAutenticacion = require('../middleware/autenticacion');


var app = express();




var Usuario = require('../models/usuario');
//Rutas

//=====================================
// Busqueda de usuario
//=====================================

app.get('/', (req, resp, next)  => {

    Usuario.find({}, 'nombre email img role')
    .exec(        
        (err, detausuarios) => {

        if (err) {
            return resp.status(400).json({ 
                ok: true,
                mensaje: 'Error interno en cargando usuarios!!!',
                errors: err
            });        
        }

        resp.status(200).json({ 
            ok: true,
            usuarios: detausuarios
        });    

    });

    
});



//=====================================
// Actualizar un nuevo usuario
//=====================================

app.put('/:id',mdAutenticacion.verificaToken, (req, resp, next) => {

    var id = req.params.id;
    var bodyreq = req.body;

    Usuario.findById(id, (err, usuario) => {

        if (err) {
            return resp.status(500).json({ 
                ok: true,
                mensaje: 'Error al buscar usuario!!!',
                errors: err
            });        
        }

        if (!usuario) {
            return resp.status(400).json({ 
                ok: true,
                mensaje: 'Usuario con id '+ id + ' no encontrado!!!',
                errors: { message: 'No existe un usuario con ese ID'} 
            });        
        }

        usuario.nombre = bodyreq.nombre;
        usuario.password = bcrypt.hashSync(bodyreq.password,10);

        usuario.save( (err, usuarioGuardado) => {

            if (err) {
                return resp.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario',
                    errors: err                    
                });
            }

            usuarioGuardado.password = ":)";

            resp.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });
        

        });       
    });

   
});

//=====================================
// Borrar un usuario x ID
//=====================================
app.delete('/:id',mdAutenticacion.verificaToken, (req, resp) => {

    var id = req.params.id;
    
    Usuario.findByIdAndRemove(id, (err, usuario) => {

        if (err) {
            return resp.status(500).json({ 
                ok: true,
                mensaje: 'Error al buscar usuario!!!',
                errors: err
            });        
        }

        if (!usuario) {
            return resp.status(400).json({ 
                ok: true,
                mensaje: 'Usuario con id '+ id + ' no encontrado!!!',
                errors: { message: 'No existe un usuario con ese ID'} 
            });        
        }

        resp.status(200).json({
             ok: true,
            mensaje: 'Usuario eliminado satisfactoriamente'
        });
        

    });   

});
//=====================================
// Crear un nuevo usuario
//=====================================
app.post('/',mdAutenticacion.verificaToken, (req, resp, next) => {

    var bodyreq = req.body;

    var usuario = new Usuario({

        nombre: bodyreq.nombre,
        email: bodyreq.email,
        password: bcrypt.hashSync(bodyreq.password,10),
        img: bodyreq.img,
        role: bodyreq.role
    });

    usuario.save( (err, usuarioGuardado) => {

        if (err) {
            return resp.status(400).json({ 
                ok: true,
                mensaje: 'Error al crear usuario',
                errors: err
            });        
        }

        resp.status(201).json({
            ok: true,
            usuario: usuarioGuardado
        });
    

    });

});


module.exports = app;

