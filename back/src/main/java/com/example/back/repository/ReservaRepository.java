package com.example.back.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.back.enums.DiaSemana;
import com.example.back.enums.Lab;
import com.example.back.enums.Periodo;
import com.example.back.enums.Status;
import com.example.back.model.Reserva;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Long> {

        // Verificar conflito
        Optional<Reserva> findByLaboratorioAndDiaSemanaAndPeriodoAndStatus(
                        Lab laboratorio,
                        DiaSemana diaSemana,
                        Periodo periodo,
                        Status status);

        // Contar por solicitante
        long countBySolicitanteAndStatus(String solicitante, Status status);

        // Contar total de ativas
        long countByStatus(Status status);

        // Contar por laboratório
        long countByLaboratorioAndStatus(Lab laboratorio, Status status);

        // Listar todas ordenadas
        List<Reserva> findAllByOrderByIdDesc();

        // Filtros
        @Query("SELECT r FROM Reserva r WHERE " +
                        "(:laboratorio IS NULL OR r.laboratorio = :laboratorio) AND " +
                        "(:periodo IS NULL OR r.periodo = :periodo) AND " +
                        "(:status IS NULL OR r.status = :status) " +
                        "ORDER BY r.id DESC")
        List<Reserva> findByFiltros(Lab laboratorio, Periodo periodo, Status status);
}