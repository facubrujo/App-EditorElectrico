import { canvas } from './app.js';

//botones
const cubierta = document.getElementById("vAcometida");
//const sla = document.getElementById("sla");

// inputs 
const supX = document.getElementById("supX");
const supY = document.getElementById("supY");
const supSemiX = document.getElementById("semiX");
const supSemiY = document.getElementById("semiY");

// variables de DOM
const resultado = document.getElementById("resultado");


let cubierto = 0;
let semicubierto = 0;

const listaAmbientes = [];

function calcularGE(sla) {
  if (sla <= 30) return "Mínimo";
  if (sla <= 130) return "Medio";
  if (sla <= 200) return "Elevado";
  return "Superior";
}


const panelTotal = document.getElementById("panelTotal");
const panelAmbientes = document.getElementById("panelAmbientes");

document.getElementById("modoAmbientes").addEventListener("click", () => {
  panelAmbientes.classList.toggle("d-none");
  //panelTotal.classList.add("d-none");
});

// ================= AMBIENTES =================
document.getElementById("btnAmbiente").addEventListener("click", function () {

  const i = panelAmbientes.querySelectorAll("input, select");

  let area = Number(i[1].value) * Number(i[2].value);

  let m2 = Number(i[3].value);

  console.log("m2 - " + m2);
  console.log("area - " + area);
  if (m2 > 0 && area === 0) {
    area = m2;
  };

  if (i[4].value === "semi" ) semicubierto += area;
  else cubierto += area;

  const nuevoAmbiente = {
    nombre: i[0].value,
    area: area,
    m2: m2,
    tipo: i[4].value
  };

  listaAmbientes.push(nuevoAmbiente);
  // actualizar();

  calcularTotales();

  const row = `   <tr>
                    <td>${i[0].value}</td>
                    <td>${area}</td>
                   
                    <td>${i[4].value}</td>
                    </tr>`;

  document.getElementById("tablaAmbientes").innerHTML += row;

  limpiarInput(i);

});

function limpiarInput(i) {
  i.forEach(elemento => {
    // Verificamos si es un select para volverlo a la primera opción
    if (elemento.tagName === "SELECT") {
      elemento.selectedIndex = 0;
    } else {
      // Si es un input (text o number), lo vaciamos
      elemento.value = "";
    }
  });
};

let sla = 0;

function calcularTotales() {
  let sumaCubierto = 0;
  let sumaSemicubierto = 0;
  let sumaM2 = 0;

  // Recorremos el ARRAY que contiene todos los objetos "nuevoAmbiente"
  for (const ambiente of listaAmbientes) {
    if (ambiente.tipo === "cubierto") {
      sumaCubierto += ambiente.area;
    } else if (ambiente.tipo === "semi" || ambiente.tipo === "semicubierto") {
      sumaSemicubierto += ambiente.area;
    }
  }

  // Aplicamos la regla: dividir el semicubierto por 2
  const semiFinal = sumaSemicubierto / 2;

  // Sumamos ambos m2 para obtener el gran total
  sla = sumaCubierto + semiFinal;

  // Mostramos los resultados en la consola
  console.log("Total Cubierto:", sumaCubierto);
  console.log("Total Semicubierto (ya dividido por 2):", semiFinal);
  console.log("Gran Total M2:", sla);
  console.log("GE:", calcularGE(sla));
  console.log("SUMA M2 :", sumaM2);

  resultado.innerText = `SLA = ${sla}  .  Grado de Electrificacion : ${calcularGE(sla)}  `;

  // Retornamos los valores por si los necesitas en otra función
  return { sumaCubierto, semiFinal, sla };
}

// Calculo de bocas IUG



