export class Memoria {
    static KiBS_EN_1MiB     = 1024;
    static BYTES_EN_1MiB    = 1048576;
    static BITS_EN_1MiB     = 8388608;

    constructor(t_MiB_ram, t_KiB_stack, t_KiB_heap, t_B_header, t_MiB_virtual) {
        this.t_MiB_ram      = t_MiB_ram;
        this._t_KiB_stack   = t_KiB_stack;
        this._t_KiB_heap    = t_KiB_heap;
        this._t_B_header    = t_B_header;
        this._c_ram         = [];
        this._c_marcos      = [];
        this._t_B_virtual   = t_MiB_virtual * Memoria.BYTES_EN_1MiB;
    }

    get_t_ram(u_dev) {
        switch(u_dev) {
            case 'MiB': return this.t_MiB_ram;
            case 'KiB': return this.t_MiB_ram * Memoria.KiBS_EN_1MiB;
            case 'B':   return this.t_MiB_ram * Memoria.BYTES_EN_1MiB;
            case 'b':   return this.t_MiB_ram * Memoria.BITS_EN_1MiB;
        }
    }

    get_pos_c_ram(u_dev) {
        let acc = 0;
        
        const sum_acc_t_c_ram = this._c_ram.map(v_act_proceso => {
            acc += v_act_proceso[0];
            return acc;
        })

        let pos_c_ram = [0, ...sum_acc_t_c_ram]
        pos_c_ram[pos_c_ram.length - 1] -= 1;

        if(u_dev === 'HEX')         { return pos_c_ram.map((v_act_c_ram) => this.get_hex_v(v_act_c_ram)) }
        else if(u_dev === 'DEC')    { return pos_c_ram; }
    }

    get_hex_v(t_B) {
        return `0x${t_B.toString(16)}`;
    }

    get_sum_t_c_ram() {
        return this._c_ram
            .filter(v_act_proceso => v_act_proceso[1] !== null)         //v_act_proceso[1] := v_act_c_proceso
            .reduce((acc, v_act_proceso) => acc + v_act_proceso[0], 0); //v_act_proceso[0] := v_act_t_MiB_proceso
    }

    get_t_disp_ram(u_dev) {
        switch(u_dev) {
            case 'MiB': return this.t_MiB_ram - this.get_sum_t_c_ram();
            case 'KiB': return (this.t_MiB_ram * Memoria.KiBS_EN_1MiB)  - this.get_sum_t_c_ram();
            case 'B':   return (this.t_MiB_ram * Memoria.BYTES_EN_1MiB) - this.get_sum_t_c_ram();
            case 'b':   return (this.t_MiB_ram * Memoria.BITS_EN_1MiB)  - this.get_sum_t_c_ram(); 
        }
    }

    put_particion(particion) {
        this._c_ram.push(particion);
    }

    set c_ram(c_ram)        { this._c_ram = c_ram; }

    get t_KiB_stack()   { return this._t_KiB_stack; }
    get t_KiB_heap()    { return this._t_KiB_heap; }
    get t_B_header()    { return this._t_B_header; }
    get t_B_virtual()   { return this._t_B_virtual; }
    get c_ram()         { return this._c_ram; }
    get c_marcos()      { return this._c_marcos; }
}