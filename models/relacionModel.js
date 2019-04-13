const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const relacionSchema = new Schema ({
    cedula_est : {
        type : Number,
        required : true
    },
    nombre_est : {
        type : String,
        required : true
    },
    id_curso : {
        type : Number,
        required : true
    },
    nombre_curso : {
        type : String,
        required : true
    },
    valor_curso : {
        type : String,
        required : true
    },
    descripcion_curso : {
        type : String,
        required : true
    }
}
);

const Relacion = mongoose.model("Relacion", relacionSchema);

module.exports = Relacion;