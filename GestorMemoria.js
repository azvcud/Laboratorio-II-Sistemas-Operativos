export class GestorMemoria {
    constructor(memoria) {
        this._memoria = memoria;
        this._estrategia_gestor = null;
    }

    obtenerEstadisticas() {
        return this.estrategia_gestor.obtenerEstadisticas();
    }

    cargarSO(t_MiB_SO) {
        const t_B_SO = t_MiB_SO * 1048576;
        this._memoria.c_ram.push([t_B_SO, 'Sistema Operativo']);
    }

    particionarMemoria() {
        this._memoria.c_ram = this.estrategia_gestor.particionarMemoria(this._memoria);
    }

    set estrategia_gestor(estrategia) { this._estrategia_gestor = estrategia; }
    get estrategia_gestor() { return this._estrategia_gestor; }
    get memoria()           { return this._memoria; }
}