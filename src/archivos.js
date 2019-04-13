// Modelos

const Usuario = require("../models/usuarioModel.js");
const Curso = require("../models/cursoModel.js");
const Relacion = require("../models/relacionModel.js");

// BD

const guardarAlumnoBd = (usuario) => {

    let alumno_actual = new Usuario({
        cedula: usuario.cedula,
        nombre: usuario.nombre,
        correo: usuario.correo,
        telefono: usuario.telefono,
        contrasenia: usuario.contrasenia,
        rol: "aspirante"
    });

    alumno_actual.save();

}

const guardarRelacionBd = (cedula_usuario, id_curso) => {

    Usuario.findOne({cedula : cedula_usuario}).exec((err,resultado_usuario) => { 
        if (err){
            console.log("Hubo un error");
        }
        Curso.findOne({id: id_curso}).exec((err,resultado_curso) => {
            if (err){
                console.log("Hubo un error");
            }
            let relacion_actual = new Relacion ({
                cedula_est: resultado_usuario.cedula,
                nombre_est : resultado_usuario.nombre,
                id_curso : resultado_curso.id,
                nombre_curso : resultado_curso.nombre,
                valor_curso : resultado_curso.costo,
                descripcion_curso : resultado_curso.descripcion
            });

            relacion_actual.save();
        })
    });

}

const idAlumnosEnCurso = (curso_actual) => {

    idAlumnos = [];

    for (i=0; i<curso_actual.length; i++){
        idAlumnos.push(curso_actual[i].cedula_est);
    }

    return idAlumnos;

}

module.exports = {
    guardarAlumnoBd,
    guardarRelacionBd,
    idAlumnosEnCurso
}