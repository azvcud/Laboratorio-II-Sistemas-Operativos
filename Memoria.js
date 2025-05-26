/*
t:      Tamaño
ct:     Contenido
co:     Contador
acc:    Acumulador
v_act:  Valor actual
v:      Valor
u_dev:  Unidad derivada
*/

export class Memoria {
    constructor(t_MiB_ram, t_KiB_stack, t_KiB_heap, t_B_header) {
        this.t_MiB_ram      = t_MiB_ram;
        this.t_KiB_stack    = t_KiB_stack;
        this.t_KiB_heap     = t_KiB_heap;
        this.t_B_header     = t_B_header;
    }

    get_t_ram(u_dev) {
        switch(u_dev) {
            case 'MiB': return this.t_MiB_ram;
            case 'KiB': return this.t_MiB_ram * 1024;
            case 'B':   return this.t_MiB_ram * 2048;
            case 'b':   return this.t_MiB_ram * 16384;
        }
    }

    get_t_KiB_stack() {
        return this.t_KiB_stack;
    }

    get_t_KiB_heap() {
        return this.t_KiB_heap;
    }

    get_t_B_header() {
        return this.t_B_header;
    }
}