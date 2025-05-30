export function Programa (nombre, t_B_text, t_B_data, t_B_bss, t_B_header) {
    this.nombre     = nombre;
    this._ct_disco  = [t_B_header, t_B_text, t_B_data, t_B_bss];
    this._t_B_disco = this.ct_disco.reduce((acc, v_act) => acc + v_act, 0);
}

Programa.prototype = {
    get ct_disco() { return this._ct_disco; }
}