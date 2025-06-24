export class Estrategia_segmentacion {
    static et_segmento = [".text", ".data", ".bss", ".heap", ".stack"];

    constructor(b_segmento, b_segmentos, salida) {
        this.B_ca_segmentos     = 2 ** b_segmento;
        this.B_t_max_segmento   = 2 ** b_segmentos;
        this.salida             = salida;
    }

    particionarMemoria(memoria) {
        const t_B_disp_ram = memoria.get_t_disp_ram('B');
        
        memoria.c_ram.push([t_B_disp_ram, null]);
        return memoria.c_ram;
    }

    gestionarMemoriaProcesos(memoria, procesos) {
        memoria = this.limpiarMemoria(memoria, procesos);
        memoria = this.unirParticionesLibres(memoria);

        procesos
            .sort((proc_menor, proc_mayor) => proc_menor.turno - proc_mayor.turno)
            .forEach(proceso => {
                if(proceso.turno === 0)
                { this.salida.interfazWeb(`ℹ️ [INFO] Los segmentos del proceso con PID ${proceso.pid} continúan en la memoria`); }
                else
                { memoria = this.insertarProcesoMemoria(memoria, proceso); }
            });

        return memoria.c_ram;
    }

    insertarProcesoMemoria(memoria, proceso) {
        const proc_segmentado = this.segmentarProceso(proceso);

        if(proc_segmentado.length > this.B_ca_segmentos) {
            this.salida.interfazWeb(`⛔ [ERROR] Error de segmentación. El proceso ${proceso.pid} no se creó.`);
            return memoria;
        }

        proc_segmentado.forEach(segmento => {
            const t_espaciosDisponibles = memoria.c_ram
                .filter(espacio => espacio[1] === null)
                .map(espacio => espacio[0] - segmento.t_segmento)
                .filter(diferencia => diferencia > 0);

            const dif_menor = Math.min(...t_espaciosDisponibles);
            const i_espacioDisponible = memoria.c_ram
                .findIndex(espacio => (espacio[0] - segmento.t_segmento) === dif_menor && espacio[1] === null);

            if (i_espacioDisponible === -1)
            { this.salida.interfazWeb('⛔ [ERROR] No hay suficiente espacio de memoria para el segmento.'); }
            else
            {
                const t_igual = memoria.c_ram[i_espacioDisponible][1] === segmento.t_segmento;
                const t_mayor = memoria.c_ram[i_espacioDisponible][0] > segmento.t_segmento;

                if(t_igual) { memoria.c_ram[i_espacioDisponible][1] = segmento; }
                if(t_mayor) {
                    const t_restante = memoria.c_ram[i_espacioDisponible][0] - segmento.t_segmento;

                    memoria.c_ram[i_espacioDisponible][0] = segmento.t_segmento;
                    memoria.c_ram[i_espacioDisponible][1] = segmento;

                    if(i_espacioDisponible + 1 === memoria.c_ram.length)
                    { memoria.c_ram.push([t_restante, null]); }
                    else
                    { memoria.c_ram.splice(i_espacioDisponible + 1, 0, [t_restante, null])}
                }
            }
        });

        return memoria;
    }

    segmentarProceso(proceso) {
        const pid = proceso.pid;
        const proc_segmentado = [];
        const et_segmentos = Estrategia_segmentacion.et_segmento;

        let i_segmento = 0;

        for (const t_ejecutable of proceso.c_proceso) {
            let restante = t_ejecutable;

            while (restante > 0) {
                const t_segmento = Math.min(this.B_t_max_segmento, restante);
                const c_segmento = et_segmentos[i_segmento];

                proc_segmentado.push({
                    t_segmento: t_segmento,
                    c_segmento: c_segmento,
                    pid: pid
                });

                restante -= t_segmento;
            }

            i_segmento += 1;
        }
        
        return proc_segmentado;
    }


    limpiarMemoria(memoria, procesos) {
        const proc_ubicarMemoria = new Set(procesos.map(proceso => proceso.pid));
        
        memoria.c_ram.forEach(espacio => {
            const esSegmento         = typeof espacio[1] === 'object' && espacio[1] !== null;
            const proc_desalojar     = esSegmento ? !proc_ubicarMemoria.has(espacio[1].pid) : false;
 
            if(proc_desalojar)  { espacio[1] = null; }
        });

        return memoria;
    }

    unirParticionesLibres(memoria) {
        let i = 0;

        while(i < memoria.c_ram.length - 1) {
            const espacioDisponible = memoria.c_ram[i][1] === null;
            const sig_espacioLibre  = memoria.c_ram[i+1][1] === null;
            
            if(espacioDisponible && sig_espacioLibre) {
                memoria.c_ram[i][0] = memoria.c_ram[i][0] + memoria.c_ram[i+1][0];
                memoria.c_ram.splice(i + 1, 1);
            }
            else { i = i + 1; }
        }

        return memoria;
    }

    obtenerEstadisticas() {
        return [];
    }
}