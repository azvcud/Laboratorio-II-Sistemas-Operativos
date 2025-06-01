export class Estrategia_dinamica {
    constructor(o_ajuste) {
        this.o_ajuste           = o_ajuste;
        this._b_compactacion    = false;
    }

    obtenerEstadisticas() {
        return [
            { o_ajuste: this.o_ajuste },
            { b_compactacion: this._b_compactacion }
        ];
    }

    gestionarMemoriaProcesos(memoria, procesos) {
        console.log(procesos);
        memoria = this.limpiarMemoria(memoria, procesos);
        
        memoria = this._b_compactacion ? 
            this.compactarMemoria(memoria) : this.unirParticionesLibres(memoria);

        procesos
            .sort((proc_menor, proc_mayor) => proc_menor.turno - proc_mayor.turno)
            .forEach(proceso => {
                if(proceso.turno === 0)
                { console.log(`ℹ️ Info: El proceso PID ${proceso.pid} (${proceso.t_proceso} B) continúa en la memoria`); }
                else
                { memoria = this.insertarProcesoMemoria(memoria, proceso); }
            });


        return memoria.c_ram;
    }

    insertarProcesoMemoria(memoria, proceso) {
        const t_disponibles = memoria.c_ram
            .filter(particion => particion[1] === null)
            .map(particion => particion[0] - proceso.t_proceso);
        
        const dif_p_memoria         = t_disponibles.filter(diferencia => diferencia > 0);
        const dif_menor             = Math.min(...dif_p_memoria);
        const i_espacioDisponible   = memoria.c_ram
            .findIndex(particion => (particion[0] - proceso.t_proceso) === dif_menor && particion[1] === null);

        if (i_espacioDisponible === -1)
        { console.warn('No hay suficiente espacio en la memoria.'); }
        else
        {
            const t_igual = memoria.c_ram[i_espacioDisponible][1] === proceso.t_proceso;
            const t_mayor = memoria.c_ram[i_espacioDisponible][0] > proceso.t_proceso;

            if(t_igual) { memoria.c_ram[i_espacioDisponible][1] = proceso; }
            if(t_mayor) {
                const t_restante = memoria.c_ram[i_espacioDisponible][0] - proceso.t_proceso;

                memoria.c_ram[i_espacioDisponible][0] = proceso.t_proceso;
                memoria.c_ram[i_espacioDisponible][1] = proceso;

                if(i_espacioDisponible + 1 === memoria.c_ram.length)
                { memoria.c_ram.push([t_restante, null]); }
                else
                { memoria.c_ram.splice(i_espacioDisponible + 1, 0, [t_restante, null])}
            }
        }

        return memoria;
    }

    limpiarMemoria(memoria, procesos) {
        const proc_ubicarMemoria = new Set(procesos.map(proceso => proceso.pid));
        
        memoria.c_ram.forEach(espacio => {
            const esProceso         = typeof espacio[1] === 'object' && espacio[1] !== null;
            const proc_desalojar    = esProceso ? !proc_ubicarMemoria.has(espacio[1].pid) : false;
 
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

    compactarMemoria(memoria) {
        const espaciosOcupados = memoria.c_ram
            .filter(particion => particion[1] !== null);

        const sum_espacioLibre = memoria.c_ram
            .filter(particion => particion[1] === null)
            .reduce((acc, v_act_particion) => acc + v_act_particion[0], 0);

        let memoriaCompactada = [...espaciosOcupados, [sum_espacioLibre, null]];
        memoria.c_ram = memoriaCompactada;

        return memoria;
    }

    particionarMemoria(memoria) {
        const t_B_disp_ram = memoria.get_t_disp_ram('B');
        
        memoria.c_ram.push([t_B_disp_ram, null]);
        return memoria.c_ram;
    }

    set b_compactacion(state) {
        this._b_compactacion = state;
    }
}