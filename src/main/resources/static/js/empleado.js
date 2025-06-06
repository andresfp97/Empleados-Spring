const API_BASE_URL = '/api/v1/empleados'; // URL base de tu API
const empleadosTableBody = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
let currentEmpleadosList = []; // Para almacenar la lista actual de Empleados

// --- Renderizar tabla de empleados (Optimizado con DocumentFragment) ---

function renderizarTabla(empleados) {
    empleadosTableBody.innerHTML = ''; // Limpiar tabla existente
    currentEmpleadosList = empleados; // Actualizar la lista global

    const fragment = document.createDocumentFragment(); // Crear un DocumentFragment

    if (!empleados || empleados.length === 0) {
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.setAttribute('colspan', 6);
        td.textContent = 'No hay empleados para mostrar.';
        td.style.textAlign = 'center';
        tr.appendChild(td); 
        fragment.appendChild(tr);
    } else {
        empleados.forEach(func => {
            const tr = document.createElement('tr');
            tr.dataset.id = func.id; // Guardar el ID en la fila para fácil acceso

            const tdId = document.createElement('td');
            tdId.textContent = func.id;
            tr.appendChild(tdId);

            const tdNombre = document.createElement('td');
            tdNombre.textContent = func.nombre;
            tr.appendChild(tdNombre);

            const tdCargo = document.createElement('td');
            tdCargo.textContent = func.cargo;
            tr.appendChild(tdCargo);

            const tdCuidad = document.createElement('td');
            tdCuidad.textContent = func.cuidad;
            tr.appendChild(tdCuidad);

            const tdEdad = document.createElement('td');
            tdEdad.textContent = func.edad;
            tr.appendChild(tdEdad);

            const tdFechaInicio = document.createElement('td');
            tdFechaInicio.textContent = func.fechaInicio;
            tr.appendChild(tdFechaInicio);

            const tdSalario = document.createElement('td');
            tdSalario.textContent = func.salario;
            tr.appendChild(tdSalario);


            // Crear celda de acciones
            const tdAcciones = document.createElement('td');
            

            const btnEliminar = document.createElement('button');
            const iconEliminar = document.createElement('i');
            iconEliminar.className ='fas fa-trash';
            btnEliminar.className = 'btn btn-danger btn-circle';
            btnEliminar.dataset.action = 'delete';
            tdAcciones.appendChild(btnEliminar);
            btnEliminar.appendChild(iconEliminar)
            
            tr.appendChild(tdAcciones);

            fragment.appendChild(tr); // Agregar la fila completa al fragmento
        });
    }
    empleadosTableBody.appendChild(fragment); // Agregar el fragmento completo al tbody de una vez
}

// --- Manejador de clics para la tabla (Delegación de Eventos) ---
function handleTableClick(event) {
    const target = event.target; // El elemento clickeado
    if (target.tagName === 'BUTTON') {
        const action = target.dataset.action;
        const row = target.closest('tr'); // Encuentra la fila (tr) más cercana
        if (!row) return;

        const funcionarioId = row.dataset.id; // Obtener el ID del funcionario desde la fila

        if (action === 'edit') {
            const funcionario = currentempleadosList.find(f => f.id == funcionarioId); // Usar '==' para comparar string con número si es necesario, o parsear funcionarioId
            if (funcionario) {
                cargarFuncionarioParaEditar(funcionario);
            }
        } else if (action === 'delete') {
            eliminarFuncionario(funcionarioId);
        }
    }
}


// --- Cargar todos los empleados ---
async function cargarTodosLosempleados() {
    try {
        const response = await fetch(API_BASE_URL);
        if (response.status === 204) { // No Content
            renderizarTabla([]);
            mostrarMensaje('No hay empleados registrados.', 'success');
            return;
        }
        if (!response.ok) {
            throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
        }
        const empleados = await response.json();
        renderizarTabla(empleados);
        // No mostramos mensaje aquí para no ser repetitivo si ya hay datos
    } catch (error) {
        console.error('Error al cargar empleados:', error);
        mostrarMensaje(`Error al cargar empleados: ${error.message}`, 'error');
        renderizarTabla([]); // Limpiar tabla en caso de error
    }
}