function calcularBocas() {
  const objs = canvas.getObjects();
  let cActivo = circuitoActivo;

  let listaCircuitosExistentes = listaDeCircuitos.forEach(c => {
    console.log(`Lista de circuitos | Nombre: ${c.nombre} | `);
  });

  let listaObjetosCanvas = objs.forEach(objeto => {
    console.log(`Objeto Canvas | Nombre: ${objeto.nombre} | TIPO ${objeto.circ}`);
  });

  if (cActivo === "IUG") {
    let bocas = 0;
    let dpmsIUG = 0;
    let ibIUG = 0;
    objs.forEach(objeto => {
      if(objeto.circ === "IUG"){
        bocas++;
      };
      
    }); 

    dpmsIUG = calcularIUG(bocas);
    ibIUG = calcularIb(dpmsIUG);
    
    document.getElementById("cantidadBocasIUG").textContent = ` ${bocas}`;
    document.getElementById("dpmsIUG").textContent = ` ${dpmsIUG} VA `;
    document.getElementById("ibIUG").textContent = ` ${ibIUG.toFixed(2)} A `;


    console.log(`---- LA CANTIDAD DE BOCAS IUG ES DE =  ${bocas}`);
    console.log(`---- LA DPMS DE IUG ES DE =  ${dpmsIUG}`);
    console.log(`---- LA Ib DE IUG ES DE =  ${ibIUG}`);
    console.log();
    console.log();
  };

  if (cActivo === "TUG") {
    let bocas = 0;
    //let dpmsIUG = 0;
    //let ibIUG = 0;
    objs.forEach(objeto => {
      if(objeto.circ === "TUG"){
        bocas++;
      };     
    }); 
    
    document.getElementById("cantidadBocasTUG").textContent = ` ${bocas}`;

  };

};


// Nos quedamos esperando a que el archivo 1 avise que cambió el conteo
document.addEventListener("cambioBocas", (e) => {
  // El número de bocas llega guardado en e.detail
  const cantidadBocas = e.detail;

  const resultadoMatematico = calcularIUG(cantidadBocas);
  const corrienteIb = calcularIb(resultadoMatematico);

  calcularBocas();
  //document.getElementById("corrienteCalculada").textContent = ` ${corrienteIb} A`;

  console.log("Matemática actualizada en archivo2 con bocas:", cantidadBocas);
});

function calcularIUG(bocas) {
  let totalBocas = bocas * 60;
//  console.log("total VA * c/bocas " + totalBocas);
  let dpmsBocas = totalBocas * 2 / 3;
//  console.log("DPMS de bocas " + dpmsBocas);
  return dpmsBocas;
};

function calcularIb(dpmsBocas) {
  let tensionLinea = 220;
  let resultado = dpmsBocas / tensionLinea;
  return resultado;
};

/////// CREAR CIRCUITOS TABLA HTML

export let listaDeCircuitos = [];

export let circuitoActivo = "";

document.getElementById('btnCrear').addEventListener('click', () => {
  const tipoSeleccionado = document.getElementById('selectorCircuitos').value;
  if (!tipoSeleccionado) return alert("Por favor, seleccione un tipo.");

  const cantidadDelMismoTipo = listaDeCircuitos.filter(c => c.tipo === tipoSeleccionado).length;
  const nombreFinal = cantidadDelMismoTipo === 0 ? tipoSeleccionado : `${tipoSeleccionado}${cantidadDelMismoTipo}`;

  let nuevoCircuito = {};



  if (tipoSeleccionado === "IUG") {
    nuevoCircuito = {
      nombre: nombreFinal,
      tipo: "IUG",
      cantidadBocas: 15,
      dpms: 1500,
      ib: 6.81,
      seccionLN: 1.5,
      seccionPE: 2.5,
      iz: 15,
      in: 10
    };
  } else if (tipoSeleccionado === "TUG") {
    nuevoCircuito = {
      nombre: nombreFinal,
      tipo: "TUG",
      cantidadBocas: 12,
      dpms: 2200,
      ib: 10.0,
      seccionLN: 2.5,
      seccionPE: 2.5,
      iz: 21,
      in: 16
    };
  } else if (tipoSeleccionado === "ACU") {
    nuevoCircuito = {
      nombre: nombreFinal,
      tipo: "ACU",
      cantidadBocas: 1,
      dpms: 3300,
      ib: 15.0,
      seccionLN: 4.0,
      seccionPE: 2.5,
      iz: 28,
      in: 20
    };
    // SECCIONAL PONER LAS OPERACIONES -------------------
  } else if (tipoSeleccionado === "SECCIONAL") {
    nuevoCircuito = {
      nombre: nombreFinal,
      tipo: "SEC",
      cantidadBocas: 1,
      dpms: 3300,
      ib: 15.0,
      seccionLN: 4.0,
      seccionPE: 2.5,
      iz: 28,
      in: 20
    };
  }

  listaDeCircuitos.push(nuevoCircuito);

  circuitoActivo = nuevoCircuito.nombre;

  // Inyectamos la tarjeta en pantalla
  crearTarjetaBootstrap(nuevoCircuito);
  //////////////////////////////////////
  listaDeCircuitos.forEach(circuito => {
    console.log(`| Nombre: ${circuito.nombre} | TIPO ${circuito.tipo} | ACTIVO ${circuitoActivo}| CANTIDAD ${circuito.cantidadBocas}`);
  });

  //botonesCircuitos(listaDeCircuitos);
  // Actualizás la bandera global con el último creado
  actualizarCircuitoActivo(circuitoActivo);

  // Renderizás los botones en pantalla
  renderizarBotones();

});

