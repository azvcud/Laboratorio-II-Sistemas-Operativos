export class Estrategia_t_variable {
    static KiBS_EN_1MiB     = 1024;
    static BYTES_EN_1MiB    = 1048576;
    static BITS_EN_1MiB     = 8388608;

    constructor(t_MiB_particiones, o_ajuste, salida) {
        this.t_MiB_particiones  = t_MiB_particiones;
        this.o_ajuste           = o_ajuste;
        this.salida             = salida;
    }

    obtenerEstadisticas() {
        return [
            this.get_t_particiones('MiB'),
            this.get_t_particiones('KiB'),
            this.get_t_particiones('B'),
            this.get_t_particiones('b'),
            { o_ajuste: this.o_ajuste }
        ];
    }

    particionarMemoria(memoria) {
        memoria.c_ram.push(
            ...this.t_MiB_particiones.flatMap(c_particion => {
                const t_B_particion = c_particion.t_MiB_particion * Estrategia_t_variable.BYTES_EN_1MiB;

                return Array.from({ length: c_particion.ca_particion }, () => [t_B_particion, null]);
            })
        );

        return memoria.c_ram;
    }

    gestionarMemoriaProcesos(memoria, procesos) {
        memoria = this.limpiarMemoria(memoria, procesos);
        
        procesos
            .sort((proc_menor, proc_mayor) => proc_menor.turno - proc_mayor.turno)
            .forEach(proceso => {
                if(proceso.turno === 0)
                { this.salida.interfazWeb(`ℹ️ [INFO] El proceso PID ${proceso.pid} (${proceso.t_proceso} B) continúa en la memoria`); }
                else
                { switch(this.o_ajuste) {
                    case 'primer':  memoria = this.insertarPrimerAjuste(memoria, proceso);    break;
                    case 'peor':    memoria = this.insertarPeorAjuste(memoria, proceso);      break;
                    case 'mejor':   this.insertarMejorAjuste(memoria, proceso);               break;
                }}
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

    insertarPrimerAjuste(memoria, proceso) {
        const i_espacioDisponible = memoria.c_ram
            .findIndex(particion => particion[0] >= proceso.t_proceso && particion[1] === null);
        
        if(i_espacioDisponible === -1)
        { this.salida.interfazWeb('⛔ [ERROR] No hay suficiente espacio de memoria.'); }
        else
        { memoria.c_ram[i_espacioDisponible][1] = proceso; }        

        return memoria;
    }

    insertarPeorAjuste(memoria, proceso) {
        const t_disponibles = memoria.c_ram
            .filter(particion => particion[1] === null)
            .map(particion => particion[0]);

        const max_t                 = Math.max(...t_disponibles);
        const i_espacioDisponible   = memoria.c_ram
            .findIndex(particion => particion[0] === max_t && particion[1] === null);

        const esOcupable = max_t > proceso.t_proceso;
    
        if(i_espacioDisponible === -1)
        { this.salida.interfazWeb('⛔ [ERROR] No hay suficiente espacio de memoria.'); }
        else if(!esOcupable)
        { this.salida.interfazWeb(`⚠️ [ADVERTENCIA] El proceso PID ${proceso.pid} (${proceso.t_proceso} B) es demasiado grande para una partición de memoria (${max_t} B). No se pudo insertar.`); }
        else                            
        { memoria.c_ram[i_espacioDisponible][1] = proceso; }

        return memoria;
    }

    insertarMejorAjuste(memoria, proceso) {
        const t_disponibles = memoria.c_ram
            .filter(particion => particion[1] === null)
            .map(particion => particion[0] - proceso.t_proceso);
        
        const dif_p_memoria         = t_disponibles.filter(diferencia => diferencia > 0);
        const dif_menor             = Math.min(...dif_p_memoria);
        const i_espacioDisponible   = memoria.c_ram
            .findIndex(particion => (particion[0] - proceso.t_proceso) === dif_menor && particion[1] === null);

        if(i_espacioDisponible === -1)
        { this.salida.interfazWeb('⛔ [ERROR] No hay suficiente espacio de memoria.'); }
        else
        { memoria.c_ram[i_espacioDisponible][1] = proceso; }
                
        return memoria;
    }

    get_t_particiones(u_dev) {
        let m_t_particion = 1;

        switch(u_dev) {
            case 'MiB': m_t_particion = 1; break;
            case 'KiB': m_t_particion = Estrategia_t_variable.KiBS_EN_1MiB; break;
            case 'B':   m_t_particion = Estrategia_t_variable.BYTES_EN_1MiB; break;
            case 'b':   m_t_particion = Estrategia_t_variable.BITS_EN_1MiB; break;
            default:    m_t_particion = 1; break;
        }

        return this.t_MiB_particiones.map(v_particion => {
            return {
                u_dev_particion: u_dev,
                t_particion: v_particion.t_MiB_particion * m_t_particion,
                c_particion: v_particion.ca_particion
            };
        });
    }
}