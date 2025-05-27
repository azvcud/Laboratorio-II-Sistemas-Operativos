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

export class Memoria {
    constructor(t_MiB_ram, t_KiB_stack, t_KiB_heap, t_B_header) {
        this.t_MiB_ram      = t_MiB_ram;
        this._t_KiB_stack    = t_KiB_stack;
        this._t_KiB_heap     = t_KiB_heap;
        this._t_B_header     = t_B_header;
    }

    get_t_ram(u_dev) {
        switch(u_dev) {
            case 'MiB': return this.t_MiB_ram;
            case 'KiB': return this.t_MiB_ram * 1024;
            case 'B':   return this.t_MiB_ram * 2048;
            case 'b':   return this.t_MiB_ram * 16384;
        }
    }

    get t_KiB_stack()   { return this._t_KiB_stack; }
    get t_KiB_heap()    { return this._t_KiB_heap; }
    get t_B_header()    { return this._t_B_header; }
}