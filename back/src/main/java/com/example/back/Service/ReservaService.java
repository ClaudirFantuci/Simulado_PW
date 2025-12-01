package com.example.back.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.back.enums.Lab;
import com.example.back.enums.Periodo;
import com.example.back.enums.Status;
import com.example.back.model.Reserva;
import com.example.back.repository.ReservaRepository;

@Service
public class ReservaService {

    @Autowired
    private ReservaRepository repository;
    // private final WebSocketNotificationService wsService;

    public Reserva criar(Reserva reserva) {
        long ativas = repository.countBySolicitanteAndStatus(reserva.getSolicitante(), Status.ATIVA);
        if (ativas >= 3) {
            throw new RuntimeException("Limite de 3 reservas ativas por solicitante");
        }

        Optional<Reserva> conflito = repository.findByLaboratorioAndDiaSemanaAndPeriodoAndStatus(
                reserva.getLaboratorio(),
                reserva.getDiaSemana(),
                reserva.getPeriodo(),
                Status.ATIVA);
        if (conflito.isPresent()) {
            throw new RuntimeException("Já existe reserva ativa para este horário");
        }

        reserva.setStatus(Status.ATIVA);
        Reserva salva = repository.save(reserva);
        // wsService.notificarCriacao(salva);
        return salva;
    }

    public Reserva atualizar(Long id, Reserva dados) {
        Reserva reserva = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reserva não encontrada"));

        // Validação: conflito (exceto com ela mesma)
        Optional<Reserva> conflito = repository.findByLaboratorioAndDiaSemanaAndPeriodoAndStatus(
                dados.getLaboratorio(),
                dados.getDiaSemana(),
                dados.getPeriodo(),
                Status.ATIVA);
        if (conflito.isPresent() && !conflito.get().getId().equals(id)) {
            throw new RuntimeException("Já existe outra reserva ativa para este horário");
        }

        // Atualiza campos (solicitante NÃO muda)
        reserva.setLaboratorio(dados.getLaboratorio());
        reserva.setDiaSemana(dados.getDiaSemana());
        reserva.setPeriodo(dados.getPeriodo());
        reserva.setObservacao(dados.getObservacao());

        Reserva atualizada = repository.save(reserva);
        // wsService.notificarAtualizacao(atualizada);
        return atualizada;
    }

    // Cancelar
    public Reserva cancelar(Long id) {
        Reserva reserva = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reserva não encontrada"));

        reserva.setStatus(Status.CANCELADA);
        Reserva cancelada = repository.save(reserva);
        // wsService.notificarCancelamento(cancelada);
        return cancelada;
    }

    // Excluir (só se cancelada)
    public void excluir(Long id) {
        Reserva reserva = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reserva não encontrada"));

        if (reserva.getStatus() != Status.CANCELADA) {
            throw new RuntimeException("Apenas reservas canceladas podem ser excluídas");
        }

        repository.delete(reserva);
        // wsService.notificarExclusao(id, "Reserva excluída");
    }

    public List<Reserva> listar() {
        return repository.findAllByOrderByIdDesc();
    }

    // Buscar por ID
    public Reserva buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reserva não encontrada"));
    }

    // Resumo para Home
    public Map<String, Object> obterResumo() {
        long totalAtivas = repository.countByStatus(Status.ATIVA);

        // Ocupação por laboratório
        Map<String, String> ocupacao = new HashMap<>();
        for (Lab lab : Lab.values()) {
            long ocupadas = repository.countByLaboratorioAndStatus(lab, Status.ATIVA);
            ocupacao.put(lab.name().replace("_", "-"), ocupadas + "/15");
        }

        Map<String, Object> resumo = new HashMap<>();
        resumo.put("dataHoraServidor", LocalDateTime.now());
        resumo.put("reservasAtivas", totalAtivas);
        resumo.put("ocupacaoAtivaPorLaboratorio", ocupacao);

        return resumo;
    }

}
