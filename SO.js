import { Estrategia_dinamica } from './Estrategia_dinamica.js';
import { Estrategia_paginacion } from './Estrategia_paginacion.js';
import { Estrategia_segmentacion } from './Estrategia_segmentacion.js';
import { Estrategia_t_fijo } from './Estrategia_t_fijo.js';
import { Estrategia_t_variable } from './Estrategia_t_variable.js';
import { Proceso } from './Proceso.js';

const reloj = {
    tiempo  : (ms)      => new Promise(resolve => setTimeout(resolve, ms)),
    ciclo   : (tick)    => tick.co_ts++
}

export class SO {
    static BYTES_EN_1KiB = 1024;
    
    constructor(t_MiB_SO, gestorMemoria, programas, procesos, salida, ms_retardo) {
        this.t_MiB_SO       = t_MiB_SO;
        this.gestorMemoria  = gestorMemoria;
        this.programas      = this.cargarProgramas(
            gestorMemoria.memoria.t_B_header, 
            programas
        );
        this.procesos    = procesos;
        this.tick        = { co_ts: 0 };
        this.salida      = salida;
        this.ms_retardo  = ms_retardo;
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
        this.gestorMemoria.cargarSO(this.t_MiB_SO);
        this.gestorMemoria.particionarMemoria();
        this.primerosDatos();
        this.ejecutarProcesos(this.ms_retardo);
    }

    async ejecutarProcesos(ms) {
        const n_tiempos = this.procesos[0].ts_proceso.length;

        while(this.tick.co_ts < n_tiempos) {
            await reloj.tiempo(ms);
            console.log('****************************************************************************');
            console.log('Tiempo no. ' + (this.tick.co_ts + 1));
            console.log('****************************************************************************');
            this.salida.interfazWeb('ℹ️ [INFO] Tiempo no. ' + (this.tick.co_ts + 1));

            const procesosCrear = this.procesos
                .filter(proceso => proceso.ts_proceso[this.tick.co_ts] > -1)
                .map(proceso => {
                    const turnoProceso      = proceso.ts_proceso[this.tick.co_ts];
                    const programaEjecutar  = this.programas[proceso.pid - 1];
                    const t_B_stack         = this.gestorMemoria.memoria.t_KiB_stack * SO.BYTES_EN_1KiB;
                    const t_B_heap          = this.gestorMemoria.memoria.t_KiB_heap * SO.BYTES_EN_1KiB;

                    const [, t_B_text, t_B_data, t_B_bss] = programaEjecutar._ct_disco;

                    return new Proceso(proceso.pid, turnoProceso, t_B_text, t_B_data,
                        t_B_bss, t_B_stack, t_B_heap
                    );
                });
            
            this.gestorMemoria.procesos = procesosCrear;
            this.gestorMemoria.gestionarMemoriaProcesos();
            reloj.ciclo(this.tick);

            this.actualizarInterfaz(procesosCrear);
            console.log(this.gestorMemoria.memoria.c_ram);
            console.log(this.gestorMemoria.memoria.get_pos_c_ram('DEC'));
            console.log(this.gestorMemoria.memoria.get_pos_c_ram('HEX'));
            console.log('Memoria ocupada en KiB: ' + this.gestorMemoria.memoria.get_sum_t_c_ram());
            console.log('Memoria disponible en KiB: ' + this.gestorMemoria.memoria.get_t_disp_ram('B'));
        }
    }

    primerosDatos() {
        console.log(this.programas);
        console.log(this.gestorMemoria.obtenerEstadisticas());
        console.log(this.gestorMemoria.memoria);
        console.log('Memoria ocupada en KiB: ' + this.gestorMemoria.memoria.get_sum_t_c_ram());
        console.log('Memoria disponible en KiB: ' + this.gestorMemoria.memoria.get_t_disp_ram('B'));
        console.log(this.gestorMemoria.memoria.get_pos_c_ram('DEC'));
        console.log(this.gestorMemoria.memoria.get_pos_c_ram('HEX'));
    }

    actualizarInterfaz(procesosCrear) {
        const tablaFragmentos_disp = 
            this.gestorMemoria.estrategia_gestor instanceof Estrategia_dinamica ||
            this.gestorMemoria.estrategia_gestor instanceof Estrategia_segmentacion;

        const tablaDescripcion_disp =
            this.gestorMemoria.estrategia_gestor instanceof Estrategia_t_fijo ||
            this.gestorMemoria.estrategia_gestor instanceof Estrategia_t_variable ||
            this.gestorMemoria.estrategia_gestor instanceof Estrategia_dinamica;

        const b_proc_unic_activos = this.gestorMemoria.estrategia_gestor instanceof Estrategia_dinamica;

        this.salida.tablaMemoria(
            this.gestorMemoria.memoria.get_pos_c_ram('DEC'),
            this.gestorMemoria.memoria.get_pos_c_ram('HEX'),
            this.gestorMemoria.memoria.c_ram,
        );

        this.salida.metricasEspacio(
            this.gestorMemoria.memoria.get_sum_t_c_ram(),
            this.gestorMemoria.memoria.get_t_disp_ram('B')
        );

        this.salida.listaProcesos(
            procesosCrear
        );

        if(tablaDescripcion_disp) { 
            this.salida.tablaDescripcion(
                this.gestorMemoria.memoria.c_ram,
                this.gestorMemoria.memoria.get_pos_c_ram('DEC'),
                this.gestorMemoria.memoria.get_pos_c_ram('HEX'),
                b_proc_unic_activos
            );
        }

        if(tablaFragmentos_disp) {
            this.salida.tablaFragmentos(
                this.gestorMemoria.memoria.c_ram,
                this.gestorMemoria.memoria.get_pos_c_ram('DEC'),
                this.gestorMemoria.memoria.get_pos_c_ram('HEX')
            );
        }

        if(this.gestorMemoria.estrategia_gestor instanceof Estrategia_segmentacion) {
            this.salida.tablaSpecSegmentos(
                this.gestorMemoria.memoria.c_ram
            );
        }

        if(this.gestorMemoria.estrategia_gestor instanceof Estrategia_paginacion) {
            this.salida.tablaSpecPaginas(
                this.gestorMemoria.memoria.c_ram
            );
        }
    }
}