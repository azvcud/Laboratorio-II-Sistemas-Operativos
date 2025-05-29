export class Estrategia_t_variable {
    static KiBS_EN_1MiB     = 1024;
    static BYTES_EN_1MiB    = 1048576;
    static BITS_EN_1MiB     = 8388608;

    constructor(t_MiB_particiones, o_ajuste) {
        this.t_MiB_particiones  = t_MiB_particiones;
        this.o_ajuste           = o_ajuste;
    }

    obtenerEstadisticas() {
        return [
            this.get_t_particiones('MiB'),
            this.get_t_particiones('KiB'),
            this.get_t_particiones('B'),
            this.get_t_particiones('b'),
            { o_ajuste: this.o_ajuste }
        ];
    }

    particionarMemoria(memoria) {
        memoria.c_ram.push(
            ...this.t_MiB_particiones.flatMap(c_particion => {
                const t_B_particion = c_particion.t_MiB_particion * Estrategia_t_variable.BYTES_EN_1MiB;

                return Array.from({ length: c_particion.ca_particion }, () => [t_B_particion, null]);
            })
        );

        return memoria.c_ram;
    }

    get_t_particiones(u_dev) {
        let m_t_particion = 1;

        switch(u_dev) {
            case 'MiB': m_t_particion = 1; break;
            case 'KiB': m_t_particion = Estrategia_t_variable.KiBS_EN_1MiB; break;
            case 'B':   m_t_particion = Estrategia_t_variable.BYTES_EN_1MiB; break;
            case 'b':   m_t_particion = Estrategia_t_variable.BITS_EN_1MiB; break;
            default:    m_t_particion = 1; break;
        }

        return this.t_MiB_particiones.map(v_particion => {
            return {
                u_dev_particion: u_dev,
                t_particion: v_particion.t_MiB_particion * m_t_particion,
                c_particion: v_particion.ca_particion
            };
        });
    }
}