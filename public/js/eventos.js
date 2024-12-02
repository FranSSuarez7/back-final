const ServerApi = import.meta.env.SERVER;

document.addEventListener('DOMContentLoaded', () => {
    const deleteButtons = document.querySelectorAll('.delete-btn');
    const editButtons = document.querySelectorAll('.edit-btn');
    const searchInput = document.getElementById('search');
    const eventsCards = document.getElementById('events_cards').querySelector('.cards__body');

    // Función para mostrar el cuadro de diálogo de confirmación
    const confirmDeleteDialog = async () => {
        return Swal.fire({
            title: "¿Estás seguro de eliminar el evento?",
            text: "Esta acción no se puede revertir.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, eliminar"
        }).then((result) => {
            return result.isConfirmed;
        });
    };

    // Función para manejar la eliminación de eventos
    const handleDeleteFormSubmit = () => {
        deleteButtons.forEach(button => {
            button.addEventListener('click', async function () {
                // Mostrar confirmación antes de eliminar
                const confirmed = await confirmDeleteDialog();
                if (!confirmed) return;

                const card = this.closest('.card');
                const id = card.getAttribute('data-id');
                try {
                    const response = await fetch(`${ServerApi}/admin/eventos/delete/${id}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        }
                    });
                    if (response.ok) {
                        const result = await response.json();
                        if (result.success) {
                            card.remove();
                            Swal.fire({
                                title: "¡Eliminado!",
                                text: "El evento ha sido eliminado.",
                                icon: "success"
                            });
                        } else {
                            throw new Error('Error al eliminar el evento');
                        }
                    } else {
                        throw new Error('Error en la solicitud');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    Swal.fire({
                        title: "Error",
                        text: "Ocurrió un error al eliminar el evento.",
                        icon: "error"
                    });
                }
            });
        });
    };


    // Manejar la búsqueda de eventos
    searchInput.addEventListener('input', () => {
        const filter = searchInput.value.toLowerCase();
        const cards = eventsCards.querySelectorAll('.card');

        cards.forEach(card => {
            const title = card.querySelector('h2').innerText.toLowerCase();
            if (title.includes(filter)) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    });


    // Llamar a las funciones al cargar el DOM
    handleDeleteFormSubmit();
});
    // Función para manejar la eliminación de eventos
    const handleDeleteFormSubmit = () => {
        deleteButtons.forEach(button => {
            button.addEventListener('click', async function () {
                // Mostrar confirmación antes de eliminar
                const confirmed = await confirmDeleteDialog();
                if (!confirmed) return;

                const card = this.closest('.card');
                const id = card.getAttribute('data-id');
                try {
                    const response = await fetch(`${ServerApi}/admin/eventos/delete/${id}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        }
                    });
                    if (response.ok) {
                        const result = await response.json();
                        if (result.success) {
                            card.remove();
                            Swal.fire({
                                title: "¡Eliminado!",
                                text: "El evento ha sido eliminado.",
                                icon: "success"
                            });
                        } else {
                            throw new Error('Error al eliminar el evento');
                        }
                    } else {
                        throw new Error('Error en la solicitud');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    Swal.fire({
                        title: "Error",
                        text: "Ocurrió un error al eliminar el evento.",
                        icon: "error"
                    });
                }
            });
        });
    };