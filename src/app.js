const funciones_estudiantes = require("./archivos");

// Modelos

const Usuario = require("../models/usuarioModel.js");
const Curso = require("../models/cursoModel.js");
const Relacion = require("../models/relacionModel.js");

// Las paginas dinamicas van a estar en views, las estaticas en public.

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const session = require('express-session');

const bodyParser = require("body-parser");

 // Require para el HBS, esto sirve para nuestras paginas dinamicas,
const hbs = require("hbs");

// Require para los helpers.
require("./helpers.js");

const directorioPublico = path.join(__dirname,"../public"); // Para indicarle donde esta el directorio publico

const directorioPartials = path.join(__dirname,"../partials"); // Para indicarle donde estan los partials
// Los partials son partes de codigo que voy a repetir en varios archivos html. Si dentro de los partials tengo
// {{estudiante}}, estudiante debe ser enviado o de lo contrario tendremos un error.



// Le indico a express que usare el body parser.
app.use(bodyParser.urlencoded({extended : false}));

app.use(express.static(directorioPublico));

// Registro los partials y asi el sabe en donde los va a poder ubicar mediante el directorioPartials.
hbs.registerPartials(directorioPartials); 

app.set("view engine","hbs");

require("./config.js");


// METODOS GET:


app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true

}))

// Cuando ingrese a la pagina de error.
app.get("/error",(req,res) =>{
    res.render("error");
});

// Cuando ingrese a la pagina de registro.
app.get("/registro",(req,res) => {
    res.render("registro");
});

app.get("/",(req,res) =>{
    res.render("index");
})

app.get("/cursos",(req,res) =>{
    if (req.session.usuario != null){
        Curso.find({estado : "disponible"}).exec((err,resultado) => {
            if (err){
                res.redirect("error");
            }
            res.render("cursos",{
                est: req.session.usuario,
                cursos_disponibles : resultado
            });
        });      
    }
    else{
        res.redirect("error");
    }
});

app.get("/verCursosInter",(req,res)=> {
    Curso.find({estado : "disponible"}).exec((err,resultado) => {
        if (err){
            res.redirect("error");    
        }
        res.render("verCursosInter",{
            cursos_disponibles : resultado
        });
    });
});

app.get("/misCursos",(req,res) => {
    if (req.session.usuario != null){
        Relacion.find({cedula_est : req.session.usuario.cedula}).exec((err,resultado) => { 
            if (err){
                res.redirect("error");
            }
            res.render("misCursos", {
                est : req.session.usuario,
                misCursos : resultado
            });

        });
    }
    else{
        res.redirect("error");
    }
});

app.get("/eliminarRelacion",(req,res) => {
    if (req.session.usuario != null){
        Relacion.findOneAndDelete({cedula_est: req.query.estudiante_id, id_curso: req.query.id}, (err,respuesta) =>{
            if (err){
                res.redirect("error");
            }
            Relacion.find({cedula_est : req.session.usuario.cedula}).exec((err,resultado) => {
                if (err){
                    res.redirect("error");
                }  
                res.render("misCursos", {
                    est : req.session.usuario,
                    misCursos : resultado
                }); 

             });
            
        });
    }
    else{
        res.redirect("error");
    }
});


app.get("/inscripcion",(req,res) =>{

    Relacion.findOne({cedula_est: req.query.estudiante_id , id_curso: req.query.id}).exec((err,resultado) => {
        if (err){
            res.redirect("error");
        }
        if (resultado != null){
            res.redirect("error");
        }
        else{
            funciones_estudiantes.guardarRelacionBd(req.query.estudiante_id,req.query.id);
            res.render("inscripcion" ,{
                est: req.session.usuario,
            });
        }
    }); 

});


app.get("/verMas",(req,res) =>{

    if (req.session.usuario != null){
        Curso.findOne({id : req.query.id}).exec((err,resultado) => { 
            if (err){
                res.redirect("error");
            }
            res.render("verMas" , {
                est: req.session.usuario,
                curso : resultado
            });

        });
    }
    else{
        res.redirect("error");
    }

});

app.get("/verMasInter",(req,res) =>{

    Curso.findOne({id : req.query.id}).exec((err,resultado) => {
        if (err){
            res.redirect("error");
        }
        res.render("verMasInter" , {
            curso : resultado
        });

    });
   
});

app.get("/salir", (req,res) =>{
    req.session.usuario = null;
    res.render("index");
})


