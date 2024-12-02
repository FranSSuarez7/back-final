
const ServerApi = import.meta.env.SERVER;

document.addEventListener('DOMContentLoaded', () => {

    // Función para manejar el cambio de estado "Mostrar"
    const handleShowButtonClick = () => {
        const showButtons = document.querySelectorAll('.status.delivered');
        showButtons.forEach(button => {
            button.addEventListener('click', async () => {
                const idResena = button.getAttribute('data-id');

                try {
                    const response = await fetch(`${ServerApi}/admin/resenas/${idResena}/toggle`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ mostrar: !button.classList.contains('si') })
                    });

                    if (!response.ok) {
                        throw new Error('Error al cambiar el estado de mostrar');
                    }

                    // Cambiar el texto del botón y las clases según el nuevo estado
                    button.textContent = !button.classList.contains('si') ? 'Sí' : 'No';
                    button.classList.toggle('si');
                    button.classList.toggle('no');

                } catch (error) {
                    console.error(error);
                    alert('Hubo un error al cambiar el estado de mostrar');
                }
            });
        });
    };

    // Llamar a la función al cargar el DOM
    handleShowButtonClick();

    // Función para manejar el envío del formulario de eliminación de reseñas por AJAX
    const handleDeleteFormSubmit = () => {
        const forms = document.querySelectorAll('.delete-form');
        forms.forEach(form => {
            form.addEventListener('submit', async function (e) {
                e.preventDefault();

                // Mostrar confirmación antes de eliminar
                const confirmed = await confirmDeleteDialog();
                if (!confirmed) return;

                const card = this.closest('.card');
                const id = card.getAttribute('data-id');
                try {
                    const response = await fetch(`${ServerApi}/admin/resenas/delete/${id}`, {
                        method: 'POST',
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
                                text: "La reseña ha sido eliminada.",
                                icon: "success"
                            });
                        } else {
                            throw new Error('Error al eliminar la reseña');
                        }
                    } else {
                        throw new Error('Error en la solicitud');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    Swal.fire({
                        title: "Error",
                        text: "Ocurrió un error al eliminar la reseña.",
                        icon: "error"
                    });
                }
            });
        });
    };

    // Función para mostrar el cuadro de diálogo de confirmación
    const confirmDeleteDialog = async () => {
        return Swal.fire({
            title: "¿Estás seguro de eliminar la reseña?",
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

    // Llamar a la función para manejar el envío de formularios de eliminación al cargar el DOM
    handleDeleteFormSubmit();
});
