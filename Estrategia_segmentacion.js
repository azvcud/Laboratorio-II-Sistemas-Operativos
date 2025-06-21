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
        console.log(procesos);
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
        const c_proceso         = proceso.c_proceso;
        
        const t_segmentacion = c_proceso.flatMap(t_ejecutable => {
            if (t_ejecutable <= this.B_t_max_segmento)
            { return t_ejecutable; }

            else {
                const c_segmentado_partes = (v_segmento, c_segmento = []) => {
                    if(v_segmento <= 0) { return c_segmento; }
                    
                    const t_segmento = Math.min(this.B_t_max_segmento, v_segmento);
                    return c_segmentado_partes(v_segmento - t_segmento, [...c_segmento, t_segmento]);
                }
                return [c_segmentado_partes(t_ejecutable)];
            }  
        });

        const proc_segmentado   = [];
        const pid               = proceso.pid;
        let i_segmento          = 0;

        t_segmentacion.forEach(t_segmento => {
            const c_segmento = Estrategia_segmentacion.et_segmento[i_segmento]; 

            if (t_segmento instanceof Array) 
            { t_segmento.forEach(pa_segmento => proc_segmentado.push({
                    t_segmento : pa_segmento,
                    c_segmento : c_segmento,
                    pid        : pid
                })); 
            }
            else 
            { proc_segmentado.push({
                    t_segmento : t_segmento,
                    c_segmento : c_segmento,
                    pid        : pid
                }); 
            }

            i_segmento = i_segmento + 1;
        });

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