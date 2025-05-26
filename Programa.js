/*
t:      Tamaño
ct:     Contenido
co:     Contador
acc:    Acumulador
v_act:  Valor actual
v:      Valor
u_dev:  Unidad derivada
*/

export function Programa (nombre, t_B_text, t_B_data, t_B_bss, t_B_header) {
    this.nombre     = nombre;
    this.ct_disco   = [t_B_header, t_B_text, t_B_data, t_B_bss];
    this.t_disco    = this.ct_disco.reduce((acc, v_act) => acc + v_act, 0);
}

Programa.prototype.get_t_disco = function () {
    return this.t_disco;
}