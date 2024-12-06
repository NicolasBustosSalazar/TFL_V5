// Función para deshabilitar los botones al cargar la página
document.addEventListener("DOMContentLoaded", function () {
  const btnBinary = document.getElementById("btnBinary");
  const btnPSK = document.getElementById("btnPSK");
  const btn4PSK = document.getElementById("btn4PSK");
  const btn8PSK = document.getElementById("btn8PSK");

  // Deshabilitar los botones
  disableButtons([btnBinary, btnPSK, btn4PSK, btn8PSK]);
});

document.getElementById("inputTexto").addEventListener("input", function () {
  const inputText = this.value; // Captura el texto ingresado
  const btnBinary = document.getElementById("btnBinary");
  const btnPSK = document.getElementById("btnPSK");
  const btn4PSK = document.getElementById("btn4PSK");
  const btn8PSK = document.getElementById("btn8PSK");
  const message = document.getElementById("message") || createMessageElement();
  const chartWrapper = document.getElementById("ChartWrapper");

  // Resetear mensaje
  message.textContent = "";

  // Lógica para habilitar o deshabilitar botones según la longitud del texto
  if (inputText.length === 0) {
    disableButtons([btnBinary, btnPSK, btn4PSK, btn8PSK]);
    chartWrapper.classList.add("hidden");
    const p = document.getElementById("characteristics");
    p.textContent = "";
  } else if (inputText.length === 1 || inputText.length === 2) {
    enableButtons([btnBinary, btnPSK, btn4PSK]);
    disableButtons([btn8PSK]);
    chartWrapper.classList.add("hidden");
  } else if (inputText.length === 3) {
    enableButtons([btnBinary, btnPSK, btn4PSK, btn8PSK]);
  } else {
    enableButtons([btnBinary]);
    disableButtons([btnPSK, btn4PSK, btn8PSK, btnBinary]);
    chartWrapper.classList.add("hidden");
    message.textContent =
      "Por favor, ingrese hasta 3 caracteres para ver la modulación PSK.";
    if (message) {
      message.style.color = "red"; // Cambia el color del texto a rojo
      message.style.backgroundColor = "white"; // Cambia el fondo a blanco
    }
  }
});

// Función para habilitar botones
function enableButtons(buttons) {
  buttons.forEach((button) => {
    button.disabled = false;
  });
}

// Función para deshabilitar botones
function disableButtons(buttons) {
  buttons.forEach((button) => {
    button.disabled = true;
  });
}

// Función para crear el elemento de mensaje si no existe
function createMessageElement() {
  const messageElement = document.createElement("p");
  messageElement.id = "message";
  messageElement.style.color = "red";
  messageElement.style.marginTop = "10px";
  document.body.appendChild(messageElement);

  return messageElement;
}

let binaryChart = null; // Variable global para almacenar el gráfico binario
let pskChart = null; // Variable global para almacenar el gráfico PSK