// 2. FUNCIÓN PARA GENERAR EL MÓDULO CON CLASES DE BOOTSTRAP
function crearTarjetaBootstrap(circuito) {
  const contenedor = document.getElementById('contenedorModulos');

  // Creamos el div de la tarjeta con clases nativas de Bootstrap
  const tarjeta = document.createElement('div');
  // 'flex-shrink-0' es clave para que las tarjetas no se aplasten si agregás muchas
  tarjeta.className = 'card border-primary flex-shrink-0';
  tarjeta.id = `card-${circuito.nombre}`;
  tarjeta.style.width = '160px';

  // Estructura interna idéntica a la columna de propiedades para que queden alineadas perfectamente
  tarjeta.innerHTML = `
                <div class="card-header bg-primary text-white fw-bold text-center">${circuito.nombre}</div>
                <ul class="list-group list-group-flush text-center text-dark">
                    <li class="list-group-item py-2">${circuito.tipo}</li>
                    <li class="list-group-item py-2">${circuito.tipo}</li>
                    <li class="list-group-item py-2" id="cantidadBocas${circuito.nombre}">${circuito.cantidadBocas}</li>
                    <li class="list-group-item py-2 fw-semibold" id="dpms${circuito.nombre}">${circuito.dpms} W</li>
                    <li class="list-group-item py-2" id="ib${circuito.nombre}">${circuito.ib} A</li>
                    <li class="list-group-item py-2" id="seccion${circuito.nombre}">${circuito.seccionLN} mm²</li>
                    <li class="list-group-item py-2" id="pe${circuito.nombre}">${circuito.seccionPE} mm²</li>
                    <li class="list-group-item py-2 text-success fw-medium" id="iz${circuito.nombre}">${circuito.iz} A</li>
                    <li class="list-group-item py-2 text-danger fw-medium" id="in${circuito.nombre}">${circuito.in} A</li>
                </ul>
            `;

  // Añadimos la nueva tarjeta al contenedor
  contenedor.appendChild(tarjeta);
}


function renderizarBotones() {
  const contenedor = document.getElementById("contenedorBotones");

  // Limpiamos el contenedor para que no se dupliquen los anteriores al revivir la lista
  contenedor.innerHTML = "";

  // Recorremos la lista y creamos un botón por cada circuito existente
  listaDeCircuitos.forEach(circuito => {
    const boton = document.createElement("button");
    boton.textContent = circuito.nombre;
    boton.className = 'tool-btn';

    // Estilos básicos por código (podes usar clases de CSS si preferís)
    boton.style.padding = "10px 15px";
    boton.style.cursor = "pointer";

    // Resaltamos visualmente cuál es el activo en este momento
    if (circuito.nombre === circuitoActivo) {
      boton.style.backgroundColor = "#4CAF50"; // Verde para el activo
      boton.style.color = "white";
    }

    // EL SECRETO: Le asignamos la función de reactivación al hacer click
    boton.addEventListener("click", () => {
      actualizarCircuitoActivo(circuito.nombre);
      renderizarBotones(); // Volvemos a renderizar para actualizar el color del botón activo
    });

    // Metemos el botón recién creado adentro de nuestro contenedor
    contenedor.appendChild(boton);
  });
}

// 4. Función auxiliar para centralizar el cambio de bandera global
function actualizarCircuitoActivo(nuevoActivo) {
  circuitoActivo = nuevoActivo;
  document.getElementById("circuitoActivo").textContent = ` ${circuitoActivo} VA`;
  // Esto es solo un visor en pantalla para que compruebes que la variable cambia de verdad
  //document.getElementById("visorActivo").textContent = circuitoActivo;
  console.log("Variable global 'circuitoActivo' cambiada a:", circuitoActivo);
  console.log("Variable global 'circuitoActivo' cambiada a:", circuitoActivo);

}


