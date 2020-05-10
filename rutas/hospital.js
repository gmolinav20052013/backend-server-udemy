var express = require('express');


var mdAutenticacion = require('../middleware/autenticacion');


var app = express();


var Hospital = require('../models/hospital');
//Rutas

//=====================================
// Busqueda de hospital
//=====================================

app.get('/', (req, resp, next)  => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Hospital.find({})
    .skip(desde)
    .limit(5)
    .populate('usuario','email, nombre')
    .exec(        
        (err, detahospitales) => {

        if (err) {
            return resp.status(400).json({ 
                ok: true,
                mensaje: 'Error interno en cargando hospitales!!!',
                errors: err
            });        
        }

        Hospital.count({}, (err, conteo) => {
            resp.status(200).json({ 
                ok: true,
                hospitales: detahospitales,
                total: conteo
            });    
        });

    });

    
});



//=====================================
// Actualizar un nuevo hospital
//=====================================

app.put('/:id',mdAutenticacion.verificaToken, (req, resp, next) => {

    var id = req.params.id;
    var bodyreq = req.body;

    Hospital.findById(id, (err, hospital) => {

        if (err) {
            return resp.status(500).json({ 
                ok: true,
                mensaje: 'Error al buscar hospital!!!',
                errors: err
            });        
        }

        if (!hospital) {
            return resp.status(400).json({ 
                ok: true,
                mensaje: 'hospital con id '+ id + ' no encontrado!!!',
                errors: { message: 'No existe un hospital con ese ID'} 
            });        
        }

        hospital.nombre = bodyreq.nombre;
        hospital.img = bodyreq.img;
        hospital.usuario = bodyreq.usuario;

        hospital.save( (err, hospitalGuardado) => {

            if (err) {
                return resp.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar hospital',
                    errors: err                    
                });
            }       

            resp.status(200).json({
                ok: true,
                hospital: hospitalGuardado,
                total: conteo
            });
        });       
    });   
});

//=====================================
// Borrar un hospital x ID
//=====================================
app.delete('/:id',mdAutenticacion.verificaToken, (req, resp) => {

    var id = req.params.id;
    
    Hospital.findByIdAndRemove(id, (err, hospital) => {

        if (err) {
            return resp.status(500).json({ 
                ok: true,
                mensaje: 'Error al buscar hospital!!!',
                errors: err
            });        
        }

        if (!hospital) {
            return resp.status(400).json({ 
                ok: true,
                mensaje: 'hospital con id '+ id + ' no encontrado!!!',
                errors: { message: 'No existe un hospital con ese ID'} 
            });        
        }

        resp.status(200).json({
             ok: true,
            mensaje: 'hospital eliminado satisfactoriamente'
        });
        

    });   

});
//=====================================
// Crear un nuevo hospital
//=====================================
app.post('/',mdAutenticacion.verificaToken, (req, resp, next) => {

    var bodyreq = req.body;

    var hospital = new Hospital({        
        nombre: bodyreq.nombre,
        img: bodyreq.img,
        usuario: bodyreq.usuario
    });

    hospital.save( (err, hospitalGuardado) => {

        if (err) {
            return resp.status(400).json({ 
                ok: true,
                mensaje: 'Error al crear hospital',
                errors: err
            });        
        }

        resp.status(201).json({
            ok: true,
            hospital: hospitalGuardado
        });
    

    });

});


module.exports = app;