app.get("/index", (req,res) =>{

    if (req.session.usuario != null){
        if (req.session.usuario.rol == "coordinador"){
            res.render("crearCursosCoord", {
                est: req.session.usuario
            });
        }
        else if(req.session.usuario.rol == "aspirante"){
            Curso.find({estado : "disponible"}).exec((err,resultado) => { 
                if (err) {
                    res.redirect("error");
                }
                res.render("cursos",{
                    est: req.session.usuario,
                    cursos_disponibles : resultado
                });

            });

        }
    
    }
    else{
        res.render("index");
    }
});

app.get("/crearCursos", (req,res) => {
    if (req.session.usuario != null){
        res.render("crearCursosCoord" ,{
            est: req.session.usuario,
        });
    }
    else{
        res.redirect("error");
    }

})

app.get("/estudiantesSistema", (req,res) => {
    if (req.session.usuario != null){
        Usuario.find({}).exec((err,resultado) =>{
            if (err) {
                res.redirect("error");
            }
            res.render("actualizarDatosCoord" ,{
                est: req.session.usuario,
                estudiantes: resultado
            });

        });
    }
    else{
        res.redirect("error");
    }
});

app.get("/administrarCursos", (req,res) =>{
    if (req.session.usuario != null){
        Curso.find({}).exec((err,resultado) => {
            if (err){
                res.redirect("error");
            }
            Usuario.find({rol : "docente"}).exec((err,repuesta) => {
                if (err){
                    res.redirect("error");
                }
                res.render("verCursosCoord",{
                    est: req.session.usuario,
                    cursos: resultado,
                    encargados: repuesta
                });
            });
         });
    }
    else{
        res.redirect("error");
    }
});

app.get("/eliminarInscripcion" ,(req,res) => {

    Relacion.findOneAndDelete({cedula_est: req.query.id, id_curso: req.query.id_curso}, (err, respuesta) =>{
        if (err) {
            res.redirect("error");
        }
        Relacion.find({id_curso: req.query.id_curso}).exec((err,respuestaUno) =>{
            if (err) {
                res.redirect("error");
            }
            let idEstudiantes = funciones_estudiantes.idAlumnosEnCurso(respuestaUno);
    
            Usuario.find({cedula : {$in: idEstudiantes}}).exec((err,resultado) => {
                if (err) {
                    res.redirect("error");
                }
                res.render("verInscritosCoord", {
                    est: req.session.usuario,
                    inscritos : resultado,
                    curso : req.query.nombre_curso,
                    id_cur: req.query.id_curso
                });   
    
            });
        });
    });
});

app.get("/cerrarCurso", (req,res) => {

    Curso.findOneAndUpdate({id:req.query.id},{$set:{estado: "cerrado"}},(err,respuesta) =>{
        if (err){
            res.redirect("error");
        }
        Usuario.findOneAndUpdate({cedula: req.query.encargado}, {$push :{cursosaCargo: req.query.id}},(err,respuesta) =>{
            if (err){
                res.redirect("error");
            }    
        });
        Curso.find({}).exec((err,resultado) => {
            if (err){
                res.redirect("error");
            }
            Usuario.find({rol : "docente"}).exec((err,respuesta) => {
                if (err){
                    res.redirect("error");
                }
                res.render("verCursosCoord", {
                    est: req.session.usuario,
                    cursos: resultado, 
                    encargados : respuesta
                });
            });

        });
    })

})

app.get("/cursosDocente",(req,res) =>{

    Usuario.findOne({cedula : req.session.usuario.cedula}).exec((err, resultado) =>{
        if (err){
            res.redirect("error");
        }
        Curso.find({id : {$in : resultado.cursosaCargo}}).exec((err,respuesta) =>{
            if (err){
                res.redirect("error");
            }   
            res.render("cursosDocente" , {
                est: req.session.usuario,
                cursos: respuesta
            });    
        });
    });

});

// METODOS POST:

// Cuando ingrese llene el formulario de registro va a acceder aqui.
app.post("/cursos",(req,res) =>{

    Usuario.findOne({cedula : req.body.id}).exec((err,resultado) =>{
        if (err) {
            res.redirect("error");
        }
        if (resultado != null){
            res.redirect("error");
        }
        else{
            req.session.usuario = {
                cedula: req.body.id,
                nombre: req.body.nombre,
                correo: req.body.correo,
                telefono: req.body.telefono,
                contrasenia: bcrypt.hashSync(req.body.password,10),
                rol: "aspirante"
            };

            funciones_estudiantes.guardarAlumnoBd(req.session.usuario);

            Curso.find({estado : "disponible"}).exec((err,resultado) => { 
                if (err) {
                    res.redirect("error");
                }
                res.render("cursos",{
                    est: req.session.usuario,
                    cursos_disponibles : resultado
                });

            });

        }
    });

});

