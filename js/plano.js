// Objeto para llevar el conteo de cuántos circuitos se van creando por tipo
const contadoresCircuitos = {
  IUG: 0,
  TUG: 0,
  ACU: 0
};

// Guardamos un registro de las columnas dinámicas creadas para poder renombrarlas si es necesario
const columnasCreadas = [];

document.getElementById('btnAgregar').addEventListener('click', () => {
  const tipo = document.getElementById('tipoCircuito').value;

  // Incrementar el contador del tipo seleccionado
  contadoresCircuitos[tipo]++;

  // Registrar la nueva columna
  columnasCreadas.push({ tipo: tipo });

  // Actualizar los nombres de las cabeceras por si hace falta numerar (ej. TUG 1, TUG 2)
  actualizarNombresCabeceras();

  // Inicializar los tooltips de Bootstrap por si se renderizan nuevas filas (opcional)
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
});

function actualizarNombresCabeceras() {
  // 1. Limpiar todas las celdas dinámicas existentes para regenerarlas limpias
  // Conservamos solo el primer th (CIRCUITOS) y el último th (SECCIONAL)
  const filaCabecera = document.getElementById('filaCabecera');
  while (filaCabecera.children.length > 2) {
    filaCabecera.removeChild(filaCabecera.children[1]);
  }

  // Limpiar también las celdas de datos en el tbody (dejando solo la primera y la última de cada fila)
  const filasBody = document.querySelectorAll('#tablaCircuitos tbody tr');
  filasBody.forEach(fila => {
    while (fila.children.length > 2) {
      fila.removeChild(fila.children[1]);
    }
  });

  // Contadores temporales para saber qué número asignarle en el loop
  const contadoresActuales = { IUG: 0, TUG: 0, ACU: 0 };

  // 2. Insertar las columnas una por una basándonos en nuestro registro
  columnasCreadas.forEach((columna) => {
    contadoresActuales[columna.tipo]++;

    let nombreCabecera = columna.tipo;
    const totalDeEsteTipo = contadoresCircuitos[columna.tipo];

    // Regla: Si hay más de 1 circuito de este tipo, les ponemos número (IUG 1, IUG 2...)
    if (totalDeEsteTipo > 1) {
      nombreCabecera = `${columna.tipo} ${contadoresActuales[columna.tipo]}`;
    }

    // --- Insertar en la Cabecera ---
    const nuevoTh = document.createElement('th');
    nuevoTh.scope = 'col';
    nuevoTh.innerText = nombreCabecera;
    // Lo insertamos justo antes del último elemento (SECCIONAL)
    filaCabecera.insertBefore(nuevoTh, filaCabecera.lastElementChild);

    // --- Insertar en las Filas de Datos ---
    filasBody.forEach(fila => {
      const nuevoTd = document.createElement('td');

      // Creamos un input para que el usuario pueda escribir sus datos
      const input = document.createElement('input');
      input.type = 'number';
      input.className = 'form-control form-control-sm';
      input.placeholder = '...';

      // Si es la fila de tensión, le podemos poner 220 por defecto
      if (fila.id === 'filaTension') {
        input.value = '220';
      }

      // Si es la fila de Ib, la dejamos de solo lectura (para calcularla después por código)
      if (fila.id === 'filaIb') {
        input.readOnly = true;
        input.placeholder = 'Calc...';
      }

      nuevoTd.appendChild(input);
      // Insertamos antes de la celda de SECCIONAL
      fila.insertBefore(nuevoTd, fila.lastElementChild);
    });
  });
}