export class Estrategia_t_fijo {
    static KiBS_EN_1MiB     = 1024;
    static BYTES_EN_1MiB    = 1048576;
    static BITS_EN_1MiB     = 8388608;

    constructor(t_MiB_particion) {
        this.t_MiB_particion = t_MiB_particion;
    }

    obtenerEstadisticas() {
        return [
            { t_MiB_particion: this.get_t_particion('MiB') },
            { t_KiB_particion: this.get_t_particion('KiB') },
            { t_B_particion: this.get_t_particion('B') },
            { t_b_particion: this.get_t_particion('b') }
        ];
    }

    particionarMemoria(memoria) {
        const t_B_disp_ram  = memoria.get_t_disp_ram('B');
        const t_B_particion = this.t_MiB_particion * Estrategia_t_fijo.BYTES_EN_1MiB;
        const n_particiones = Math.floor(t_B_disp_ram / t_B_particion);

        memoria.c_ram.push(...Array.from({length: n_particiones}, () => [t_B_particion, null]));
        return memoria.c_ram;
    }

    gestionarMemoriaProcesos(memoria, procesos) {
        const t_B_particion = this.t_MiB_particion * 1048576;
        
        memoria = this.limpiarMemoria(memoria, procesos);
        procesos
            .sort((proc_menor, proc_mayor) => proc_menor.turno - proc_mayor.turno)
            .forEach(proceso => {
                if(proceso.t_proceso > t_B_particion) 
                { console.warn(`⚠️ Advertencia: El proceso PID ${proceso.pid} (${proceso.t_proceso} B) es demasiado grande para una partición de memoria (${t_B_particion} B). No se pudo insertar.`)}
                else if(proceso.turno === 0)
                { console.log(`ℹ️ Info: El proceso PID ${proceso.pid} (${proceso.t_proceso} B) continúa en la memoria`); }
                else
                { memoria = this.insertarProcesoMemoria(memoria, proceso); }
            });
        
        return memoria.c_ram;
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

    insertarProcesoMemoria(memoria, proceso) {
        const i_espacioDisponible   = memoria.c_ram.findIndex(espacio => espacio[1] === null);

        if(i_espacioDisponible == -1)  
        { console.warn('No hay suficiente espacio de memoria.'); }
        else                            
        { memoria.c_ram[i_espacioDisponible][1] = proceso; }

        return memoria;
    }

    get_t_particion(u_dev) {
        switch(u_dev) {
            case 'MiB': return this.t_MiB_particion;
            case 'KiB': return this.t_MiB_particion * Estrategia_t_fijo.KiBS_EN_1MiB;
            case 'B':   return this.t_MiB_particion * Estrategia_t_fijo.BYTES_EN_1MiB;
            case 'b':   return this.t_MiB_particion * Estrategia_t_fijo.BITS_EN_1MiB;
        }
    }
}