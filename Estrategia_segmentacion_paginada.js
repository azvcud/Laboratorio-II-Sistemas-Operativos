export class Estrategia_segmentacion_paginada {
    static et_segmento  = [".text", ".data", ".bss", ".heap", ".stack"];

    constructor(b_segmento, b_n_pagina, b_t_pagina, salida) {
        this.B_ca_segmentos     = 2 ** b_segmento;
        this.B_n_pagina         = 2 ** b_n_pagina;
        this.B_t_pagina         = 2 ** b_t_pagina;
        this.B_t_max_segmento   = 2 ** (b_n_pagina + b_t_pagina);
        this.salida             = salida;
    }

    particionarMemoria(memoria) {
        const n_marcos_virtual  = Math.floor(memoria.t_B_virtual / this.B_t_pagina);
        
        this.salida.interfazWeb(`ℹ️ [INFO] Número de marcos virtuales: ${n_marcos_virtual}`);
        this.salida.interfazWeb(`ℹ️ [INFO] Total de memoria direccionable: ${memoria.t_B_virtual + (memoria.t_MiB_ram * 1048576)} B`);

        memoria = this.paginarSO(memoria);

        const t_B_disp_ram = memoria.get_t_disp_ram('B');
        
        memoria.c_ram.push([t_B_disp_ram, null]);
        return memoria.c_ram;
    }

    paginarSO(memoria) {
        const t_SO          = memoria.c_ram[0][0];
        const c_paginas_SO  = Math.ceil(t_SO / this.B_t_pagina);
        
        memoria.c_ram.shift();
        for(let i = 0; i < c_paginas_SO; i++) {
            memoria.c_ram.push([this.B_t_pagina, 'Sistema Operativo']);
        }

        return memoria;
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
            const paginas_segmento = this.paginarSegmento(segmento);

            paginas_segmento.forEach(pagina => {
                const t_espaciosDisponibles = memoria.c_ram
                    .filter(espacio => espacio[1] === null)
                    .map(espacio => espacio[0] - this.B_t_pagina)
                    .filter(diferencia => diferencia >= 0);

                const dif_menor = Math.min(...t_espaciosDisponibles);
                const i_espacioDisponible = memoria.c_ram
                    .findIndex(espacio => (espacio[0] - this.B_t_pagina) === dif_menor && espacio[1] === null);

                if (i_espacioDisponible === -1)
                { this.salida.interfazWeb(`⛔ [ERROR] No hay suficiente espacio disponible para la pagina del segmento que pertenece al PID ${proceso.pid}.`); }
                else
                {
                    const t_igual = memoria.c_ram[i_espacioDisponible][0] === this.B_t_pagina;
                    const t_mayor = memoria.c_ram[i_espacioDisponible][0] > this.B_t_pagina;

                    if(t_igual) { memoria.c_ram[i_espacioDisponible][1] = pagina; }
                    if(t_mayor) {
                        const t_restante = memoria.c_ram[i_espacioDisponible][0] - this.B_t_pagina;

                        memoria.c_ram[i_espacioDisponible][0] = this.B_t_pagina;
                        memoria.c_ram[i_espacioDisponible][1] = pagina;

                        if(i_espacioDisponible + 1 === memoria.c_ram.length)
                        { memoria.c_ram.push([t_restante, null]); }
                        else
                        { memoria.c_ram.splice(i_espacioDisponible + 1, 0, [t_restante, null])}
                    }
                }
            })
        });

        return memoria;
    }

    segmentarProceso(proceso) {
        const pid = proceso.pid;
        const proc_segmentado = [];
        const et_segmentos = Estrategia_segmentacion_paginada.et_segmento;

        let i_c_segmento    = 0;
        let i_segmento      = 0;    

        for (const t_ejecutable of proceso.c_proceso) {
            let restante = t_ejecutable;

            while (restante > 0) {
                const t_segmento = Math.min(this.B_t_max_segmento, restante);
                const c_segmento = et_segmentos[i_c_segmento];

                proc_segmentado.push({
                    i_segmento      : i_segmento,
                    t_segmento      : t_segmento,
                    c_segmento      : c_segmento,
                    pid: pid
                });

                i_segmento = i_segmento + 1;
                restante -= t_segmento;
            }

            i_c_segmento += 1;
        }
        i_segmento = 0;
        
        return proc_segmentado;
    }

    paginarSegmento(segmento) {
        const t_segmento            = segmento.t_segmento;
        const c_paginas_segmento    = Math.ceil(t_segmento / this.B_t_pagina);
        const ct_paginado_segmento  = [];
        const t_pa_segmentos        = [];

        let aux_t_segmento = t_segmento;
        while (aux_t_segmento > 0) {
            const pa_segmento = Math.min(aux_t_segmento, this.B_t_pagina);
            t_pa_segmentos.push(pa_segmento);

            aux_t_segmento -= pa_segmento
        }
        
        for(let i = 0; i < c_paginas_segmento; i++) {

            ct_paginado_segmento.push({
                pid             : segmento.pid,
                i_segmento      : segmento.i_segmento,
                i_pagina        : i + 1,
                t_pagina        : this.B_t_pagina,
                t_pa_segmento   : t_pa_segmentos[i],
                c_pagina        : segmento.c_segmento
            });
        }

        return ct_paginado_segmento;
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