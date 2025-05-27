/*
t:      Tamaño
ts:     Tiempo
ct:     Contenido
co:     Contador
ca:     Cantidad
acc:    Acumulador
v_act:  Valor actual
v:      Valor
u_dev:  Unidad derivada
o:      Opción
m:      Multiplicador
b:      Interruptor (Booleano)
*/

import { Programa } from './Programa.js';
import { Proceso } from './Proceso.js';
import { Memoria } from './Memoria.js';
import { Estrategia_t_fijo } from './Estrategia_t_fijo.js';
import { Estrategia_t_variable } from './Estrategia_t_variable.js';
import { Estrategia_dinamica } from './Estrategia_dinamica.js';
import { GestorMemoria } from './GestorMemoria.js';

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
            console.log('Tamaño: ' + programa.t_disco);
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

const ts_procesos = [
    [-1, -1, -1, -1,  2, -1],
    [-1, -1, -1,  2, -1,  3],
    [-1,  2, -1, -1,  4,  0],
    [ 1,  0, -1,  1, -1,  5],
    [-1, -1,  1,  0, -1,  4],
    [-1, -1, -1,  3,  1,  1],
    [-1, -1, -1, -1, -1,  2],
    [ 2,  1, -1,  4,  3, -1]
];

const particiones = [
    { t_MiB_particion: 0.5, ca_particion: 2 },
    { t_MiB_particion: 1,   ca_particion: 2 },
    { t_MiB_particion: 2,   ca_particion: 2 },
    { t_MiB_particion: 4,   ca_particion: 2 } 
];

const gestorMemoria         = new GestorMemoria(ts_procesos);
const estrategia_t_fijo     = new Estrategia_t_fijo(1);
const estrategia_t_variable = new Estrategia_t_variable(particiones, 'peor');
const estrategia_dinamica   = new Estrategia_dinamica('mejor');

gestorMemoria.estrategia_gestor = estrategia_t_variable;
console.log(gestorMemoria.obtenerEstadisticas());

const windows = new SO(new Memoria(16, 64, 128, 767), programas);
windows.encender();