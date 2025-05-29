export class Estrategia_t_fijo {
    static KiBS_EN_1MiB     = 1024;
    static BYTES_EN_1MiB    = 1048576;
    static BITS_EN_1MiB     = 8388608;

    constructor(t_MiB_particion) {
        this.t_MiB_particion = t_MiB_particion;
    }

    obtenerEstadisticas() {
        return [
            { t_MiB_particion: this.get_t_particion('MiB') },
            { t_KiB_particion: this.get_t_particion('KiB') },
            { t_B_particion: this.get_t_particion('B') },
            { t_b_particion: this.get_t_particion('b') }
        ];
    }

    particionarMemoria(memoria) {
        const t_B_disp_ram  = memoria.get_t_disp_ram('B');
        const t_B_particion = this.t_MiB_particion * Estrategia_t_fijo.BYTES_EN_1MiB;
        const n_particiones = Math.floor(t_B_disp_ram / t_B_particion);

        memoria.c_ram.push(...Array.from({length: n_particiones}, () => [t_B_particion, null]));
        return memoria.c_ram;
    }

    get_t_particion(u_dev) {
        switch(u_dev) {
            case 'MiB': return this.t_MiB_particion;
            case 'KiB': return this.t_MiB_particion * Estrategia_t_fijo.KiBS_EN_1MiB;
            case 'B':   return this.t_MiB_particion * Estrategia_t_fijo.BYTES_EN_1MiB;
            case 'b':   return this.t_MiB_particion * Estrategia_t_fijo.BITS_EN_1MiB;
        }
    }
}