app.post("/login",(req,res)=>{

    Usuario.findOne({cedula : req.body.cedula_log}).exec((err,resultado) =>{
        if (err){
            res.redirect("error");
        }
        if(resultado != null){
            if(!bcrypt.compareSync(req.body.pass_log,String(resultado.contrasenia))){
                res.redirect("error");          
            }
        else{
                req.session.usuario = resultado

                if(resultado.rol == "coordinador"){
                    res.render("crearCursosCoord", {
                        est: req.session.usuario
                    });
                }
                else if (resultado.rol == "aspirante"){
                    Curso.find({estado : "disponible"}).exec((err,resi) => { 
                        if (err) {
                            res.redirect("error");
                        }
                        res.render("cursos",{
                            est: resultado,
                            cursos_disponibles : resi
                        });
        
                    });
                }
                else{
                    Usuario.findOne({cedula : req.session.usuario.cedula}).exec((err, resultado) =>{
                        if (err){
                            res.redirect("error");
                        }
                        Curso.find({id : {$in : resultado.cursosaCargo}}).exec((err,respuesta) =>{
                            if (err){
                                res.redirect("error");
                            }   
                            res.render("cursosDocente" , {
                                est: req.session.usuario,
                                cursos: respuesta
                            });    
                        });
                    });
                }   
            }
        }

    });

});

app.post("/crearCursos", (req,res) => {

    Curso.find({}).exec((err,respuesta) =>{
        if (err) {
            res.redirect("error");
        }
        Curso.findOne({id : req.body.id}).exec((err, respuesta) =>{
            if (err) {
                res.redirect("error");
            }  
            if (respuesta == null){
                let cursoNuevo = new Curso({
                    id: req.body.id,
                    nombre: req.body.nombre,
                    descripcion: req.body.descripcion,
                    costo: req.body.costo,
                    modalidad: req.body.modalidad,
                    intensidad: req.body.duracion,
                    estado: "disponible"
                });
                cursoNuevo.save();
                res.render("cursosExito",{
                    est: req.session.usuario
                });
            }  
            else{
                res.redirect("error");

            }
        })
    });
});

app.post("/modificarDatos" , (req,res) =>{

    let cedula = req.body.cedula;
    let nombre = req.body.nombre;

    res.render("formActuaCoord", {
        est: req.session.usuario,
        cedula : cedula,
        nombre : nombre
    });
});


app.post("/actualizarAlumno" , (req,res) =>{

    Usuario.findOneAndUpdate({cedula: req.body.cedula},{$set:{nombre:req.body.nombre,correo:req.body.correo,rol:req.body.rol}},(err,resultado) =>{
        if (err){
            res.redirect("error");
        }
        Usuario.find({}).exec((err,respuesta) => {
            if (err){
                res.redirect("error");
            }
            res.render("actualizarDatosCoord" ,{
                est: req.session.usuario,
                estudiantes: respuesta
            });

        });
    });
    
});


app.post("/verInscritos", (req,res) => {

    Relacion.find({id_curso: req.body.id}).exec((err,respuesta) =>{
        if (err) {
            res.redirect("error");
        }
        let idEstudiantes = funciones_estudiantes.idAlumnosEnCurso(respuesta);

        Usuario.find({cedula : {$in: idEstudiantes}}).exec((err,resultado) => {
            if (err) {
                res.redirect("error");
            }
            if (req.session.usuario.rol == "coordinador"){
                res.render("verInscritosCoord", {
                    est: req.session.usuario,
                    inscritos : resultado,
                    curso : req.body.nombre_curso,
                    id_cur: req.body.id
                }); 
            }  
            else{
                res.render("verInscritosDocente", {
                    est: req.session.usuario,
                    inscritos : resultado,
                    curso : req.body.nombre_curso,
                    id_cur: req.body.id
                }); 
            }

        });
    });
});

// Conexion con la base de datos

mongoose.connect(process.env.URLDB, {useNewUrlParser: true}, (err, resultado) =>{
    if (err){
        return console.log("Hubo un error al cargar la base de datos");
    }
    console.log("Conexion satisfactoria");
});

// Para escuchar el puerto 3000 y que nuestro aplicativo se ejecute en la web.
app.listen(process.env.PORT, () =>{
    console.log("Servidor en el puerto " + process.env.PORT);
});