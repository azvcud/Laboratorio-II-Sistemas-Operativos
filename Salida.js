export class Salida {
    static nombres_tablaProgramas = 9;
    static procesos_tablaTiempos  = 9;
    static tiempos_tablaTiempos   = 6;
    static particiones            = 1;

    constructor(ids) {
        this._ids               = ids;
        this._v_act_memoria     = [];
        this._v_act_dirDEC      = [];
        this._v_act_dirHEX      = [];
        this.v_act_estrategia   = '';
        this.i_marcoHEX         = 0;
        this.i_marcoDEC         = 0;
        this.i_th_segmento      = 0;
        this.estado_anterior    = [[-1, -1, -1, -1, -1, -1, -1, -1]];
    }

    contextoEstrategia(esSegmentacion, esPaginacion, esSegmentacionPaginada) {

        if (esSegmentacion)
        { this.v_act_estrategia = 'SEG'; }

        else if (esPaginacion || esSegmentacionPaginada) {
            const tabla         = this.ids[0]; 
            const filaHeader    = tabla.querySelector('thead tr');
            const marcoDEC      = document.createElement('th');
            const marcoHEX      = document.createElement('th');
    
            marcoDEC.textContent = 'Marco DEC';
            marcoHEX.textContent = 'Marco HEX';
    
            filaHeader.appendChild(marcoDEC);
            filaHeader.appendChild(marcoHEX);
                
            if(esSegmentacionPaginada) {
                const segmento = document.createElement('th');
                segmento.textContent = 'Segmento';

                filaHeader.appendChild(segmento);

                this.v_act_estrategia = 'SPG';

                this.i_th_segmento = filaHeader.cells.length - 1;
                this.i_marcoHEX = filaHeader.cells.length - 2;
                this.i_marcoDEC = filaHeader.cells.length - 3;
            }
            else
            {
                this.i_marcoHEX = filaHeader.cells.length - 1;
                this.i_marcoDEC = filaHeader.cells.length - 2;
                this.v_act_estrategia = 'PAG'; 
            }
        }
        else
        { this.v_act_estrategia = '';}
    }

    vaciarContexto() {
        if(this.i_marcoDEC !== 0 || this.i_marcoHEX !== 0) {

            if(this.i_th_segmento !== 0) {
                Array.from(this.ids[0].rows).forEach(fila => {
                    if(fila.cells[this.i_th_segmento]) {
                        fila.deleteCell(this.i_th_segmento);
                    }
                })
            }

            Array.from(this.ids[0].rows).forEach(fila => {
                if(fila.cells[this.i_marcoHEX]) {
                    fila.deleteCell(this.i_marcoHEX);
                }
            });

            Array.from(this.ids[0].rows).forEach(fila => {
                if(fila.cells[this.i_marcoDEC]) {
                    fila.deleteCell(this.i_marcoDEC);
                }
            });
        }

        this.i_marcoHEX     = 0;
        this.i_marcoDEC     = 0;
        this.i_th_segmento  = 0;
    }

    agregarPrograma(table_programa, table_tiemposProcesos) {
        const tablaPrograma = table_programa.getElementsByTagName('tbody')[0];
        const tablaTiempos  = table_tiemposProcesos.getElementsByTagName('tbody')[0];
        const filaPrograma  = document.createElement("tr");
        const filaTiempos   = document.createElement("tr");

        let td_contenido = '';
        for(let i = 0; i < Salida.tiempos_tablaTiempos; i++) {
            td_contenido += '<td contenteditable="true"></td>';
        }

        filaPrograma.innerHTML = `
            <td id="nombreProceso${Salida.nombres_tablaProgramas}" contenteditable="true">Nombre random</td>
            <td></td>
            <td contenteditable="true">1</td>
            <td contenteditable="true">1</td>
            <td contenteditable="true">1</td>
        `;

        filaTiempos.innerHTML = `
            <td id="tiempo${Salida.procesos_tablaTiempos}" contenteditable="true">p${Salida.procesos_tablaTiempos}</td>
            ${td_contenido}
        `;

        Salida.nombres_tablaProgramas++;
        Salida.procesos_tablaTiempos++;

        tablaPrograma.appendChild(filaPrograma);
        tablaTiempos.appendChild(filaTiempos);
    }

    agregarTiempo(table_tiemposProcesos) {
        const fila_encabezado   = table_tiemposProcesos.querySelector('thead tr');
        const filas             = table_tiemposProcesos.querySelectorAll('tr');

        Salida.tiempos_tablaTiempos++;

        const columna = document.createElement('th');
        columna.textContent = `T${Salida.tiempos_tablaTiempos}`;
        fila_encabezado.appendChild(columna);

        filas.forEach((fila, i) => {
            if (fila.parentNode.tagName === 'THEAD') { return; }

            const espacio = document.createElement('td');
            espacio.setAttribute('contenteditable', 'true');
            espacio.textContent = '';

            fila.appendChild(espacio);
        });
    }

    agregarParticion(table_particiones) {
        const tablaParticion    = table_particiones.getElementsByTagName('tbody')[0];
        const filaParticion     = document.createElement("tr");

        filaParticion.innerHTML = `
            <td id="particion${Salida.particiones}" contenteditable="true">1</td>
            <td></td>
            <td></td>
            <td contenteditable="true">1</td>
        `;

        tablaParticion.appendChild(filaParticion);
        Salida.particiones++;
    }

    eliminarPrograma(table_programa, table_tiemposProcesos) {
        const filasPrograma     = table_programa.getElementsByTagName('tr');
        const filasTiempo       = table_tiemposProcesos.getElementsByTagName('tr');

        if (filasPrograma.length > 1) { //1 por la cabecera de la tabla
            const ultimaFilaP = filasPrograma[filasPrograma.length - 1];
            ultimaFilaP.remove();

            Salida.nombres_tablaProgramas--;
        }

        if (filasTiempo.length > 1) { //1 por la cabecera de la tabla
            const ultimaFilaT = filasTiempo[filasTiempo.length - 1];
            ultimaFilaT.remove();

            Salida.procesos_tablaTiempos--;
        }
    }

    eliminarParticion(table_particiones) {
        const filaParticion = table_particiones.getElementsByTagName('tr');

        if (filaParticion.length > 1) {
            const ultimaFila = filaParticion[filaParticion.length - 1];
            ultimaFila.remove();
            
            Salida.particiones--;
        }
    }

    eliminarTiempo(table_tiemposProcesos) {
        const fila_encabezado = table_tiemposProcesos.querySelector('thead tr');

        if(fila_encabezado.children.length > 1) {
            const ultima_columna = fila_encabezado.lastElementChild;
            if(ultima_columna.tagName === 'TH') { fila_encabezado.removeChild(ultima_columna); }
            Salida.tiempos_tablaTiempos--;
        }

        const filasTiempos = table_tiemposProcesos.querySelectorAll('tr');

        filasTiempos.forEach((fila) => {
            if(fila.parentNode.tagName === 'THEAD') { return; }

            if(fila.children.length > 1) {
                const ultimo_tiempo = fila.lastElementChild;
                if(ultimo_tiempo.tagName === 'TD') { fila.removeChild(ultimo_tiempo); }
            }
        });
    }

    opcionesEstrategia(sel_estrategiaGestor, sel_opcionesEstrategia) {
        sel_opcionesEstrategia.innerHTML = "";

        switch(sel_estrategiaGestor.value) {
            case 'ETF': break;
            case 'ETV':
                const opcion1 = new Option('Peor ajuste', 'PEA');
                const opcion2 = new Option('Mejor ajuste', 'MEA');
                const opcion3 = new Option('Primer ajuste', 'PRA');

                sel_opcionesEstrategia.add(opcion1);
                sel_opcionesEstrategia.add(opcion2);
                sel_opcionesEstrategia.add(opcion3);
                break;
            case 'DIN': 
                const opcion4 = new Option('Sin compactación', 'SIC');
                const opcion5 = new Option('Con compactación', 'CIC');

                sel_opcionesEstrategia.add(opcion4);
                sel_opcionesEstrategia.add(opcion5);
                break;
            break;
        }
    }

    tablaMemoria(rangosDec, rangosHex, particiones) {
        const tabla     = this._ids[0];

        // Vaciar la tabla (por si ya tiene algo)
        while (tabla.rows.length > 1) {
            tabla.deleteRow(1);
        }

        let salto_marco = 0;
        for (let i = 0; i < particiones.length; i++) {
            const [tam, contenido] = particiones[i];
            const hexInicio = rangosHex[i];
            const decInicio = rangosDec[i];

            let hexFin = (parseInt(rangosHex[i + 1], 16) - 1).toString(16);
            let decFin = rangosDec[i + 1] - 1;

            if((i + 1) === particiones.length) {
                hexFin = rangosHex[i + 1];
                decFin = rangosDec[i + 1];
            }

            let nombreProceso = "";
            if (typeof contenido === 'string') {
                nombreProceso = contenido;
            } else if (contenido && typeof contenido === 'object' && 'pid' in contenido) {
                nombreProceso = `p${contenido.pid}`;

                if(this.v_act_estrategia === 'SEG') 
                { nombreProceso = nombreProceso + ` (${contenido.c_segmento})`}
                if(this.v_act_estrategia === 'PAG' || this.v_act_estrategia === 'SPG') 
                { nombreProceso = nombreProceso + ` (${contenido.c_pagina})`}
            }

            console.log(contenido);

            const fila = tabla.insertRow();
            fila.insertCell().textContent = `${hexInicio} - ${hexFin}`;
            fila.insertCell().textContent = `${decInicio} - ${decFin}`;
            fila.insertCell().textContent = nombreProceso;
            fila.insertCell().textContent = tam;

            if(this.v_act_estrategia === 'PAG') {
                fila.insertCell().textContent = i;
                fila.insertCell().textContent = i.toString(16);
            }

            if(this.v_act_estrategia === 'SPG') {
                if(!contenido) {
                    const t_pagina  = parseInt(tabla.rows[i].cells[3].textContent.trim(), 10);
                    const t_libre   = parseInt(tabla.rows[i+1].cells[3].textContent.trim(), 10);

                    const ca_saltos = Math.ceil(t_libre / t_pagina);
                    salto_marco = salto_marco + ca_saltos - 1;

                    fila.insertCell().textContent = '';
                    fila.insertCell().textContent = '';
                }
                else
                {
                    fila.insertCell().textContent = i + salto_marco;
                    fila.insertCell().textContent = (i + salto_marco).toString(16);
                }

                if(contenido === 'Sistema Operativo')
                { fila.insertCell().textContent = 'Segmento de SO'; }
                else if(contenido)
                { fila.insertCell().textContent = `p${contenido.pid} (seg` + contenido.i_segmento + ')'; }
                else
                { fila.insertCell().textContent = ''; }
            }
        }

        if(this.v_act_estrategia === 'SPG')
        { this.combinarSegmentos(); }
    }

    combinarSegmentos() {
        const i_th_segmento = 6; //El sexto en el <th> del primer <tr> (Segmento) 
        const tabla         = this._ids[0];
        let filas           = Array.from(tabla.rows).slice(1);

        let valorAnterior   = null;
        let celdaPrincipal  = null;
        let co_combinacion  = 1;
        
        for (let i = 0; i < filas.length; i++) {
            const celda = filas[i].cells[i_th_segmento];

            if(celda.textContent === valorAnterior) {
                co_combinacion++;
                celdaPrincipal.rowSpan = co_combinacion;
                celda.remove();
            }
            else
            {
                valorAnterior   = celda.textContent;
                celdaPrincipal  = celda;
                co_combinacion  = 1;
            }
        }
    }

    metricasEspacio(memoriaOcupada, memoriaLibre) {
        const tabla = this._ids[1];

        // Limpiar todas las filas excepto la cabecera
        while (tabla.rows.length > 1) {
            tabla.deleteRow(1);
        }

        // Insertar una nueva fila con los datos
        const fila = tabla.insertRow();
        fila.insertCell().textContent = memoriaOcupada.toLocaleString(); // Ocupado
        fila.insertCell().textContent = memoriaLibre.toLocaleString();   // Libre
    }

    listaProcesos(procesos) {
        const tabla = this._ids[2];

        // Limpiar filas anteriores (sin tocar el thead)
        while (tabla.rows.length > 1) {
            tabla.deleteRow(1);
        }

        console.log(procesos);

        procesos.forEach(p => {
            const fila = tabla.insertRow();
            const memoriaInicial = p.t_proceso - p.c_proceso[p.c_proceso.length - 1] - p.c_proceso[p.c_proceso.length - 2];
            const memoriaKiB = (p.t_proceso / 1024).toFixed(3);

            fila.insertCell().textContent = p.pid;
            fila.insertCell().textContent = memoriaInicial;
            fila.insertCell().textContent = p.t_proceso;
            fila.insertCell().textContent = memoriaKiB;
        });
    }

    calcularGeneralidades(table_generalidades) { 
        for (let i = 1; i < table_generalidades.rows.length; i++) {
            const fila = table_generalidades.rows[i];
            const tdMiB = fila.cells[1];
            const tdKiB = fila.cells[2];
            const tdB   = fila.cells[3];

            const valMiB = parseInt(tdMiB.textContent) || null;
            const valKiB = parseInt(tdKiB.textContent) || null;
            const valB   = parseInt(tdB.textContent) || null;

            if (valMiB !== null) {
                tdKiB.textContent = (valMiB * 1024).toFixed(0);
                tdB.textContent = (valMiB * 1024 * 1024).toFixed(0);
            } else if (valKiB !== null) {
                tdMiB.textContent = (valKiB / 1024).toFixed(3);
                tdB.textContent = (valKiB * 1024).toFixed(0);
            } else if (valB !== null) {
                tdKiB.textContent = (valB / 1024).toFixed(3);
                tdMiB.textContent = (valB / 1024 / 1024).toFixed(6);
            }
        }
    }

    calcular_t_disco(table_programa) { 
        for (let i = 1; i < table_programa.rows.length; i++) {
            const fila              = table_programa.rows[i];
            const tdTamañoDisco     = fila.cells[1];
            const tdCodigo          = parseInt(fila.cells[2].textContent) || 0;
            const tdInicializados   = parseInt(fila.cells[3].textContent) || 0;
            const tdSinInicializar  = parseInt(fila.cells[4].textContent) || 0;

            const total = tdCodigo + tdInicializados + tdSinInicializar;
            tdTamañoDisco.textContent = total;
        }
    }

    calcularParticiones(table_particiones) {
        const filas = table_particiones.querySelectorAll("tbody tr");

        filas.forEach(fila => {
            const tdMiB = fila.cells[0];
            const tdKiB = fila.cells[1];
            const tdB   = fila.cells[2];

            const valorMiB = parseFloat(tdMiB.textContent);
            if (!isNaN(valorMiB)) {
                // Solo llenar si están vacíos
                if (tdKiB.textContent.trim() === "") {
                tdKiB.textContent = valorMiB * 1024;
                }
                if (tdB.textContent.trim() === "") {
                tdB.textContent = valorMiB * 1024 * 1024;
                }
            }
        });
    }

    tablaDescripcion(particiones, direciconesDEC, direccionesHEX, b_proc_unic_activos) {
        const tabla = this._ids[5];

        while (tabla.rows.length > 1) {
            tabla.deleteRow(1);
        }

        for (let i = 0; i < particiones.length; i++) {
            const fila  = tabla.insertRow();
            const proc  = particiones[i][1];
            
            let pid; let lo;
            if(proc === null)                   { pid = 0; lo = 0; }
            else if(typeof proc === "string")   { pid = proc; lo = 1; }
            else                                { pid = 'P' + proc.pid; lo = 1; }

            if(!(b_proc_unic_activos && pid === 0)) {
                fila.insertCell().textContent = pid;
                fila.insertCell().textContent = lo;
                fila.insertCell().textContent = direciconesDEC[i];
                fila.insertCell().textContent = direccionesHEX[i];
            }
        }
    }

    tablaFragmentos(bloques, direccionesDEC, direccionesHEX) {
        const tabla = this._ids[3];

        while (tabla.rows.length > 1) {
            tabla.deleteRow(1);
        }

        for (let i = 0; i < bloques.length; i++) {
            if (bloques[i][1] === null) {
                const fila = tabla.insertRow();
                fila.insertCell().textContent = direccionesDEC[i];
                fila.insertCell().textContent = direccionesHEX[i];
                fila.insertCell().textContent = bloques[i][0];
            }
        }
    }

    tablaSpecSegmentos(segmentos) {
        const tabla         = this._ids[6];
        const et_seleccion  = ['.text', '.data', '.bss'];

        while (tabla.rows.length > 1) {
            tabla.deleteRow(1);
        }
        
        const procesos_spec = segmentos
            .filter(segmento =>
                typeof segmento[1] === 'object' &&
                segmento[1] !== null &&
                et_seleccion.includes(segmento[1].c_segmento) 
            )
            .reduce((acc_segmento, obj_segmento) => {
                const { pid, c_segmento: c_segmento, t_segmento: t_segmento } = obj_segmento[1];

                acc_segmento[pid]                = acc_segmento[pid] || {};
                acc_segmento[pid][c_segmento]    = acc_segmento[pid][c_segmento] || { cantidad: 0, ultimo_t: Infinity };

                acc_segmento[pid][c_segmento].cantidad++;
                acc_segmento[pid][c_segmento].ultimo_t = Math.min(acc_segmento[pid][c_segmento].ultimo_t, t_segmento);

                return acc_segmento;
            }, {});
        
        Object.entries(procesos_spec).forEach(proceso => {
            const fila = tabla.insertRow();
            fila.insertCell().textContent = proceso[0];
            fila.insertCell().textContent = proceso[1]['.text'].cantidad;
            fila.insertCell().textContent = proceso[1]['.text'].ultimo_t;
            fila.insertCell().textContent = proceso[1]['.data'].cantidad;
            fila.insertCell().textContent = proceso[1]['.data'].ultimo_t;
            fila.insertCell().textContent = proceso[1]['.bss'].cantidad;
            fila.insertCell().textContent = proceso[1]['.bss'].ultimo_t;
        });
    }

    tablaSpecSegmentos_SPG(segmentos) {
        const tabla         = this._ids[6];
        const et_seleccion  = ['.text', '.data', '.bss'];

        while (tabla.rows.length > 1) {
            tabla.deleteRow(1);
        }

        const procesos_spec = segmentos
            .filter(segmento =>
                typeof segmento[1] === 'object' &&
                segmento[1] !== null &&
                et_seleccion.includes(segmento[1].c_pagina) 
            )
            .map(([, { pid, i_segmento, c_pagina, t_pa_segmento }]) => [
                pid,
                i_segmento,
                c_pagina,
                t_pa_segmento
            ])
    
        const limpiar_redundancia_seg = datos => {
            const mapa = new Map();

            datos.forEach(([pid, i_segmento, c_pagina, t_pa_segmento]) => {
                const clave = `${pid}-${i_segmento}-${c_pagina}`;

                if (mapa.has(clave)) {
                    const valorExistente = mapa.get(clave);
                    valorExistente[3] += t_pa_segmento;
                } 
                else 
                { mapa.set(clave, [pid, i_segmento, c_pagina, t_pa_segmento]); }
            });

            return Array.from(mapa.values());
        };

        const resumen_segmentos = (arreglo) => {
            const secciones = [".text", ".bss", ".data"];

            const resumen = arreglo.reduce((acc, [pid, , c_pagina, t_pa_segmento]) => {
                if (!acc[pid]) {
                    acc[pid] = { pid };
                    for (const sec of secciones) {
                        acc[pid][sec] = { count: 0, min: Infinity };
                    }
                }

                const entry = acc[pid][c_pagina];
                entry.count += 1;
                entry.min = Math.min(entry.min, t_pa_segmento);

                return acc;
            }, {});

            return Object.values(resumen)
                .sort((a, b) => a.pid - b.pid)
                .map(({ pid, ...rest }) => [
                    pid,
                    ".text", rest[".text"].count, rest[".text"].min,
                    ".data", rest[".data"].count, rest[".data"].min,
                    ".bss", rest[".bss"].count, rest[".bss"].min,
                ]);
        };

        const segmentos_finales = resumen_segmentos(limpiar_redundancia_seg(procesos_spec));
        segmentos_finales.forEach(segmento => {
            const fila = tabla.insertRow();

            fila.insertCell().textContent = segmento[0];
            fila.insertCell().textContent = segmento[2];
            fila.insertCell().textContent = segmento[3];
            fila.insertCell().textContent = segmento[5];
            fila.insertCell().textContent = segmento[6];
            fila.insertCell().textContent = segmento[8];
            fila.insertCell().textContent = segmento[9];
        })
    }

    tablaSpecPaginas(paginas) {
        const tabla         = this._ids[7];
        const et_seleccion  = ['.text', '.data', '.bss'];

        while (tabla.rows.length > 1) {
            tabla.deleteRow(1);
        }

        const procesos_spec = paginas
            .filter(pagina =>
                typeof pagina[1] === 'object' &&
                pagina[1] !== null &&
                et_seleccion.includes(pagina[1].c_pagina)
            )
            .reduce((acc_pagina, obj_pagina) => {
                const { pid, c_pagina: c_pagina } = obj_pagina[1];

                acc_pagina[pid]             = acc_pagina[pid] || {};
                acc_pagina[pid][c_pagina]   = acc_pagina[pid][c_pagina] || { cantidad: 0 };

                acc_pagina[pid][c_pagina].cantidad++;

                return acc_pagina;
            }, {});

        Object.keys(procesos_spec).forEach(pid => {
            et_seleccion.forEach(seg => {
                if (!procesos_spec[pid][seg]) {
                    procesos_spec[pid][seg] = { cantidad: 0 };
                }
            });
        });
        
        Object.entries(procesos_spec).forEach(proceso => {
            const fila = tabla.insertRow();
            fila.insertCell().textContent = proceso[0];
            fila.insertCell().textContent = proceso[1]['.text'].cantidad ?? 0;
            fila.insertCell().textContent = proceso[1]['.data'].cantidad ?? 0;
            fila.insertCell().textContent = proceso[1]['.bss'].cantidad ?? 0;
        });
    }

    opcionesProcesos(procesosActuales) {
        const selector = this._ids[8];
        selector.innerHTML = '';
        
        procesosActuales
            .flatMap(proceso => {
                return 'Proceso ' + proceso['_pid']; 
            })
            .sort((proceso_x, proceso_x_1) => {
                const numX      = parseInt(proceso_x.match(/\d+/)[0]); 
                const numX_1    = parseInt(proceso_x_1.match(/\d+/)[0]); 

                return numX - numX_1;
            })
            .forEach(proceso => {
                const opcion = document.createElement('option');
                opcion.value = proceso.match(/\d+/g);
                opcion.text = proceso;
                
                selector.appendChild(opcion);
            });

        selector.selectedIndex = -1;
    }

    detallesProceso(seleccion, table_segmentos, table_paginas) {
        const v_seleccionado    = parseInt(seleccion.value);
        const et_segmento       = ['.text', '.data', '.bss', '.heap', '.stack'];

        while (table_segmentos.rows.length > 1) {
            table_segmentos.deleteRow(1);
        }

        while (table_paginas.rows.length > 1) {
            table_paginas.deleteRow(1);
        }

        switch(this.v_act_estrategia) {
            case 'SEG':
                this._v_act_memoria
                    .map((segmento, i) => [i, ...segmento]) 
                    .filter(segmento => 
                        typeof segmento[2] === 'object' &&
                        segmento[2] !== null &&
                        segmento[2]['pid'] === v_seleccionado
                    )
                    .sort((segmento_x, segmento_x_1) => {
                        const c_segmento_x      = segmento_x[2].c_segmento;
                        const c_segmento_x_1    = segmento_x_1[2].c_segmento;

                        const i_c_segmento_x    = et_segmento.indexOf(c_segmento_x);
                        const i_c_segmento_x_1  = et_segmento.indexOf(c_segmento_x_1);

                        if(i_c_segmento_x !== i_c_segmento_x_1) { return i_c_segmento_x - i_c_segmento_x_1; }

                        return segmento_x_1[2].t_segmento - segmento_x[2].t_segmento;
                    })
                    .forEach((segmento, i) => {
                        const permisos = i === 0? 'RX' : 'RW';

                        const fila = table_segmentos.insertRow();
                        fila.insertCell().textContent = i;
                        fila.insertCell().textContent = i.toString(16);
                        fila.insertCell().textContent = this._v_act_dirDEC[segmento[0]];
                        fila.insertCell().textContent = this._v_act_dirHEX[segmento[0]];
                        fila.insertCell().textContent = segmento[1];
                        fila.insertCell().textContent = segmento[1].toString(16);
                        fila.insertCell().textContent = permisos;
                        fila.insertCell().textContent = segmento[2].c_segmento;
                    });
                break;
            case 'PAG':
                this._v_act_memoria
                    .map((pagina, i) => [i, ...pagina]) 
                    .filter(pagina => 
                        typeof pagina[2] === 'object' &&
                        pagina[2] !== null &&
                        pagina[2]['pid'] === v_seleccionado
                    )
                    .sort((pagina_x, pagina_x_1) => {
                        const c_pagina_x      = pagina_x[2].c_pagina;
                        const c_pagina_x_1    = pagina_x_1[2].c_pagina;

                        const i_c_pagina_x    = et_segmento.indexOf(c_pagina_x);
                        const i_c_pagina_x_1  = et_segmento.indexOf(c_pagina_x_1);

                        if(i_c_pagina_x !== i_c_pagina_x_1) { return i_c_pagina_x - i_c_pagina_x_1; }

                        return pagina_x_1[2].t_pagina - pagina_x[2].t_pagina;
                    })
                    .forEach((pagina, i) => {
                        const fila = table_paginas.insertRow();
                        fila.insertCell().textContent = i;
                        fila.insertCell().textContent = i.toString(16);
                        fila.insertCell().textContent = pagina[0];
                        fila.insertCell().textContent = pagina[0].toString(16);
                        fila.insertCell().textContent = 'Presente';
                        fila.insertCell().textContent = pagina[2].c_pagina;
                    });
                break;
            case 'SPG':
                this.detallesProcesoSPG(v_seleccionado, table_segmentos);
                break;
            default: break;
        }
    }

    detallesProcesoSPG(v_seleccionado, table_segmentos) {
        const selector = this._ids[9];
        selector.innerHTML = '';

        //Obtención de segmentos
        const proc_segmentos = Object.values(
            this._v_act_memoria
            .map((segmento, i) => [i, ...segmento]) 
            .filter(segmento => 
                typeof segmento[2] === 'object' &&
                segmento[2] !== null &&
                segmento[2]['pid'] === v_seleccionado
            )
            .reduce((acc, [indice, _, meta]) => {
                const { i_segmento, t_pa_segmento, c_pagina } = meta;

                acc[i_segmento] = acc[i_segmento]
                ? 
                {
                    indice: Math.max(indice, acc[i_segmento].indice),
                    i_segmento,
                    t_pa_segmento: acc[i_segmento].t_pa_segmento + t_pa_segmento,
                    c_pagina
                }
                : 
                { indice, i_segmento, t_pa_segmento, c_pagina };

                return acc;
            }, {})
        )
        .map(({ indice, i_segmento, t_pa_segmento, c_pagina }) => [indice, i_segmento, t_pa_segmento, c_pagina]);

        //Selección de segmentos
        proc_segmentos.forEach(segmento => {
            const opcion = document.createElement('option');
            opcion.value = segmento[1];
            opcion.text = 'Segmento ' + segmento[1];
                
            selector.appendChild(opcion);
        });

        //Tabla de segmentos
        proc_segmentos.forEach((segmento, i) => {
            const permisos = i === 0? 'RX' : 'RW';

            const fila = table_segmentos.insertRow();
            fila.insertCell().textContent = segmento[1];
            fila.insertCell().textContent = segmento[1].toString(16);
            fila.insertCell().textContent = this._v_act_dirDEC[segmento[0]];
            fila.insertCell().textContent = this._v_act_dirHEX[segmento[0]];
            fila.insertCell().textContent = segmento[2];
            fila.insertCell().textContent = segmento[2].toString(16);
            fila.insertCell().textContent = permisos;
            fila.insertCell().textContent = segmento[3];
        });
        
        selector.selectedIndex = -1;
    }

    detallesSegmento(sel_proceso, sel_segmento, table_paginas) {
        const v_seleccionado_proc   = parseInt(sel_proceso.value);
        const v_seleccionado_seg    = parseInt(sel_segmento.value);
        let co_saltos               = 0;

        while (table_paginas.rows.length > 1) {
            table_paginas.deleteRow(1);
        }

        const espacios_intermedios = 
            this._v_act_memoria[this._v_act_memoria.length - 1][1] === null ? 
                this._v_act_memoria.slice(0, -1) : 
                this._v_act_memoria;
        
        const huecos_libres = espacios_intermedios
            .map((segmento, i) => [i, ...segmento]) 
            .filter(segmento => segmento[2] === null) ?? null;

        let t_pagina;
        if(huecos_libres.length > 0) 
        { t_pagina = this._v_act_memoria[huecos_libres[0][0] - 1][0]; }
        else
        { t_pagina = this._v_act_memoria[this._v_act_memoria.length - 1][0]; }

        const saltos_marco = huecos_libres.map(([marco, t_espacioLibre]) => {
            const v_prev_marco  = Math.ceil(t_espacioLibre / t_pagina) - 1;
            const v_final_marco = v_prev_marco + co_saltos;
            co_saltos = v_final_marco;

            return [marco, v_final_marco];
        });

        const paginas_seg = this._v_act_memoria
            .map((segmento, i) => [i, ...segmento]) 
            .filter(segmento => 
                typeof segmento[2] === 'object' &&
                segmento[2] !== null &&
                segmento[2]['pid'] === v_seleccionado_proc &&
                segmento[2]['i_segmento'] === v_seleccionado_seg
            )

        paginas_seg.forEach((pagina, i) => {
            const fila = table_paginas.insertRow();

            const candidatos_salto = saltos_marco.filter(([marco]) => marco <= pagina[0]) ?? null;
            const salto_marco = candidatos_salto.length > 0
                ? candidatos_salto.reduce((acc, curr) => curr[0] > acc[0] ? curr : acc)[1]
                : 0;

            fila.insertCell().textContent = i;
            fila.insertCell().textContent = i.toString(16);
            fila.insertCell().textContent = pagina[0] + salto_marco;
            fila.insertCell().textContent = (pagina[0] + salto_marco).toString(16);
            fila.insertCell().textContent = 'Presente';
            fila.insertCell().textContent = pagina[2].c_pagina;
        })
    }

    interfazWeb(message) {
        const output = this._ids[4];
        const line = document.createElement("p");
        line.className = "line";

        let formattedMessage;

        if (typeof message === "string") {
            formattedMessage = message;
        } else if (message instanceof Set) {
            formattedMessage = `Set(${message.size}) { ${Array.from(message).join(", ")} }`;
        } else if (Array.isArray(message)) {
            formattedMessage = `[${message.join(", ")}]`;
        } else if (typeof message === "object") {
            formattedMessage = JSON.stringify(message, null, 2);
        } else {
            formattedMessage = String(message);
        }

        line.textContent = "> " + formattedMessage;
        output.appendChild(line);
        output.scrollTop = output.scrollHeight;
    };

    get_estado_anterior() {
        return this.estado_anterior.map(fila => [...fila]);
    }

    set_estado_anterior(estado_anterior) {
        this.estado_anterior = estado_anterior;
    }

    get ids()               { return this._ids; }

    set v_act_memoria(v_act_memoria)        { this._v_act_memoria = v_act_memoria; }
    set v_act_dirDEC(v_act_dirDEC)          { this._v_act_dirDEC = v_act_dirDEC; }
    set v_act_dirHEX(v_act_dirHEX)          { this._v_act_dirHEX = v_act_dirHEX; }
}