package com.ap.prueba.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ap.prueba.model.Empleado;
import com.ap.prueba.repository.EmpleadoRepository;

@Service
public class EmpleadoService {

    @Autowired
    private EmpleadoRepository empleadoRepository;

    @Transactional(readOnly = true)
    public List<Empleado> obtenerTodosLosEmpleados() {
        return empleadoRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<Empleado> obtenerEmpleadoPorId(Long id) {
        if (id != null)
            return empleadoRepository.findById(id);
        
        return Optional.empty();
    }

    @Transactional(readOnly = true)
    public List<Empleado> buscarPorCuidad(String cuidad) {
        if (cuidad == null || cuidad.trim().isEmpty())
            return new ArrayList<>();

        return empleadoRepository.findByCuidadContainingIgnoreCase(cuidad);
    }

    @Transactional(readOnly = true)
    public List<Empleado> buscarPorNombre(String nombre) {
        if (nombre == null || nombre.trim().isEmpty())
            return new ArrayList<>();

        return empleadoRepository.findByNombreContainingIgnoreCase(nombre);
    }

    @Transactional
    public Empleado crearNuevoEmpleado(Empleado empleado) {
        if (empleado == null) {
            throw new IllegalArgumentException("El empleado no puede ser nulo para poderlo crear");
        }

        if (empleado.getId() != null)
            throw new IllegalArgumentException("El ID deber ser nulo para poder crear un empleado");
        
        return empleadoRepository.save(empleado);
    }

    @Transactional
    public void eliminarEmpleadoPorId(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("El ID no puede ser nulo para eliminar un empleado.");
        }

        if (!empleadoRepository.existsById(id))
            throw new IllegalArgumentException("Empleado con el ID: " + id + " no existe para poder eliminarlo");
        
        empleadoRepository.deleteById(id);
    }

    @Transactional
    public Empleado actualizarEmpleadoExistente(Long id, Empleado empleadoNuevo) {
        if (id == null || empleadoNuevo == null)
            throw new IllegalArgumentException("El ID y los datos del empleado no pueden ser nulos para actualizar.");

        Optional<Empleado> empleadoExiste = empleadoRepository.findById(id);
        if (!empleadoExiste.isPresent())
            throw new RuntimeException("Empleado no encontrado con el ID: " + id);

        int filasAfectadas = empleadoRepository.actualizarEmpleadoJPQL(id, 
        empleadoNuevo.getNombre(),
        empleadoNuevo.getCargo(),
        empleadoNuevo.getCuidad(),
        empleadoNuevo.getEdad(),
        empleadoNuevo.getFechaInicio(),
        empleadoNuevo.getSalario());

        if (filasAfectadas > 0) 
            return empleadoRepository.findById(id)
                        .orElseThrow(() -> new RuntimeException("Error al recuperar empleado despues de actualizar. ID: " + id));
        else
            throw new RuntimeException("La actualización del empleado con ID: " + id + " no afectó ninguna fila");
    }
}