document.getElementById("btnBinary").addEventListener("click", function () {
  const inputTexto = document.getElementById("inputTexto").value;
  const messageElement = document.getElementById("message");
  const binaryChartWrapper = document.getElementById("ChartWrapper");
  const canvas = document.getElementById("PSKChart");
  const titulo = document.getElementById("chart_title");
  titulo.innerHTML = `Señal Moduladora`;
  const caracteristicas = document.getElementById("characteristics");
  caracteristicas.innerHTML = `
    <i class="fa-solid fa-paragraph" style="color: #ffd43b"></i>
    Los datos binarios de entrada se procesan bit a bit. Cada bit
    genera una de las 2 fases posibles.
  `;

  const psktable = document.getElementById("table-container");
  psktable.classList.add("hidden");

  const constelacion = document.getElementById("ConstellationChart");
  constelacion.classList.add("hidden");

  if (!inputTexto) {
    messageElement.textContent = "Por favor ingresa un caracter.";
    messageElement.style.color = "red";
    messageElement.style.backgroundColor = "white";
    return;
  }

  // Convertir texto a ASCII y luego a binario (manteniendo como array)
  let binaryValues = Array.from(inputTexto).map((char) =>
    char.charCodeAt(0).toString(2).padStart(8, "0")
  );

  // Agregar un "0" al array
  binaryValues.push("0");

  // Si necesitas mostrarlo como un string
  let binaryString = binaryValues.join(""); // Convierte el array en string

  // Crear datos para graficar
  let binaryArray = binaryString.split("").map(Number); // Convertir a array de números

  messageElement.textContent = `Código ASCII: ${binaryString}`;
  messageElement.style.color = "white";
  messageElement.style.backgroundColor = "#3b3c49";

  console.log(binaryArray); // Verifica el array para graficar

  // Configuración del gráfico
  const data = {
    labels: binaryArray, // Mostrar los valores binarios en el eje X
    datasets: [
      {
        label: "Señal Binaria",
        data: binaryArray,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
        stepped: true,
      },
    ],
  };

  const config = {
    type: "line",
    data: data,
    options: {
      scales: {
        x: {
          title: {
            display: true,
            text: "Valores Binarios",
            color: "white",
          },
          ticks: {
            callback: function (value, index) {
              return data.labels[index];
            },
            color: "white",
            display: false,
          },
        },
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
            callback: (value) => (value === 0 || value === 1 ? value : ""),
            color: "white",
          },
        },
      },
    },
  };

  // **Destruir gráficos existentes**
  if (binaryChart) {
    binaryChart.destroy();
  }
  if (pskChart) {
    pskChart.destroy();
  }

  // Remover el último carácter del string
  binaryString = binaryString.slice(0, -1);

  let labelsElement = document.getElementById("labels");
  labelsElement.classList.remove("char1", "char2", "char3");
  // Verificar la cantidad de caracteres y asignar la clase correspondiente
  if (inputTexto.length === 1) {
    labelsElement.classList.add("char1");
  } else if (inputTexto.length === 2) {
    labelsElement.classList.add("char2");
  } else if (inputTexto.length === 3) {
    labelsElement.classList.add("char3");
  }
  labelsElement.textContent = binaryString;
  messageElement.textContent = `Código ASCII: ${binaryString}`;
  // Mostrar el gráfico

  binaryChartWrapper.classList.remove("hidden");
  binaryChart = new Chart(canvas, config);
});

document.getElementById("btnPSK").addEventListener("click", function () {
  const inputTexto = document.getElementById("inputTexto").value;
  const messageElement = document.getElementById("message");
  const PSKChartWrapper = document.getElementById("ChartWrapper");
  const canvas = document.getElementById("PSKChart");

  // Mostrar el contenedor del gráfico
  PSKChartWrapper.classList.remove("hidden");

  // Configurar el título y características
  const titulo = document.getElementById("chart_title");
  titulo.innerHTML = `Modulación Digital: PSK`;

  const caracteristicas = document.getElementById("characteristics");
  caracteristicas.innerHTML = `
    <i class="fa-solid fa-paragraph" style="color: #ffd43b"></i>
    Los datos binarios de entrada se procesan bit a bit. Cada bit genera una de las 2 fases posibles.
    Duración: T
  `;
  const psktable = document.getElementById("table-container");
  psktable.classList.remove("hidden");
  const table = document.getElementById("table");
  table.innerHTML = `<tr>
                  <th>Bits</th>
                  <th>Fase</th>
                </tr>
                <tr>
                  <td>0</td>
                  <td>0°</td>
                </tr>
                <tr>
                  <td>1</td>
                  <td>180°</td>
                </tr>`;

  const constelacion = document.getElementById("ConstellationChart");
  constelacion.classList.remove("hidden");

  if (!inputTexto) {
    messageElement.textContent = "Por favor ingresa un caracter.";
    return;
  }

  // Convertir texto a ASCII y luego a binario (manteniendo como array)
  let binaryValues = Array.from(inputTexto).map((char) =>
    char.charCodeAt(0).toString(2).padStart(8, "0")
  );

  // Agregar un "0" al array
  // binaryValues.push("0");

  // Si necesitas mostrarlo como un string
  const binaryString = binaryValues.join(""); // Convierte el array en string

  // Crear datos para graficar
  const binaryArray = binaryString.split("").map(Number); // Convertir a array de números

  messageElement.textContent = `Código ASCII: ${binaryString}`;
  messageElement.style.color = "white";
  messageElement.style.backgroundColor = "#3b3c49";

  console.log(binaryArray); // Verifica el array para graficar

  const samplesPerBit = 100;
  const carrierFrequency = 2 * Math.PI;
  const timeStep = 1 / samplesPerBit;
  const duration = binaryArray.length;

  function generatePSKWave(binaryString, timeData) {
    let pskWave = [];
    for (let t of timeData) {
      const bitIndex = Math.floor(t / 1);
      const bit = bitIndex < binaryString.length ? binaryString[bitIndex] : 0;
      const phaseShift = bit === 1 ? Math.PI : 0;
      pskWave.push(Math.sin(carrierFrequency * t + phaseShift));
    }
    return pskWave;
  }

  const timeData = [];
  for (let t = 0; t < duration; t += timeStep) {
    timeData.push(t);
  }

  const pskWave = generatePSKWave(binaryArray, timeData);

  const xLabels = [];
  for (let i = 0; i < binaryArray.length; i++) {
    xLabels.push(binaryArray[i]);
    for (let j = 1; j < samplesPerBit; j++) {
      xLabels.push("");
    }
  }

  let labelsElement = document.getElementById("labels");
  labelsElement.classList.remove("char1", "char2", "char3");
  // Verificar la cantidad de caracteres y asignar la clase correspondiente
  if (inputTexto.length === 1) {
    labelsElement.classList.add("char1");
  } else if (inputTexto.length === 2) {
    labelsElement.classList.add("char2");
  } else if (inputTexto.length === 3) {
    labelsElement.classList.add("char3");
  }

  labelsElement.classList.remove("estiloChart2", "estiloChart3");
  labelsElement.classList.add("estiloChart1");
  labelsElement.textContent = binaryString;
  messageElement.textContent = `Código ASCII: ${binaryString}`;

  const data = {
    labels: xLabels,
    datasets: [
      {
        label: "Señal PSK",
        data: pskWave,
        borderColor: "rgba(255, 164, 89, 1)",
        borderWidth: 2,
        pointRadius: 0,
        fill: false,
      },
    ],
  };

  const config = {
    type: "line",
    data: data,
    options: {
      scales: {
        x: {
          title: {
            display: true,
            text: "Bits",
            color: "white",
          },
          ticks: {
            callback: function (value, index) {
              return xLabels[index];
            },
            color: "white",
            autoSkip: false,
            maxRotation: 0,
            display: false,
          },
          grid: {
            display: false,
          },
        },
        y: {
          ticks: {
            color: "white",
          },
          grid: {
            display: false,
          },
        },
      },
    },
  };

  // **Destruir gráficos existentes**
  if (binaryChart) {
    binaryChart.destroy();
  }
  if (pskChart) {
    pskChart.destroy();
  }

  // Crear el nuevo gráfico
  pskChart = new Chart(canvas, config);
});