// --- Buscar por ID ---
async function buscarPorId() {
    const id = document.getElementById('searchId').value;
    if (!id) {
        mostrarMensaje('Por favor, ingrese un ID para buscar.', 'error');
        return;
    }
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`);
        if (response.status === 404) {
            mostrarMensaje(`Funcionario con ID ${id} no encontrado.`, 'error');
            renderizarTabla([]);
            return;
        }
        if (!response.ok) {
            throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
        }
        const funcionario = await response.json();
        renderizarTabla([funcionario]); // Renderizar como un array de un solo elemento
        mostrarMensaje(`Funcionario con ID ${id} encontrado.`, 'success');
    } catch (error) {
        console.error('Error al buscar por ID:', error);
        mostrarMensaje(`Error al buscar por ID: ${error.message}`, 'error');
    }
}

// --- Buscar por Nombre ---
async function buscarPorNombre() {
    const nombre = document.getElementById('searchNombre').value;
    if (!nombre) {
        mostrarMensaje('Por favor, ingrese un nombre para buscar.', 'error');
        return;
    }
    try {
        const response = await fetch(`${API_BASE_URL}?nombre=${encodeURIComponent(nombre)}`);
         if (response.status === 204) {
            renderizarTabla([]);
            mostrarMensaje(`No se encontraron empleados con el nombre "${nombre}".`, 'success');
            return;
        }
        if (!response.ok) {
            throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
        }
        const empleados = await response.json();
        renderizarTabla(empleados);
        mostrarMensaje(`Resultados para "${nombre}" cargados.`, 'success');
    } catch (error) {
        console.error('Error al buscar por nombre:', error);
        mostrarMensaje(`Error al buscar por nombre: ${error.message}`, 'error');
    }
}

// --- Buscar por Departamento ---
async function buscarPorDepartamento() {
    const depto = document.getElementById('searchDepartamento').value;
    if (!depto) {
        mostrarMensaje('Por favor, ingrese un departamento para buscar.', 'error');
        return;
    }
    try {
        const response = await fetch(`${API_BASE_URL}?cuidad=${encodeURIComponent(depto)}`);
        if (response.status === 204) {
            renderizarTabla([]);
            mostrarMensaje(`No se encontraron empleados en el departamento "${depto}".`, 'success');
            return;
        }
        if (!response.ok) {
            throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
        }
        const empleados = await response.json();
        renderizarTabla(empleados);
        mostrarMensaje(`Resultados para el departamento "${depto}" cargados.`, 'success');
    } catch (error) {
        console.error('Error al buscar por departamento:', error);
        mostrarMensaje(`Error al buscar por departamento: ${error.message}`, 'error');
    }
}




// --- Eliminar Funcionario ---
async function eliminarFuncionario(id) { // Ahora solo necesita el ID
    if (!confirm(`¿Está seguro de que desea eliminar al funcionario con ID ${id}?`)) {
        return;
    }
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'DELETE'
        });
        if (response.status === 204) { 
            mostrarMensaje(`Funcionario con ID ${id} eliminado.`, 'success');
        } else if (response.status === 404) {
             mostrarMensaje(`Funcionario con ID ${id} no encontrado para eliminar.`, 'error');
        } else if (!response.ok) {
            throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
        }
        cargarTodosLosempleados(); 
    } catch (error) {
        console.error('Error al eliminar funcionario:', error);
        mostrarMensaje(`Error al eliminar: ${error.message}`, 'error');
    }
}

// --- Carga inicial de datos y configuración de event listener para la tabla ---
document.addEventListener('DOMContentLoaded', () => {
    cargarTodosLosempleados();
    empleadosTableBody.addEventListener('click', handleTableClick); // Añadir el event listener al tbody
});
