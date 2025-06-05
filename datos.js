const datosTablas = [
  {
    id: 'tabla1',
    titulo: 'Tabla de Procesos',
    columnas: [
      'ID', 'Nombre', 'Tamaño en disco', 'Tamaño código',
      'Tamaño datos inicializados', 'Tamaño datos sin inicializar',
      'Memoria inicial', 'Memoria a usar', 'Memoria a usar en KiB'
    ],
    filas: [
      [1, 'Proceso A', '1024B', '256B', '128B', '64B', '0x0000', '1024B', '1 KiB'],
      [2, 'Proceso B', '2048B', '512B', '256B', '128B', '0x0100', '2048B', '2 KiB'],
      [3, 'Proceso C', '3072B', '768B', '384B', '192B', '0x0200', '3072B', '3 KiB']
    ]
  },
  {
    id: 'tabla2',
    titulo: 'Tabla de Particiones',
    columnas: ['PID', 'L/O', 'Base Decimal', 'Base Hexadecimal'],
    filas: [
      [101, 'L', '256', '0x0100'],
      [102, 'O', '512', '0x0200'],
      [103, 'L', '768', '0x0300']
    ]
  },
  {
    id: 'tabla3',
    titulo: 'Tabla de Memoria',
    columnas: ['Hexadecimal', 'Decimal', 'Proceso', 'Capacidad'],
    filas: Array.from({ length: 16 }, (_, i) => {
      const hex = `0x${(i * 16).toString(16).padStart(4, '0')}`;
      const dec = i * 16;
      const proceso = i % 3 === 0 ? 'Proceso A' : (i % 3 === 1 ? 'Proceso B' : 'Libre');
      const capacidad = '16B';
      return [hex, dec, proceso, capacidad];
    })
  },
  {
    id: 'tabla4',
    titulo: 'Procesos en el Tiempo',
    columnas: ['ID Proceso', 'Tiempo de Activación'],
    filas: [
      [1, '0 - 4'],
      [2, '4 - 10'],
      [3, '10 - 14']
    ]
  },
  {
    id: 'tabla5',
    titulo: 'Estado de la Memoria',
    columnas: ['Estado', 'Memoria (KiB)'],
    filas: [
      ['Libre', '5 KiB'],
      ['Llena', '11 KiB']
    ]
  }
];

function obtenerClaseEstado(valor) {
  const v = valor.toString().toLowerCase();
  if (v.includes('libre')) return 'estado-libre';
  if (v.includes('llena')) return 'estado-llena';
  return '';
}

function crearTabla(id, titulo, columnas, filas) {
  const contenedor = document.getElementById(id);
  const tabla = document.createElement('table');

  const thead = document.createElement('thead');
  const filaTitulo = document.createElement('tr');
  const th = document.createElement('th');
  th.colSpan = columnas.length;
  th.textContent = titulo;
  filaTitulo.appendChild(th);
  thead.appendChild(filaTitulo);

  const encabezados = document.createElement('tr');
  columnas.forEach(col => {
    const th = document.createElement('th');
    th.textContent = col;
    encabezados.appendChild(th);
  });
  thead.appendChild(encabezados);
  tabla.appendChild(thead);

  const tbody = document.createElement('tbody');
  filas.forEach(fila => {
    const tr = document.createElement('tr');
    fila.forEach(dato => {
      const td = document.createElement('td');
      td.textContent = dato;

      const clase = obtenerClaseEstado(dato);
      if (clase) td.classList.add(clase);

      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });

  tabla.appendChild(tbody);
  contenedor.appendChild(tabla);
}

datosTablas.forEach(tabla => {
  crearTabla(tabla.id, tabla.titulo, tabla.columnas, tabla.filas);
});

function crearTablaProcesosTiempo(data) {
  let html = `<table class="procesos-tiempo-table"><tr><th>ID proceso</th>`;

  // Encabezado de tiempo
  for (let t of data.tiempos) {
    html += `<th>${t}</th>`;
  }
  html += `</tr>`;

  // Filas por proceso
  for (let proceso of data.procesos) {
    html += `<tr><th>${proceso.id}</th>`;
    for (let celda of proceso.estado) {
      if (celda) {
        let clase = celda.color === "verde" ? "estado-verde" : "estado-rojo";
        html += `<td class="${clase}">${celda.texto}</td>`;
      } else {
        html += `<td></td>`;
      }
    }
    html += `</tr>`;
  }

  // Fila final de tiempos
  html += `<tr><th>Tiempo</th>`;
  for (let t of data.tiempos) {
    html += `<th>${t}</th>`;
  }
  html += `</tr></table>`;

  document.getElementById("tabla4").innerHTML = html;
}

// Datos de ejemplo
const procesosTiempo = {
  tiempos: ["t1", "t2", "t3", "t4", "t5", "t6"],
  procesos: [
    { id: "p1", estado: [null, null, null, null, { texto: "x2", color: "verde" }, null] },
    { id: "p2", estado: [null, null, null, { texto: "x2", color: "verde" }, null, { texto: "x3", color: "verde" }] },
    { id: "p3", estado: [null, { texto: "x2", color: "verde" }, null, null, { texto: "x4", color: "verde" }, { texto: "x5", color: "verde" }] },
    { id: "p4", estado: [{ texto: "x1", color: "verde" }, { texto: "x", color: "verde" }, null, { texto: "x1", color: "verde" }, null, { texto: "x5", color: "verde" }] },
    { id: "p5", estado: [null, null, { texto: "x1", color: "verde" }, { texto: "x", color: "verde" }, null, { texto: "x4", color: "verde" }] },
    { id: "p6", estado: [null, null, null, { texto: "x3", color: "rojo" }, { texto: "x1", color: "rojo" }, { texto: "x1", color: "rojo" }] },
    { id: "p7", estado: [null, { texto: "x1", color: "rojo" }, null, null, { texto: "x2", color: "rojo" }, null] },
    { id: "p8", estado: [{ texto: "x2", color: "rojo" }, { texto: "x1", color: "rojo" }, null, { texto: "x4", color: "rojo" }, { texto: "x3", color: "rojo" }, null] }
  ]
};

crearTablaProcesosTiempo(procesosTiempo);
