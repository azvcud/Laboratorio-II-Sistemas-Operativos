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

export class Estrategia_dinamica {
    constructor(o_ajuste) {
        this.o_ajuste           = o_ajuste;
        this._b_compactacion    = false;
    }

    obtenerEstadisticas() {
        return [
            this.o_ajuste,
            this._b_compactacion
        ];
    }

    set b_compactacion(state) {
        this._b_compactacion = state;
    }
}