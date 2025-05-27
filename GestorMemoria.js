/*
t:      Tamaño
ts:     Tiempo
ct:     Contenido
co:     Contador
ca:     Cantidad
acc:    Acumulador
v_act:  Valor actual
v:      Valor
u_dev:  Unidad derivada
o:      Opción
m:      Multiplicador
b:      Interruptor (Booleano)
*/

export class GestorMemoria {
    constructor(ts_procesos) {
        this.ts_procesos        = ts_procesos;
        this._estrategia_gestor = null;
    }

    obtenerEstadisticas() {
        return this.estrategia_gestor.obtenerEstadisticas();
    }

    set estrategia_gestor(estrategia) { this._estrategia_gestor = estrategia; }
    get estrategia_gestor() { return this._estrategia_gestor; }
}