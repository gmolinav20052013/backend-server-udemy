var express = require('express');


var mdAutenticacion = require('../middleware/autenticacion');


var app = express();


var Medico = require('../models/medico');
//Rutas

//=====================================
// Busqueda de medico
//=====================================

app.get('/', (req, resp, next)  => {

    var desde = req.query.desde || 0;
    desde = Number(desde);


    Medico.find({})
    .skip(desde)
    .limit(5)
    .populate('usuario','email nombre')
    .populate('hospital')
    .exec(        
        (err, detamedicos) => {

        if (err) {
            return resp.status(400).json({ 
                ok: true,
                mensaje: 'Error interno en cargando medicos!!!',
                errors: err
            });        
        }

        Medico.count({}, (err, conteo) => {
            resp.status(200).json({ 
                ok: true,
                medicos: detamedicos,
                total: conteo
            });    
        });

    });

    
});



//=====================================
// Actualizar un nuevo medico
//=====================================

app.put('/:id',mdAutenticacion.verificaToken, (req, resp, next) => {

    var id = req.params.id;
    var bodyreq = req.body;

    Medico.findById(id, (err, medico) => {

        if (err) {
            return resp.status(500).json({ 
                ok: true,
                mensaje: 'Error al buscar medico!!!',
                errors: err
            });        
        }

        if (!medico) {
            return resp.status(400).json({ 
                ok: true,
                mensaje: 'medico con id '+ id + ' no encontrado!!!',
                errors: { message: 'No existe un medico con ese ID'} 
            });        
        }

        medico.nombre = bodyreq.nombre;
        medico.img = bodyreq.img;
        medico.usuario = bodyreq.usuario;
        medico.hospital = bodyreq.hospital;

        medico.save( (err, medicoGuardado) => {

            if (err) {
                return resp.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar medico',
                    errors: err                    
                });
            }

            resp.status(200).json({
                ok: true,
                medico: medicoGuardado
            });
        

        });       
    });

   
});

//=====================================
// Borrar un medico x ID
//=====================================
app.delete('/:id',mdAutenticacion.verificaToken, (req, resp) => {

    var id = req.params.id;
    
    Medico.findByIdAndRemove(id, (err, medico) => {

        if (err) {
            return resp.status(500).json({ 
                ok: true,
                mensaje: 'Error al buscar medico!!!',
                errors: err
            });        
        }

        if (!medico) {
            return resp.status(400).json({ 
                ok: true,
                mensaje: 'medico con id '+ id + ' no encontrado!!!',
                errors: { message: 'No existe un medico con ese ID'} 
            });        
        }

        resp.status(200).json({
             ok: true,
            mensaje: 'medico eliminado satisfactoriamente'
        });
        

    });   

});
//=====================================
// Crear un nuevo medico
//=====================================
app.post('/',mdAutenticacion.verificaToken, (req, resp, next) => {

    var bodyreq = req.body;

    var medico = new Medico({        
        nombre: bodyreq.nombre,
        img: bodyreq.img,
        usuario: bodyreq.usuario,
        hospital: bodyreq.hospital
    });

    medico.save( (err, medicoGuardado) => {

        if (err) {
            return resp.status(400).json({ 
                ok: true,
                mensaje: 'Error al crear medico',
                errors: err
            });        
        }

        resp.status(201).json({
            ok: true,
            medico: medicoGuardado
        });
    

    });

});


module.exports = app;

