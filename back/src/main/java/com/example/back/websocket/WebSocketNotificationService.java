package com.example.back.websocket;

import lombok.RequiredArgsConstructor;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;

import com.example.back.model.Reserva;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class WebSocketNotificationService {

    private final SimpMessagingTemplate messagingTemplate;

    public void notificarCriacao(Reserva reserva) {
        Map<String, Object> notificacao = criarNotificacao("CRIADA", reserva);
        messagingTemplate.convertAndSend("/topic/reservas", notificacao);
    }

    public void notificarAtualizacao(Reserva reserva) {
        Map<String, Object> notificacao = criarNotificacao("ATUALIZADA", reserva);
        messagingTemplate.convertAndSend("/topic/reservas", notificacao);
    }

    public void notificarCancelamento(Reserva reserva) {
        Map<String, Object> notificacao = criarNotificacao("CANCELADA", reserva);
        messagingTemplate.convertAndSend("/topic/reservas", notificacao);
    }

    public void notificarExclusao(Long id, String mensagem) {
        Map<String, Object> notificacao = new HashMap<>();
        notificacao.put("tipo", "EXCLUIDA");
        notificacao.put("mensagem", mensagem);
        notificacao.put("reservaId", id);
        messagingTemplate.convertAndSend("/topic/reservas", notificacao);
    }

    private Map<String, Object> criarNotificacao(String tipo, Reserva reserva) {
        Map<String, Object> notificacao = new HashMap<>();
        notificacao.put("tipo", tipo);
        notificacao.put("mensagem", tipo + ": " + reserva.getLaboratorio());
        notificacao.put("reservaId", reserva.getId());
        notificacao.put("laboratorio", reserva.getLaboratorio());
        notificacao.put("diaSemana", reserva.getDiaSemana());
        notificacao.put("periodo", reserva.getPeriodo());
        return notificacao;
    }
}