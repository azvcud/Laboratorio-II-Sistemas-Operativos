export class GestorMemoria {
    static BYTES_EN_1MiB = 1048576;

    constructor(memoria) {
        this._memoria           = memoria;
        this._estrategia_gestor = null;
        this._procesos          = [];
    }

    obtenerEstadisticas() {
        return this.estrategia_gestor.obtenerEstadisticas();
    }

    cargarSO(t_MiB_SO) {
        const t_B_SO = t_MiB_SO * GestorMemoria.BYTES_EN_1MiB;
        this._memoria.c_ram.push([t_B_SO, 'Sistema Operativo']);
    }

    particionarMemoria() {
        this._memoria.c_ram = this.estrategia_gestor.particionarMemoria(this._memoria);
    }

    gestionarMemoriaProcesos() {
        this._memoria.c_ram = this.estrategia_gestor.gestionarMemoriaProcesos(this._memoria, this._procesos);
    }

    set procesos(procesos)              { this._procesos = procesos; }
    set estrategia_gestor(estrategia)   { this._estrategia_gestor = estrategia; }

    get estrategia_gestor() { return this._estrategia_gestor; }
    get memoria()           { return this._memoria; }
}