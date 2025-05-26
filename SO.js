/*
t:      Tamaño
ct:     Contenido
co:     Contador
acc:    Acumulador
v_act:  Valor actual
v:      Valor
u_dev:  Unidad derivada
*/

import { Programa } from './Programa.js';
import { Proceso } from './Proceso.js';
import { Memoria } from './Memoria.js';

export class SO {
    constructor(memoria, programas) {
        this.memoria    = memoria;
        this.programas  = this.cargarProgramas(
            memoria.t_B_header, 
            programas
        );
    }

    cargarProgramas(t_B_header, programas) {
        const programasCargados = [];

        programas.forEach(programa => {
            const programaCargado = new programa(t_B_header);
            programasCargados.push(programaCargado);
        });

        return programasCargados;
    }

    encender() {
        this.programas.forEach(programa => {
            console.log('Tamaño: ' + programa.get_t_disco());
        });
    }
}

const programas = [
    Programa.bind(null, 'Notepad', 19524, 12352, 1165),
    Programa.bind(null, 'Word', 77539, 32680, 4100),
    Programa.bind(null, 'Excel', 99542, 24245, 7577),
    Programa.bind(null, 'AutoCAD', 115000, 123470, 1123),
    Programa.bind(null, 'Calculadora', 12342, 1256, 1756),
    Programa.bind(null, 'Discord', 525000, 3224000, 51000),
    Programa.bind(null, 'Teams', 590000, 974000, 25000),
    Programa.bind(null, 'MatLAB', 349000, 2150000, 1000)
];

const windows = new SO(new Memoria(16, 64, 128, 767), programas);
windows.encender();