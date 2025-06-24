export class Estrategia_paginacion {
    static et_segmento = [".text", ".data", ".bss", ".heap", ".stack"];

    constructor(b_n_pagina, b_t_pagina, salida) {
        this.B_n_pagina = 2 ** b_n_pagina;
        this.B_t_pagina = 2 ** b_t_pagina;
        this.salida     = salida;
    }

    particionarMemoria(memoria) {
        const t_B_disp_ram      = memoria.get_t_disp_ram('B');
        const n_particiones     = Math.floor(t_B_disp_ram / this.B_t_pagina);
        const n_marcos_virtual  = Math.floor(memoria.t_B_virtual / this.B_t_pagina);
        
        this.salida.interfazWeb(`ℹ️ [INFO] Número de marcos virtuales: ${n_marcos_virtual}`);
        this.salida.interfazWeb(`ℹ️ [INFO] Total de memoria direccionable: ${memoria.t_B_virtual + (memoria.t_MiB_ram * 1048576)} B`);

        memoria = this.paginarSO(memoria);
        memoria.c_ram.push(...Array.from({length: n_particiones}, () => [this.B_t_pagina, null]));
        memoria = this.crearMarcos(memoria);

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

    crearMarcos(memoria) {
        const ca_paginas_ram = memoria.c_ram.length;
        
        for(let i = 0; i < ca_paginas_ram; i++) {
            memoria.c_marcos.push([i.toString(16), i]);
        }

        return memoria;
    }

    gestionarMemoriaProcesos(memoria, procesos) {
        memoria = this.limpiarMemoria(memoria, procesos);

        procesos
            .sort((proc_menor, proc_mayor) => proc_menor.turno - proc_mayor.turno)
            .forEach(proceso => {
                if(proceso.turno === 0)
                { this.salida.interfazWeb(`ℹ️ [INFO] Los segmentos del proceso con PID ${proceso.pid} continúan en la memoria`); }
                else
                { memoria = this.paginarProceso(memoria, proceso); }
            });

        return memoria.c_ram;
    }

    paginarProceso(memoria, proceso) {
        console.log(proceso);
        let i_pagina = 0;

        proceso.c_proceso.forEach(t_espacio => {
            const c_paginas_espacio = Math.ceil(t_espacio / this.B_t_pagina);
            const c_pagina          = Estrategia_paginacion.et_segmento[i_pagina];

            if(c_paginas_espacio > this.B_n_pagina) {
                this.salida.interfazWeb(`⛔ [ERROR] Error de paginación. El proceso ${proceso.pid} no se creó.`);
                return memoria;
            }

            for(let i = 0; i < c_paginas_espacio; i++) {
                const i_espacioDisponible   = memoria.c_ram.findIndex(espacio => espacio[1] === null);
            
                if(i_espacioDisponible === -1)  
                { this.salida.interfazWeb('⛔ [ERROR] No hay suficiente espacio de memoria.'); }
                else                            
                { 
                    memoria.c_ram[i_espacioDisponible][1] = {
                        t_pagina : this.B_t_pagina,
                        c_pagina : c_pagina,
                        pid      : proceso.pid
                    }; 
                }
            }

            i_pagina = i_pagina + 1;
        });


        return memoria;
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

    obtenerEstadisticas() {
        return [];
    }
}