document.getElementById("btn4PSK").addEventListener("click", function () {
  const inputTexto = document.getElementById("inputTexto").value;
  const messageElement = document.getElementById("message");
  const PSKChartWrapper = document.getElementById("ChartWrapper");
  const canvas = document.getElementById("PSKChart");

  // Mostrar el contenedor del gráfico
  PSKChartWrapper.classList.remove("hidden");

  // Configurar el título y características
  const titulo = document.getElementById("chart_title");
  titulo.innerHTML = `Modulación Digital: 4PSK`;

  const caracteristicas = document.getElementById("characteristics");
  caracteristicas.innerHTML = `
    <i class="fa-solid fa-paragraph" style="color: #ffd43b"></i>
    Los datos binarios de entrada se combinan en grupos de 2 bits
    llamados dibits. Cada dibit genera una de las 4 fases posibles.
    Duración: T/2
  `;
  const psktable = document.getElementById("table-container");
  psktable.classList.remove("hidden");
  const table = document.getElementById("table");
  table.innerHTML = `<tr>
                  <th>DiBits</th>
                  <th>Fase</th>
                </tr>
                <tr>
                  <td>00</td>
                  <td>0°</td>
                </tr>
                <tr>
                  <td>01</td>
                  <td>90°</td>
                </tr>
                <tr>
                  <td>10</td>
                  <td>180°</td>
                </tr>
                <tr>
                  <td>11</td>
                  <td>270°</td>
                </tr>`;

  const constelacion = document.getElementById("ConstellationChart");
  constelacion.classList.remove("hidden");

  if (!inputTexto) {
    messageElement.textContent = "Por favor ingresa un caracter.";
    return;
  }

  // Convertir texto a ASCII y luego a binario
  const binaryValues = Array.from(inputTexto)
    .map((char) => char.charCodeAt(0).toString(2).padStart(8, "0"))
    .join("");

  messageElement.textContent = `Código ASCII: ${binaryValues}`;
  messageElement.style.color = "white";
  messageElement.style.backgroundColor = "#3b3c49";

  // Agrupar en dibits
  const dibits = binaryValues.match(/.{1,2}/g) || []; // Dividir en grupos de 2 bits
  const dibitPhases = {
    "00": 0,
    "01": Math.PI / 2,
    10: Math.PI,
    11: (3 * Math.PI) / 2,
  };

  // Generar señal 4PSK
  const samplesPerBit = 100;
  const carrierFrequency = 2 * Math.PI;
  const timeStep = 1 / samplesPerBit;
  const duration = dibits.length;

  function generate4PSKWave(dibits, timeData) {
    let pskWave = [];
    for (let t of timeData) {
      const bitIndex = Math.floor(t / 1);
      const dibit = bitIndex < dibits.length ? dibits[bitIndex] : "00";
      const phaseShift = dibitPhases[dibit] || 0;
      pskWave.push(Math.sin(carrierFrequency * t + phaseShift));
    }
    return pskWave;
  }

  const timeData = [];
  for (let t = 0; t < duration; t += timeStep) {
    timeData.push(t);
  }

  const pskWave = generate4PSKWave(dibits, timeData);

  // Generar etiquetas para los dibits
  const xLabels = [];
  dibits.forEach((dibit) => {
    xLabels.push(dibit);
    for (let j = 1; j < samplesPerBit; j++) {
      xLabels.push("");
    }
  });

  const data = {
    labels: xLabels,
    datasets: [
      {
        label: "Señal 4PSK",
        data: pskWave,
        borderColor: "rgba(0, 252, 29, 1)",
        borderWidth: 2,
        pointRadius: 0,
        fill: false,
      },
    ],
  };

  const config = {
    type: "line",
    data: data,
    options: {
      scales: {
        x: {
          title: {
            display: true,
            text: "Dibits",
            color: "white",
          },
          ticks: {
            callback: function (value, index) {
              return xLabels[index];
            },
            color: "white",
            autoSkip: false,
            maxRotation: 0,
            display: false,
          },
          grid: {
            display: false,
          },
        },
        y: {
          ticks: {
            color: "white",
          },
          grid: {
            display: false,
          },
        },
      },
    },
  };

  // **Destruir gráficos existentes**
  if (binaryChart) {
    binaryChart.destroy();
  }
  if (pskChart) {
    pskChart.destroy();
  }

  let labelsElement = document.getElementById("labels");
  labelsElement.classList.remove("char1", "char2", "char3");
  // Verificar la cantidad de caracteres y asignar la clase correspondiente
  if (inputTexto.length === 1) {
    labelsElement.classList.add("char1");
  } else if (inputTexto.length === 2) {
    labelsElement.classList.add("char2");
  } else if (inputTexto.length === 3) {
    labelsElement.classList.add("char3");
  }
  labelsElement.classList.remove("estiloChart1", "estiloChart3");
  labelsElement.classList.add("estiloChart2");
  labelsElement.textContent = binaryValues;
  messageElement.textContent = `Código ASCII: ${binaryValues}`;
  let formattedContent = binaryValues
    .split("") // Divide los bits en un array
    .map((bit, index) => `<span class="bit">${bit}</span>`) // Envuelve cada bit en un span
    .join(""); // Une todo en un solo string

  labelsElement.innerHTML = formattedContent;
  // Crear el nuevo gráfico
  pskChart = new Chart(canvas, config);
});

