// Los helpers son funciones-procedimientos que voy a poder invocar desde el html y que trabajan con hbs
// por lo tanto es imporante llamar el require de hbs.

const hbs = require("hbs");

// Registro el helper de los botones para el coordinador

hbs.registerHelper("ifcompararEstado", function(estado,options){
    if(estado !== "disponible"){
        return options.fn(this);
    }   
    else{
        return options.inverse(this);
    }
});

