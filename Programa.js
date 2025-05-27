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

export function Programa (nombre, t_B_text, t_B_data, t_B_bss, t_B_header) {
    this.nombre     = nombre;
    this.ct_disco   = [t_B_header, t_B_text, t_B_data, t_B_bss];
    this._t_disco   = this.ct_disco.reduce((acc, v_act) => acc + v_act, 0);
}

Programa.prototype = {
    get t_disco() { return this._t_disco; }
};