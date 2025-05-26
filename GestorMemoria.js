/*
ts:     Tiempo
t:      Tamaño
ct:     Contenido
co:     Contador
acc:    Acumulador
v_act:  Valor actual
v:      Valor
u_dev:  Unidad derivada
*/

export class GestorMemoria {
    constructor(ts_procesos) {
        this.ts_procesos        = ts_procesos;
        this.estrategia_gestor  = null;
    }

    set estrategia_gestor(estrategia) { this.estrategia_gestor = estrategia; }
    
    get estrategia_gestor() { return this.estrategia_gestor; }
}