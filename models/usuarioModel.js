const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const usuarioSchema = new Schema ({
    cedula : {
        type : Number,
        required : true
    },
    nombre : {
        type : String,
        required : true
    },
    correo : {
        type : String,
        required : true
    },
    telefono : {
        type : String,
        required : true
    },
    contrasenia : {
        type : String,
        required : true
    },
    rol : {
        type : String,
        required : true
    },
    cursosaCargo : {
        type : Array
    }
}
);

const Usuario = mongoose.model("Usuario", usuarioSchema);

module.exports = Usuario;