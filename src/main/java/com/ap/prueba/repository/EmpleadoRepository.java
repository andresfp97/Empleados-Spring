package com.ap.prueba.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.ap.prueba.model.Empleado;
import jakarta.transaction.Transactional;

@Repository
public interface EmpleadoRepository extends JpaRepository<Empleado, Long> {

    List<Empleado> findByNombreContainingIgnoreCase(String nombre);
    List<Empleado> findByCuidadContainingIgnoreCase(String cuidad);

    @Modifying
    @Transactional
    @Query("update Empleado e set e.nombre = :nombre, e.cargo = :cargo, e.cuidad = :cuidad, e.edad = :edad, e.fechaInicio = :fechaInicio, e.salario = :salario where e.id = :id")
    int actualizarEmpleadoJPQL(
        @Param("id") Long id,
        @Param("nombre") String nombre,
        @Param("cargo") String cargo,
        @Param("cuidad") String cuidad,
        @Param("edad") Integer edad,
        @Param("fechaInicio") Date fechaInicio,
        @Param("salario") double salario
        );


    
}