/* Esto no funciona todavia */

document.addEventListener('DOMContentLoaded', async function() {
  try {
      const response = await fetch('http://localhost:3000/home/resenasTotales'); // Ruta a tu API
      if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
      }
      const data = await response.json();
      const totalReseñasElement = document.getElementById('totalReseñas');
      totalReseñasElement.textContent = data.totalResenas; // Actualizar el contenido con los datos de la API
  } catch (error) {
      console.error('Error al obtener los datos de la API:', error);
      const totalReseñasElement = document.getElementById('totalReseñas');
      totalReseñasElement.textContent = 'Error al cargar datos'; // Mostrar mensaje de error en caso de fallo
  }
});



/* Grafica lineal */

const ctx = document.getElementById('myChart').getContext('2d');

// Usar los datos pasados desde el controlador
const dataPorMes = <%- JSON.stringify(dataPorMes) %>;

const options = {
    scales: {
        y: {
            beginAtZero: true
        }
    }
};

let chart = new Chart(ctx, {
    type: 'line',
    data: dataPorMes,
    options: options
});







/* Grafica Dona  dias mas visitados*/


/* Reseñas TOTALES */

document.addEventListener('DOMContentLoaded', async function() {
  try {
      // Hacer la solicitud a la API
      const response = await fetch('http://localhost:3000/admin/home/resenasTotales'); // Ruta a tu API
      if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
      }
      const data = await response.json();

      const cuadrosDiv = document.querySelector('.cuadros');
      const totalReseñasElement = document.createElement('h3');
      totalReseñasElement.id = 'totalReseñas';
      totalReseñasElement.textContent = data.totalResenas;
      cuadrosDiv.appendChild(totalReseñasElement);
  } catch (error) {
      console.error('Error al obtener los datos de la API:', error);
  }
});




/* PROMEDIO CALIFICACION */

document.addEventListener('DOMContentLoaded', async function() {
  try {
      const response = await fetch('http://localhost:3000/admin/home/promedioCalificaciones');
      if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
      }
      const data = await response.json();
      
      const promedioPuntuacionElement = document.getElementById('promedioPuntuacion');
      if (data && data.promedioCalificaciones) {
          const promedio = parseFloat(data.promedioCalificaciones);
          if (!isNaN(promedio)) {
              promedioPuntuacionElement.textContent = promedio.toFixed(2);
          } else {
              throw new Error('Invalid promedioCalificaciones value: ' + data.promedioCalificaciones);
          }
      } else {
          throw new Error('Invalid API response: ' + JSON.stringify(data));
      }
  } catch (error) {
      console.error('Error al obtener el promedio de puntuación:', error);
      const promedioPuntuacionElement = document.getElementById('promedioPuntuacion');
      promedioPuntuacionElement.textContent = 'Error al cargar el promedio de puntuación';
  }
});


/* Cantidad de personas Reservas HOY */

