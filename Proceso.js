export class Proceso {
    static co_pid = 0;

    constructor(t_text, t_data, t_bss, t_heap, t_stack) {
        this.v_pid     = ++Proceso.co_pid;
        this.c_proceso = [t_text, t_data, t_bss, t_heap, t_stack];
        this.t_proceso = this.c_proceso.reduce((acc, v_act) => acc + v_act, 0);
    }

    get t_proceso() { return this.t_proceso; }
}