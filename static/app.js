

const form = document.querySelector("#form");
const messageElement = document.createElement("p");


form.addEventListener("submit", function (e) {
  e.preventDefault();
  get_colors();
});

function get_colors() {
  const query = form.elements.query.value;
  fetch("/palette", {
    method: "POST",
    headers: {
      "Content-type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      query: query,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      const colors = data.colors;
      const container = document.querySelector(".container");
      create_color_boxes(colors, container);
    });
}

function create_color_boxes(colors, parent) {
  parent.innerHTML = "";

  for (const color of colors) {
    const div = document.createElement("div");

    div.style.backgroundColor = color;
    div.style.width = `calc(100%/${colors.length})`;
    div.classList.add("color");

    div.addEventListener("click", function () {
      navigator.clipboard.writeText(color);

      messageElement.textContent = "Copied!";
      div.appendChild(messageElement);

      setTimeout(() => {
        messageElement.remove();
      }, 2500);
    });

    const span = document.createElement("span");
    span.innerText = color;
    div.appendChild(span);
    parent.appendChild(div);

    const computedStyle = getComputedStyle(div);
    const backgroundColor = computedStyle.backgroundColor;

    // Obtener la luminosidad del color de fondo
    const luminosity = getLuminosity(backgroundColor);

    // Función para obtener la luminosidad de un color
    function getLuminosity(color) {
      // Convertir el color a formato RGB
      const rgbColor = color.match(/\d+/g).map(Number);
      const [r, g, b] = rgbColor;
      return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    }

    // Establecer el color del texto basado en la luminosidad del fondo
    if (luminosity > 0.5) {
      span.style.color = "#000000"; // Color de texto oscuro para fondos claros
    } else {
      span.style.color = "#ffffff"; // Color de texto claro para fondos oscuros
    }
  }
}
