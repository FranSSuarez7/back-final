
const ServerApi = import.meta.env.SERVER;

const search = document.querySelector('.input-group input'),
    table_rows = document.querySelectorAll('tbody tr'),
    table_headings = document.querySelectorAll('thead th');

// Busca dato específico en la tabla
search.addEventListener('input', searchTable);

function searchTable() {
    table_rows.forEach((row, i) => {
        let table_data = row.textContent.toLowerCase(),
            search_data = search.value.toLowerCase();

        // Oculta las filas que no coinciden completamente
        row.style.display = table_data.indexOf(search_data) < 0 ? 'none' : '';
        row.style.setProperty('--delay', i / 25 + 's');
    });

    // Alterna el color de fondo de las filas visibles
    document.querySelectorAll('tbody tr:not([style*="display: none"])').forEach((visible_row, i) => {
        visible_row.style.backgroundColor = (i % 2 == 0) ? 'transparent' : '#0000000b';
    });
}

// 2. Ordena la tabla
table_headings.forEach((head, i) => {
    let sort_asc = true;
    head.onclick = () => {
        table_headings.forEach(head => head.classList.remove('active'));
        head.classList.add('active');

        document.querySelectorAll('td').forEach(td => td.classList.remove('active'));
        table_rows.forEach(row => {
            row.querySelectorAll('td')[i].classList.add('active');
        });

        head.classList.toggle('asc', sort_asc);
        sort_asc = head.classList.contains('asc') ? false : true;

        sortTable(i, sort_asc);
    };
});

function sortTable(column, sort_asc) {
    [...table_rows].sort((a, b) => {
        let first_row = a.querySelectorAll('td')[column].textContent.toLowerCase(),
            second_row = b.querySelectorAll('td')[column].textContent.toLowerCase();

        return sort_asc ? (first_row < second_row ? 1 : -1) : (first_row < second_row ? -1 : 1);
    })
        .map(sorted_row => document.querySelector('tbody').appendChild(sorted_row));
}

// 3. Convierte HTML a PDF
const pdf_btn = document.querySelector('#toPDF');
const customers_table = document.querySelector('#customers_table');

const toPDF = function(customers_table) {
    const html_code = `
    <!DOCTYPE html>
    <link rel="stylesheet" type="text/css" href="style.css">
    <main class="table" id="customers_table">${customers_table.innerHTML}</main>`;

    const new_window = window.open();
    new_window.document.write(html_code);

    setTimeout(() => {
        new_window.print();
        new_window.close();
    }, 400);
};

pdf_btn.onclick = () => {
    toPDF(customers_table);
};

// 4. Convierte HTML a CSV
const csv_btn = document.querySelector('#toCSV');

const toCSV = function(table) {
    const t_heads = table.querySelectorAll('th'),
        tbody_rows = table.querySelectorAll('tbody tr');

    const headings = [...t_heads].map(head => head.textContent.trim().toLowerCase()).join(',') + ',' + 'image name';

    const table_data = [...tbody_rows].map(row => {
        const cells = row.querySelectorAll('td'),
            img = decodeURIComponent(row.querySelector('img').src),
            data_without_img = [...cells].map(cell => cell.textContent.replace(/,/g, ".").trim()).join(',');

        return data_without_img + ',' + img;
    }).join('\n');

    return headings + '\n' + table_data;
};

csv_btn.onclick = () => {
    const csv = toCSV(customers_table);
    downloadFile(csv, 'csv', 'customer orders');
};

// 5. Convierte HTML a Excel
const excel_btn = document.querySelector('#toEXCEL');

const toExcel = function(table) {
    const t_heads = table.querySelectorAll('th'),
        tbody_rows = table.querySelectorAll('tbody tr');

    const headings = [...t_heads].map(head => head.textContent.trim().toLowerCase()).join('\t') + '\t' + 'image name';

    const table_data = [...tbody_rows].map(row => {
        const cells = row.querySelectorAll('td'),
            img = decodeURIComponent(row.querySelector('img').src),
            data_without_img = [...cells].map(cell => cell.textContent.trim()).join('\t');

        return data_without_img + '\t' + img;
    }).join('\n');

    return headings + '\n' + table_data;
};

excel_btn.onclick = () => {
    const excel = toExcel(customers_table);
    downloadFile(excel, 'excel');
};

const downloadFile = function(data, fileType, fileName = '') {
    const a = document.createElement('a');
    a.download = fileName;
    const mime_types = {
        'json': 'application/json',
        'csv': 'text/csv',
        'excel': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    };
    a.href = `data:${mime_types[fileType]};charset=utf-8,${encodeURIComponent(data)}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
};

// ALERTAS de SweetAlert2
function confirmDelete(id) {
    Swal.fire({
      title: "¿Estás seguro de eliminar la reserva?",
      text: "¡No puedes revertir esta acción!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar!"
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`${ServerApi}/admin/reservas/${id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        })
        .then(response => {
          if (response.ok) {
            Swal.fire("Eliminado!", "La reserva ha sido eliminada.", "success").then(() => window.location.reload());
          } else {
            Swal.fire("Error!", "No se pudo eliminar la reserva.", "error");
          }
        })
        .catch(error => {
          console.error('Error:', error);
          Swal.fire("Error!", "Ocurrió un error al eliminar la reserva.", "error");
        });
      }
    });
}

// Función para cambiar estado y enviar mensaje
function toggleEstado(reservaId, estadoActual) {
    fetch(`${ServerApi}/admin/reservas/${reservaId}/toggle`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estadoActual }),
    })
    .then(response => response.json())
    .then(data => {
        const newEstado = data.nuevoEstado;
        const btn = document.getElementById(`status-btn-${reservaId}`);
        if (btn) {
            btn.textContent = newEstado;
            btn.className = `button-status ${newEstado.toLowerCase()}`;
            if (newEstado === 'confirmado') {
                let phoneNumber = data.telefonoCliente.trim();
                if (!phoneNumber.startsWith('+')) phoneNumber = `+54${phoneNumber}`;
                const message = `Hola, tu reserva con ID ${reservaId} ha sido confirmada. ¡Gracias por elegirnos!`;
                sendWhatsAppMessage(phoneNumber, message);
            }
        }
    })
    .catch(error => console.error('Error:', error));
}

function sendWhatsAppMessage(phoneNumber, message) {
    if (!phoneNumber.startsWith('+')) phoneNumber = `+54${phoneNumber}`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
}
