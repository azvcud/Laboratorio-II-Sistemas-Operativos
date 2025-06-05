export class Salida {
    static nombres_tablaProgramas = 9;
    static procesos_tablaTiempos  = 9;
    static tiempos_tablaTiempos   = 6;
    static particiones            = 1;

    constructor(ids) {
        this.ids = ids;
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
        const tabla = this.ids[0];

        // Vaciar la tabla (por si ya tiene algo)
        while (tabla.rows.length > 1) {
            tabla.deleteRow(1);
        }

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
            }

            const fila = tabla.insertRow();
            fila.insertCell().textContent = `${hexInicio} - ${hexFin}`;
            fila.insertCell().textContent = `${decInicio} - ${decFin}`;
            fila.insertCell().textContent = nombreProceso;
            fila.insertCell().textContent = tam;
        }
    }

    metricasEspacio(memoriaOcupada, memoriaLibre) {
        const tabla = this.ids[1];

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
        const tabla = this.ids[2];

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

            const valMiB = parseFloat(tdMiB.textContent) || null;
            const valKiB = parseFloat(tdKiB.textContent) || null;
            const valB   = parseFloat(tdB.textContent) || null;

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
            const fila = table_programa.rows[i];
            const tdTamañoDisco = fila.cells[1];
            const tdCodigo = parseInt(fila.cells[2].textContent) || 0;
            const tdInicializados = parseInt(fila.cells[3].textContent) || 0;
            const tdSinInicializar = parseInt(fila.cells[4].textContent) || 0;

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

    tablaFragmentos(bloques, direccionesDEC, direccionesHEX) {
        const tabla = this.ids[3];

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

    interfazWeb(message) {
        const output = this.ids[4];
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
}