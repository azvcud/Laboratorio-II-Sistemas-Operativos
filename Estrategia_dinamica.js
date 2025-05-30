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