document.getElementById('btnEliminarActivo').addEventListener('click', () => {
  // 1. Verificación: Si no hay un circuito activo, no hacemos nada
  if (!circuitoActivo) {
    return alert("No hay ningún circuito activo seleccionado para eliminar.");
  }

  // 2. Confirmación opcional para evitar accidentes
  if (!confirm(`¿Estás seguro de que deseas eliminar el circuito activo: ${circuitoActivo}?`)) {
    return;
  }

  // 3. Eliminar la tarjeta del HTML usando su ID único
  // (Asegurate de que en crearTarjetaBootstrap() le pongas este id al contenedor de la tarjeta)
  const tarjetaHtml = document.getElementById(`card-${circuitoActivo}`);
  if (tarjetaHtml) {
    tarjetaHtml.remove();
  } else {
    console.warn(`No se encontró en el HTML la tarjeta con ID: card-${circuitoActivo}`);
  }

  // 4. Eliminar el objeto correspondiente dentro del arreglo de JavaScript
  listaDeCircuitos = listaDeCircuitos.filter(c => c.nombre !== circuitoActivo);

  // 5. Reasignar el nuevo circuitoActivo bandera
  if (listaDeCircuitos.length > 0) {
    // Si quedan circuitos, el activo pasa a ser el último de la lista
    const ultimoCircuito = listaDeCircuitos[listaDeCircuitos.length - 1];
    actualizarCircuitoActivo(ultimoCircuito.nombre);
  } else {
    // Si no quedó ninguno, volvemos el estado a vacío
    actualizarCircuitoActivo(null);
  }

  // 6. Refrescar los botones en pantalla para que desaparezca el botón del circuito borrado
  renderizarBotones();

  // Opcional: Ejecutar tu función de actualizar contadores si es necesario
  if (typeof actualizarContadores === "function") {
    actualizarContadores();
  }

  alert("Circuito eliminado correctamente.");
});



/*
COSAS QUE HAY QUE AGREGAR

- un sistema de circuitos- debe elegir el circuito a poner (generales, especiales y uso especifico)
- TENSION DE ACOMETIDA - con limite < a 7000W o 7KW monofasico || > a 7KW trifasica
   Tension Nominal se colocara automaticamente si supera los 7kw
   poder elegir la tension en caso que se desee cambiar
- conductores (seccion de conductor y Corriente maxima admisible, y normativa AEA)
- Protecciones PIA y ID

- AGREGAR DMPS GENERAL DE TODA LA ISNTALACION AL CUADRO
-

*/


document.getElementById('btnExportarPDF').addEventListener('click', async () => {
    
    // Cambiar el texto del botón para dar feedback al usuario
    const boton = document.getElementById('btnExportarPDF');
    const textoOriginal = boton.innerText;
    boton.innerText = "⏳ Generando Imagen...";
    boton.disabled = true;

    try {
        // 1. Limpieza de selección en el canvas (Fabric.js)
        canvas.discardActiveObject();
        canvas.requestRenderAll();

        // Pequeño delay de 100ms para asegurar que Fabric renderizó sin las cajas de selección
        await new Promise(resolve => setTimeout(resolve, 100));

        // 2. Generar el enlace de datos de la imagen en formato JPEG
        // multiplier: 2 duplica la resolución para excelente calidad de impresión/zoom
        const dataUrl = canvas.toDataURL({
            format: 'jpeg',
            quality: 1.0,      // Máxima calidad de compresión (0.0 a 1.0)
            multiplier: 2      // Escalado de alta definición. Si querés más calidad, subilo a 3
        });

        // 3. Forzar la descarga automática del archivo JPG en el navegador
        const enlaceDescarga = document.createElement('a');
        enlaceDescarga.href = dataUrl;
        enlaceDescarga.download = 'plano-electrico-aea.jpg'; // Nombre del archivo
        
        // Ejecutar el clic virtual para iniciar la descarga
        document.body.appendChild(enlaceDescarga);
        enlaceDescarga.click();
        document.body.removeChild(enlaceDescarga);

    } catch (error) {
        console.error("Error al exportar la imagen:", error);
        alert("Hubo un problema al generar la imagen del plano.");
    } finally {
        // Reestablecer el botón siempre
        boton.innerText = textoOriginal;
        boton.disabled = false;
    }
});

