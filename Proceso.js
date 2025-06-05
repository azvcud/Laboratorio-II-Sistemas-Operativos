export class Proceso {
    constructor(pid, turno, t_text, t_data, t_bss, t_stack, t_heap) {
        this.pid        = pid;
        this.turno      = turno;
        this._c_proceso  = [t_text, t_data, t_bss, t_stack, t_heap];
        this._t_proceso = this.c_proceso.reduce((acc, v_act) => acc + v_act, 0);
    }

    get t_proceso() { return this._t_proceso; }
    get c_proceso() { return this._c_proceso; }
}