document.getElementById("btn8PSK").addEventListener("click", function () {
  const inputTexto = document.getElementById("inputTexto").value;
  const messageElement = document.getElementById("message");
  const PSKChartWrapper = document.getElementById("ChartWrapper");
  const canvas = document.getElementById("PSKChart");

  // Mostrar el contenedor del gráfico
  PSKChartWrapper.classList.remove("hidden");

  // Configurar el título y características
  const titulo = document.getElementById("chart_title");
  titulo.innerHTML = `Modulación Digital: 8PSK`;

  const caracteristicas = document.getElementById("characteristics");
  caracteristicas.innerHTML = `
    <i class="fa-solid fa-paragraph" style="color: #ffd43b"></i>
    Los datos binarios de entrada se agrupan en tribits (3 bits),
    cada uno de los cuales representa una de las 8 fases posibles.
    Duración: T/3
  `;

  const psktable = document.getElementById("table-container");
  psktable.classList.remove("hidden");
  const table = document.getElementById("table");
  table.innerHTML = `<tr>
                  <th>TriBits</th>
                  <th>Fase</th>
                </tr>
                <tr><td>000</td><td>0°</td></tr>
                <tr><td>001</td><td>45°</td></tr>
                <tr><td>010</td><td>90°</td></tr>
                <tr><td>011</td><td>135°</td></tr>
                <tr><td>100</td><td>180°</td></tr>
                <tr><td>101</td><td>225°</td></tr>
                <tr><td>110</td><td>270°</td></tr>
                <tr><td>111</td><td>315°</td></tr>`;

  const constelacion = document.getElementById("ConstellationChart");
  constelacion.classList.remove("hidden");

  if (!inputTexto) {
    messageElement.textContent = "Por favor ingresa un caracter.";
    return;
  }

  // Convertir texto a ASCII y luego a binario
  const binaryValues = Array.from(inputTexto)
    .map((char) => char.charCodeAt(0).toString(2).padStart(8, "0"))
    .join("");

  messageElement.textContent = `Código ASCII: ${binaryValues}`;
  messageElement.style.color = "white";
  messageElement.style.backgroundColor = "#3b3c49";

  // Agrupar en tribits
  const tribits = binaryValues.match(/.{1,3}/g) || [];
  const tribitPhases = {
    "000": 0,
    "001": Math.PI / 4,
    "010": Math.PI / 2,
    "011": (3 * Math.PI) / 4,
    100: Math.PI,
    101: (5 * Math.PI) / 4,
    110: (3 * Math.PI) / 2,
    111: (7 * Math.PI) / 4,
  };

  // Generar señal 8PSK
  const samplesPerBit = 100;
  const carrierFrequency = 2 * Math.PI;
  const timeStep = 1 / samplesPerBit;
  const duration = tribits.length;

  function generate8PSKWave(tribits, timeData) {
    let pskWave = [];
    for (let t of timeData) {
      const bitIndex = Math.floor(t / 1);
      const tribit = bitIndex < tribits.length ? tribits[bitIndex] : "000";
      const phaseShift = tribitPhases[tribit] || 0;
      pskWave.push(Math.sin(carrierFrequency * t + phaseShift));
    }
    return pskWave;
  }

  const timeData = [];
  for (let t = 0; t < duration; t += timeStep) {
    timeData.push(t);
  }

  const pskWave = generate8PSKWave(tribits, timeData);

  // Generar etiquetas para los tribits
  const xLabels = [];
  tribits.forEach((tribit) => {
    xLabels.push(tribit);
    for (let j = 1; j < samplesPerBit; j++) {
      xLabels.push("");
    }
  });

  const data = {
    labels: xLabels,
    datasets: [
      {
        label: "Señal 8PSK",
        data: pskWave,
        borderColor: "rgba(244, 252, 0, 1)",
        borderWidth: 2,
        pointRadius: 0,
        fill: false,
      },
    ],
  };

  const config = {
    type: "line",
    data: data,
    options: {
      scales: {
        x: {
          title: {
            display: true,
            text: "TriBits",
            color: "white",
          },
          ticks: {
            callback: function (value, index) {
              return xLabels[index];
            },
            color: "white",
            autoSkip: false,
            maxRotation: 0,
            display: false,
          },
          grid: {
            display: false,
          },
        },
        y: {
          ticks: {
            color: "white",
          },
          grid: {
            display: false,
          },
        },
      },
    },
  };

  // **Destruir gráficos existentes**
  if (binaryChart) {
    binaryChart.destroy();
  }
  if (pskChart) {
    pskChart.destroy();
  }

  let labelsElement = document.getElementById("labels");
  labelsElement.classList.remove("char1", "char2", "char3");
  // Verificar la cantidad de caracteres y asignar la clase correspondiente
  if (inputTexto.length === 1) {
    labelsElement.classList.add("char1");
  } else if (inputTexto.length === 2) {
    labelsElement.classList.add("char2");
  } else if (inputTexto.length === 3) {
    labelsElement.classList.add("char3");
  }
  labelsElement.classList.remove("estiloChart", "estiloChart2");
  labelsElement.classList.add("estiloChart3");
  labelsElement.textContent = binaryValues;
  messageElement.textContent = `Código ASCII: ${binaryValues}`;
  let formattedContent = binaryValues
    .split("") // Divide los bits en un array
    .map((bit, index) => `<span class="bit">${bit}</span>`) // Envuelve cada bit en un span
    .join(""); // Une todo en un solo string

  labelsElement.innerHTML = formattedContent;
  // Crear el nuevo gráfico
  pskChart = new Chart(canvas, config);
});

