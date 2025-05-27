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

export class Estrategia_t_fijo {
    constructor(t_MiB_particion) {
        this.t_MiB_particion = t_MiB_particion;
    }

    obtenerEstadisticas() {
        return [
            this.get_t_particion('MiB'),
            this.get_t_particion('KiB'),
            this.get_t_particion('B'),
            this.get_t_particion('b')
        ];
    }

    get_t_particion(u_dev) {
        switch(u_dev) {
            case 'MiB': return this.t_MiB_particion;
            case 'KiB': return this.t_MiB_particion * 1024;
            case 'B':   return this.t_MiB_particion * 2048;
            case 'b':   return this.t_MiB_particion * 16384;
        }
    }
}