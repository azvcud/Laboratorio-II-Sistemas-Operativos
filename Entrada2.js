import { SO } from './SO.js';
import { Programa } from './Programa.js';
import { Memoria } from './Memoria.js';
import { Estrategia_t_fijo } from './Estrategia_t_fijo.js';
import { Estrategia_t_variable } from './Estrategia_t_variable.js';
import { Estrategia_dinamica } from './Estrategia_dinamica.js';
import { GestorMemoria } from './GestorMemoria.js';
import { Salida } from './Salida.js'; 

const programas = [
        Programa.bind(null, 'Notepad', 19524, 12352, 1165),
        Programa.bind(null, 'Word', 77539, 32680, 4100),
        Programa.bind(null, 'Excel', 99542, 24245, 7557),
        Programa.bind(null, 'AutoCAD', 115000, 123470, 1123),
        Programa.bind(null, 'Calculadora', 12342, 1256, 1756),
        Programa.bind(null, 'Discord', 525000, 3224000, 51000),
        Programa.bind(null, 'Teams', 590000, 974000, 25000),
        Programa.bind(null, 'MatLAB', 349000, 2150000, 1000)
];

const procesos = [
    { pid: 1, ts_proceso: [-1, -1, -1, -1,  1, -1]},
    { pid: 2, ts_proceso: [-1, -1, -1,  2, -1,  2]},
    { pid: 3, ts_proceso: [-1,  1, -1, -1,  2,  0]},
    { pid: 4, ts_proceso: [ 1,  0, -1,  1, -1,  4]},
    { pid: 5, ts_proceso: [-1, -1,  1,  0, -1,  3]},
    { pid: 6, ts_proceso: [-1, -1, -1,  3,  0,  0]},
    { pid: 7, ts_proceso: [-1, -1, -1, -1, -1,  1]},
    { pid: 8, ts_proceso: [ 2,  0, -1,  4,  0, -1]}
];

const particiones = [
    { t_MiB_particion: 0.5, ca_particion: 2 },
    { t_MiB_particion: 1,   ca_particion: 2 },
    { t_MiB_particion: 2,   ca_particion: 2 },
    { t_MiB_particion: 4,   ca_particion: 2 } 
];

const salida                = new Salida([]);
const gestorMemoria         = new GestorMemoria(new Memoria(16, 64, 128, 767));
const estrategia_t_fijo     = new Estrategia_t_fijo(1);
const estrategia_t_variable = new Estrategia_t_variable(particiones, 'mejor');
const estrategia_dinamica   = new Estrategia_dinamica('mejor');

estrategia_dinamica.b_compactacion = false;
gestorMemoria.estrategia_gestor = estrategia_dinamica;

const windows = new SO(1, gestorMemoria, programas, procesos, salida);
windows.encender();