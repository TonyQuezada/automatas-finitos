// import { createRequire } from "module";
// const require = createRequire(import.meta.url);
// const automata = require("./abcc.json");

export function utilizarAutomata (automata, cadena) {
    
    let estadoActual = automata["estado-inicio"];

    // para cada letra de la cadena...
    for (const caracter of cadena){
        
        // si el estado actual existe...
        if(automata[estadoActual]){
            if(automata[estadoActual].hasOwnProperty(caracter))
                estadoActual = automata[estadoActual][caracter];
            else
                return "Cadena Inválida";
        }
        else{
            return "Cadena Inválida";
        }
    }

    // Al recorrer toda la cadena, revisar si el estadoActual está dentro de los
    // estados-finales
    const esEstadoFinal = automata["estados-finales"].some(estadoFinal =>
        estadoFinal === estadoActual
    );

    if (esEstadoFinal) {
        return "Cadena Válida";
    } else {
        return "Cadena Inválida";
    }
}

// console.log( utilizarAutomata(automata, "abcccccccccccccc") )