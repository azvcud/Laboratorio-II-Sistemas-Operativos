import { SO } from './SO.js';
import { Programa } from './Programa.js';
import { Memoria } from './Memoria.js';
import { Estrategia_t_fijo } from './Estrategia_t_fijo.js';
import { Estrategia_t_variable } from './Estrategia_t_variable.js';
import { Estrategia_dinamica } from './Estrategia_dinamica.js';
import { GestorMemoria } from './GestorMemoria.js';
import { Salida } from './Salida.js';
import { Estrategia_segmentacion } from './Estrategia_segmentacion.js';
import { Estrategia_paginacion } from './Estrategia_paginacion.js';

document.addEventListener("DOMContentLoaded", function () {
    const bt_ejecutarPrograma       = document.getElementById('ejecutar');
    const bt_agregarPrograma        = document.getElementById('agregarPrograma');
    const bt_agregarTiempo          = document.getElementById('agregarTiempo');
    const bt_agregarParticion       = document.getElementById('agregarParticion');
    const bt_eliminarPrograma       = document.getElementById('eliminarPrograma');
    const bt_eliminarTiempo         = document.getElementById('eliminarTiempo');
    const bt_eliminarParticion      = document.getElementById('eliminarParticion');
    const sel_estrategiaGestor      = document.getElementById('estrategiaGestion');
    const sel_opcionesEstrategia    = document.getElementById('opcionesEstrategia');
    const sel_n_proceso             = document.getElementById('numeroProceso');
    const table_programa            = document.getElementById('tablaProgramas');
    const table_tiemposProcesos     = document.getElementById('tablaTiemposProcesos');
    const table_particiones         = document.getElementById('tablaParticiones');
    const table_generalidades       = document.getElementById('tablaGeneralidades');
    const table_memoria             = document.getElementById('tablaMemoria');
    const table_estadoMemoria       = document.getElementById('tablaEstadoMemoria');
    const table_procesos            = document.getElementById('tablaProcesos');
    const table_descripcion         = document.getElementById('tablaDescripcion');
    const table_fragmentos          = document.getElementById('tablaFragmentos');
    const table_spec_segmentos      = document.getElementById('tablaSpecSegmentos');
    const table_spec_paginas        = document.getElementById('tablaSpecPaginas');
    const table_dir_logica          = document.getElementById('tablaDirLogica');
    const table_segmentos           = document.getElementById('tablaSegmentos');
    const table_paginas             = document.getElementById('tablaPaginas');
    const input_tiempoCiclo         = document.getElementById('tiempoCiclo');
    const div_terminal              = document.getElementById('terminal1');
    /*--------------------------------------------------------------------------------------------------------*/

    function extraerGeneralidades(table_generalidades) {
        const filas = table_generalidades.getElementsByTagName("tr");

        let generalidades = [];

        for (let i = 1; i < filas.length; i++) {
            const celdas = filas[i].getElementsByTagName("td");

            for (let j = 0; j < celdas.length; j++) {
                if (celdas[j].isContentEditable) {
                    const valor = celdas[j].textContent.trim();
                    generalidades.push(Number(valor));
                    break;
                }
            }
        }

        return generalidades;
    }

    function extraerProgramas(table_programa) {
        const filas     = table_programa.querySelectorAll("tbody tr");
        const programas = [];

        filas.forEach(fila => {
            const celdas = fila.querySelectorAll("td");

            const nombre        = celdas[0].textContent.trim();
            const codigo        = Number(celdas[2].textContent.trim());
            const datosIni      = Number(celdas[3].textContent.trim());
            const datosNoIni    = Number(celdas[4].textContent.trim());

            programas.push(Programa.bind(null, nombre, codigo, datosIni, datosNoIni));
        })

        return programas;
    }

    function extraerTiempos(table_tiemposProcesos) {
        const filas     = table_tiemposProcesos.querySelectorAll("tr");
        const procesos  = [];

        for (let i = 1; i < filas.length; i++) {
            const celdas = filas[i].querySelectorAll("td");
            const pid = i; // o puedes extraer el ID como p1, p2... si prefieres
            const ts_proceso = [];

            // Saltamos la primera celda (nombre del proceso)
            for (let j = 1; j < celdas.length; j++) {
                const valorTexto    = celdas[j].textContent.trim();
                const valor         = valorTexto === "" ? -1 : Number(valorTexto);

                ts_proceso.push(isNaN(valor) ? -1 : valor); // En caso de celda vacía, pone -1
            }

            procesos.push({ pid, ts_proceso });
        }

        return procesos;
    }

    function extraerParticiones(table_particiones) {
        const filas = table_particiones.querySelectorAll("tr");
        const particiones = [];

        for (let i = 1; i < filas.length; i++) {
            const celdas = filas[i].querySelectorAll("td");

            const textoMiB      = celdas[0].textContent.trim();
            const textoCantidad = celdas[3].textContent.trim();

            // Parseamos con parseFloat para aceptar decimales
            const t_MiB     = textoMiB === "" ? 0 : parseFloat(textoMiB);
            const cantidad  = textoCantidad === "" ? 0 : parseInt(textoCantidad, 10);

            particiones.push({
                t_MiB_particion: isNaN(t_MiB) ? 0 : t_MiB,
                ca_particion: isNaN(cantidad) ? 0 : cantidad
            });
        }

        return particiones;
    }

    function extraerDireccionLogica(table_dir_logica) {
        const fila                              = table_dir_logica.querySelector("tbody tr");
        const [n_espaciosCelda, offsetCelda]    = fila.querySelectorAll("td"); 
        const n_espacios                        = parseInt(n_espaciosCelda.textContent.trim(), 10);
        const offset                            = parseInt(offsetCelda.textContent.trim(), 10);

        return [n_espacios, offset];
    }

    function ejecutarPrograma(
        salida, table_generalidades, table_programa, table_tiemposProcesos, table_particiones,
        sel_opcionesEstrategia, sel_estrategiaGestor, table_memoria, table_estadoMemoria,
        table_procesos, table_fragmentos, input_tiempoCiclo, table_descripcion, table_spec_segmentos,
        table_dir_logica, table_spec_paginas, sel_n_proceso, table_segmentos, table_paginas
    ) {
        const generalidades     = extraerGeneralidades(table_generalidades);
        const bits_direccion    = extraerDireccionLogica(table_dir_logica);

        const t_MiB_ram     = generalidades[0];
        const t_KiB_stack   = generalidades[1];
        const t_KiB_heap    = generalidades[2];
        const t_B_header    = generalidades[3];
        const t_MiB_SO      = generalidades[4];

        const t_b_n_espacios = bits_direccion[0];
        const t_b_offset     = bits_direccion[1];

        const ms_retardo    = input_tiempoCiclo.value;

        const programas     = extraerProgramas(table_programa);
        const procesos      = extraerTiempos(table_tiemposProcesos);
        const particiones   = extraerParticiones(table_particiones);

        const particionFija = particiones[0].t_MiB_particion;

        const estrategia_dinamica   = new Estrategia_dinamica('mejor', salida);

        let ajuste_t_variable = 'mejor';
        switch(sel_opcionesEstrategia.value) {
            case 'PEA': ajuste_t_variable = 'peor'; break;
            case 'MEA': ajuste_t_variable = 'mejor'; break;
            case 'PRA': ajuste_t_variable = 'primer'; break;
            case 'SIC': estrategia_dinamica.b_compactacion = false; break;
            case 'CIC': estrategia_dinamica.b_compactacion = true; break;
            default: estrategia_dinamica.b_compactacion = false; break;
        }

        const gestorMemoria             = new GestorMemoria(new Memoria(t_MiB_ram, t_KiB_stack, t_KiB_heap, t_B_header));
        const estrategia_t_fijo         = new Estrategia_t_fijo(particionFija, salida);
        const estrategia_t_variable     = new Estrategia_t_variable(particiones, ajuste_t_variable, salida);
        const estrategia_segmentacion   = new Estrategia_segmentacion(t_b_n_espacios, t_b_offset, salida);
        const estrategia_paginacion     = new Estrategia_paginacion(t_b_n_espacios, t_b_offset, salida);
        
        switch(sel_estrategiaGestor.value) {
            case 'ETF': gestorMemoria.estrategia_gestor = estrategia_t_fijo; break;
            case 'ETV': gestorMemoria.estrategia_gestor = estrategia_t_variable; break;
            case 'DIN': gestorMemoria.estrategia_gestor = estrategia_dinamica; break;
            case 'SEG': gestorMemoria.estrategia_gestor = estrategia_segmentacion; break;
            case 'PAG': gestorMemoria.estrategia_gestor = estrategia_paginacion; break;

            default: gestorMemoria.estrategia_gestor = estrategia_t_fijo; break;
        }

        const windows = new SO(t_MiB_SO, gestorMemoria, programas, procesos, salida, ms_retardo);

        limpiarGUI(
            table_memoria, table_estadoMemoria, table_procesos, table_fragmentos, table_descripcion, table_spec_segmentos,
            table_spec_paginas, sel_n_proceso, table_segmentos, table_paginas
        );
        salida.calcularGeneralidades(table_generalidades);
        salida.calcular_t_disco(table_programa);
        salida.calcularParticiones(table_particiones);

        windows.encender();
    }

    function limpiarGUI(
        table_memoria, table_estadoMemoria, table_procesos, table_fragmentos, table_descripcion,
        table_spec_segmentos, table_spec_paginas, sel_n_proceso, table_segmentos, table_paginas
    ) {
        while (table_memoria.rows.length > 1) {
            table_memoria.deleteRow(1);
        }

        while (table_estadoMemoria.rows.length > 1) {
            table_estadoMemoria.deleteRow(1);
        }

        while (table_procesos.rows.length > 1) {
            table_procesos.deleteRow(1);
        }

        while (table_fragmentos.rows.length > 1) {
            table_fragmentos.deleteRow(1);
        }

        while (table_descripcion.rows.length > 1) {
            table_descripcion.deleteRow(1);
        }

        while (table_spec_segmentos.rows.length > 1) {
            table_spec_segmentos.deleteRow(1);
        }

        while (table_spec_paginas.rows.length > 1) {
            table_spec_paginas.deleteRow(1);
        }

        while (table_segmentos.rows.length > 1) {
            table_segmentos.deleteRow(1);
        }

        while (table_paginas.rows.length > 1) {
            table_paginas.deleteRow(1);
        }

        sel_n_proceso.innerHTML = '';
    }

    /*--------------------------------------------------------------------------------------------------------*/
    const salida = new Salida([
        table_memoria, table_estadoMemoria, table_procesos, table_fragmentos, div_terminal, table_descripcion, 
        table_spec_segmentos, table_spec_paginas, sel_n_proceso
    ]);
    /*--------------------------------------------------------------------------------------------------------*/
    bt_agregarPrograma.addEventListener('click', () => salida.agregarPrograma(table_programa, table_tiemposProcesos));
    bt_agregarTiempo.addEventListener('click', () => salida.agregarTiempo(table_tiemposProcesos));
    bt_agregarParticion.addEventListener('click', () => salida.agregarParticion(table_particiones));
    bt_eliminarPrograma.addEventListener('click', () => salida.eliminarPrograma(table_programa, table_tiemposProcesos));
    bt_eliminarTiempo.addEventListener('click', () => salida.eliminarTiempo(table_tiemposProcesos));
    bt_eliminarParticion.addEventListener('click', () => salida.eliminarParticion(table_particiones));
    sel_estrategiaGestor.addEventListener('change', () => salida.opcionesEstrategia(sel_estrategiaGestor, sel_opcionesEstrategia));
    sel_n_proceso.addEventListener('change', () => salida.detallesProceso(sel_n_proceso, table_segmentos, table_paginas));

    bt_ejecutarPrograma.addEventListener('click', () => ejecutarPrograma(
        salida, table_generalidades, table_programa, table_tiemposProcesos, table_particiones, sel_opcionesEstrategia,
        sel_estrategiaGestor, table_memoria, table_estadoMemoria, table_procesos, table_fragmentos, input_tiempoCiclo,
        table_descripcion, table_spec_segmentos, table_dir_logica, table_spec_paginas, sel_n_proceso, table_segmentos,
        table_paginas
    ));
})