// Configuración común para inicializar el gráfico con etiquetas
// Variable para almacenar el gráfico actual
let currentChart = null;
// graficar constelacion
function inicializarConstelacion(idCanvas, title) {
  const canvas = document.getElementById(idCanvas);

  // Si hay un gráfico existente, destrúyelo
  if (currentChart) {
    currentChart.destroy();
  }

  // Crear el nuevo gráfico y almacenar la referencia
  currentChart = new Chart(canvas, {
    type: "scatter",
    data: {
      datasets: [
        {
          label: title,
          data: [], // Asegúrate de llenar este array con los datos de la constelación
          backgroundColor: "rgba(255, 99, 132, 1)", // Color de los puntos
          pointRadius: 5, // Tamaño reducido de los puntos
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false, // Ocultar leyenda
        },
        title: {
          display: false,
          text: title,
          color: "#ffffff", // Color del título
        },
        datalabels: {
          color: "#ffffff", // Color de las etiquetas
          font: {
            size: 12, // Tamaño más pequeño de fuente
          },
          align: "center", // Etiqueta alineada al centro del punto
          anchor: "center", // Ancla las etiquetas al centro del punto
          formatter: (value) => value.label, // Mostrar el valor binario en la etiqueta
          backgroundColor: "rgba(252, 0, 0, 0.9)", // Fondo semitransparente para mejorar visibilidad
          borderRadius: 10, // Bordes redondeados del fondo
          padding: 4, // Espaciado interno de las etiquetas
        },
      },
      layout: {
        padding: {
          top: 30, // Incrementa el margen superior
          bottom: 20,
          left: 20,
          right: 20,
        },
      },
      scales: {
        x: {
          type: "linear",
          position: "bottom",
          title: {
            display: true,
            text: "Constelación",
            color: "#ffffff",
          },
          grid: {
            color: "rgba(255, 255, 255, 0.2)",
          },
          ticks: {
            color: "#ffffff",
          },
        },
        y: {
          title: {
            display: false,
            text: "Eje Q (Quadrature)",
            color: "#ffffff",
          },
          grid: {
            color: "rgba(255, 255, 255, 0.2)",
          },
          ticks: {
            color: "#ffffff",
          },
        },
      },
    },
    plugins: [ChartDataLabels], // Activar el plugin de etiquetas
  });

  return currentChart;
}

