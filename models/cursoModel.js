const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cursoSchema = new Schema ({
    id : {
        type : Number,
        required : true
    },
    nombre : {
        type : String,
        required : true
    },
    descripcion : {
        type : String,
        required : true
    },
    costo : {
        type : String,
        required : true
    },
    modalidad : {
        type : String,
    },
    intensidad : {
        type : String,
    },
    estado : {
        type : String,
        required : true
    }
}
);

const Curso = mongoose.model("Curso", cursoSchema);

module.exports = Curso;