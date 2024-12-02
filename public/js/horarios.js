const ServerApi = import.meta.env.SERVER;

document.addEventListener('DOMContentLoaded', function() {
    const datePicker = document.getElementById('datePicker');
    const blockButton = document.getElementById('blockButton');

    // Set min date to today
    const today = new Date().toISOString().split('T')[0];
    datePicker.min = today;
    datePicker.value = today;

    // Event listener for block button
    blockButton.addEventListener('click', function() {
        const selectedDate = datePicker.value;

        if (selectedDate) {
            saveBlockedDatesToDatabase(selectedDate); // Save to the database
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Fecha no seleccionada',
                text: 'Por favor, selecciona una fecha para bloquear.'
            });
        }
    });

    // Function to save blocked date to the database
    function saveBlockedDatesToDatabase(date) {
        fetch(`${ServerApi}/admin/bloquear-fecha`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ fecha: date })
        })
        .then(response => response.json())
        .then(data => {
            Swal.fire({
                icon: 'success',
                title: 'Fecha guardada',
                text: 'La fecha se ha guardado correctamente en la base de datos.'
            });
        })
        .catch(error => {
            console.error('Error al enviar la solicitud:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error en la conexión con el servidor.'
            });
        });
    }
});