//
// Diagrama de constelación para PSK
function graficarPSK(idCanvas) {
  const dataPoints = [
    { x: 1, y: 0, label: "0" }, // Fase 0
    { x: -1, y: 0, label: "1" }, // Fase 180°
  ];

  const chart = inicializarConstelacion(idCanvas, "ConstellationChart");
  chart.data.datasets[0].data = dataPoints;
  chart.update();
}

// Diagrama de constelación para 4PSK
function graficar4PSK(idCanvas) {
  const dataPoints = [
    { x: 1, y: 0, label: "00" }, // Fase 0
    { x: 0, y: 1, label: "01" }, // Fase 90°
    { x: -1, y: 0, label: "11" }, // Fase 180°
    { x: 0, y: -1, label: "10" }, // Fase 270°
  ];

  const chart = inicializarConstelacion(idCanvas, "Constelación 4PSK");
  chart.data.datasets[0].data = dataPoints;
  chart.update();
}

// Diagrama de constelación para 8PSK
function graficar8PSK(idCanvas) {
  const dataPoints = [];
  const step = (2 * Math.PI) / 8;

  for (let i = 0; i < 8; i++) {
    const angle = i * step;
    const binaryLabel = i.toString(2).padStart(3, "0"); // Etiqueta binaria de 3 bits
    dataPoints.push({
      x: Math.cos(angle),
      y: Math.sin(angle),
      label: binaryLabel,
    });
  }

  const chart = inicializarConstelacion(idCanvas, "Constelación 8PSK");
  chart.data.datasets[0].data = dataPoints;
  chart.update();
}

// Añadiendo Event Listeners a los botones
document.addEventListener("DOMContentLoaded", () => {
  const canvasId = "ConstellationChart";

  document.getElementById("btnPSK").addEventListener("click", () => {
    graficarPSK(canvasId);
  });

  document.getElementById("btn4PSK").addEventListener("click", () => {
    graficar4PSK(canvasId);
  });

  document.getElementById("btn8PSK").addEventListener("click", () => {
    graficar8PSK(canvasId);
  });
});
