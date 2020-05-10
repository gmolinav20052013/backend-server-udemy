var express = require('express');
var fileUpload = require('express-fileupload');
var crypto = require('crypto');
var fs = require('fs');

var app = express();

var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');


app.use(fileUpload());

app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    //tipos de colecciones
    var tiposValidos = ['hospitales','medicos','usuarios'];
    if( tiposValidos.indexOf( tipo ) < 0){
        return res.status(400).json({
            ok: false,
            mensaje: 'Colección no válida',
            errors: {message: 'Las colecciones válidas son: '+ tiposValidos.join(', ')}
        });
    }

    if (!req.files || Object.keys(req.files).length === 0) {

        return res.status(400).json({
            ok: false,
            mensaje: 'No seleccionó nada',
            errors: {message: 'Debe de seleccionar una imagen'}
        });

    }

    //obtener el nombre del archivo
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length -1];

    // Solo estas extensiones aceptamos

    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extensionArchivo) < 0){
        return res.status(400).json({
            ok: false,
            mensaje: 'Extensión no válida',
            errors: {message: 'Las extensiones válidas son: '+ extensionesValidas.join(', ')}
        });
    }

    // Nombre de Archivo personalizado
    

    var nombreArchivo = id.concat('-',crypto.randomBytes(16).toString('hex'),'.',extensionArchivo);

    var path = `./uploads/${tipo}/${nombreArchivo}`;

    archivo.mv( path , err => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err
            });
        }

        subirPorTipo(tipo, id, nombreArchivo, res);

        // res.status(200).json({
        //     ok: true,
        //     mensaje: 'Petición realizada correctamente',
        //     nombrearchivo: nombreArchivo
        // });
    

    });

    function subirPorTipo(tipo, id, nombreArchivo, res){

        if (tipo === 'usuarios'){

            Usuario.findById( id, (err, usuario) => {

                if (!usuario){
                    return res.status(400).json({
                        ok: true,
                        mensaje: 'Usuario no existe',
                        errors: {message: 'Usuario con id = '+id+' no encontrado'}
                    });
                }

                var pathViejo = './uploads/usuarios/'+usuario.img;

                if ( fs.existsSync(pathViejo) ){
                    fs.unlink( pathViejo);
                }

                usuario.img = nombreArchivo;
                usuario.save( (err, usuarioActualizado) => {

                    usuarioActualizado.password = ":)";

                    return res.status(200).json({
                        ok: true,
                        mensaje: 'Imagen de usuario actualizada',
                        usuario: usuarioActualizado
                    });

                });

            });

        }
        if (tipo === 'medicos'){

            Medico.findById( id, (err, medico) => {

                if (!medico){
                    return res.status(400).json({
                        ok: true,
                        mensaje: 'Medico no existe',
                        errors: {message: 'Medico con id = '+id+' no encontrado'}
                    });
                }

                var pathViejo = './uploads/medicos/'+medico.img;

                if ( fs.existsSync(pathViejo) ){
                    fs.unlink( pathViejo);
                }

                medico.img = nombreArchivo;
                medico.save( (err, medicoActualizado) => {                    

                    return res.status(200).json({
                        ok: true,
                        mensaje: 'Imágen de medico actualizada',
                        medico: medicoActualizado
                    });

                });

            });
            
        }
        if (tipo === 'hospitales'){

            Hospital.findById( id, (err, hospital) => {

                if (!hospital){
                    return res.status(400).json({
                        ok: true,
                        mensaje: 'Hospital no existe',
                        errors: {message: 'Hospital con id = '+id+' no encontrado'}
                    });
                }

                var pathViejo = './uploads/hospitales/'+hospital.img;

                if ( fs.existsSync(pathViejo) ){
                    fs.unlink( pathViejo);
                }

                hospital.img = nombreArchivo;
                hospital.save( (err, hospitalActualizado) => {                    

                    return res.status(200).json({
                        ok: true,
                        mensaje: 'Imágen de hospital actualizada',
                        medico: hospitalActualizado
                    });

                });

            });

            
        }


    }



//   if (!req.files || Object.keys(req.files).length === 0) {
//     return res.status(400).send('No files were uploaded.');
//   }

//   // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
//   let sampleFile = req.files.sampleFile;

//   // Use the mv() method to place the file somewhere on your server
//   sampleFile.mv('/somewhere/on/your/server/filename.jpg', function(err) {
//     if (err)
//       return res.status(500).send(err);

//     res.send('File uploaded!');
//   });
});

module.exports = app;



// default options
