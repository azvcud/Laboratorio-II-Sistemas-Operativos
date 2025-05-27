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

export class Estrategia_t_variable {
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
            this.o_ajuste
        ];
    }

    get_t_particiones(u_dev) {
        let m_t_particion = 1;

        switch(u_dev) {
            case 'MiB': m_t_particion = 1; break;
            case 'KiB': m_t_particion = 1024; break;
            case 'B':   m_t_particion = 2048; break;
            case 'b':   m_t_particion = 16384; break;
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