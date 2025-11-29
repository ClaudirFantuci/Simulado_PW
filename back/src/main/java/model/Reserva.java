package model;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import enums.DiaSemana;
import enums.Lab;
import enums.Periodo;
import enums.Status;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class Reserva {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private Lab laboratorio;

    @Enumerated(EnumType.STRING)
    private DiaSemana diaSemana;

    @Enumerated(EnumType.STRING)
    private Periodo periodo;

    private String solicitante;
    private String observacao;

    @Enumerated(EnumType.STRING)
    private Status status = Status.ATIVA;

    @CreationTimestamp
    private LocalDateTime criadoEm;
}