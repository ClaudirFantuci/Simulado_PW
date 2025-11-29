package controller;

import lombok.RequiredArgsConstructor;
import model.Reserva;

import org.springframework.web.bind.annotation.*;

import Service.ReservaService;
import enums.Lab;
import enums.Periodo;
import enums.Status;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reservas")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ReservaController {

    private final ReservaService service;

    @PostMapping
    public Reserva criar(@RequestBody Reserva reserva) {
        return service.criar(reserva);
    }

    @PutMapping("/{id}")
    public Reserva atualizar(@PathVariable Long id, @RequestBody Reserva reserva) {
        return service.atualizar(id, reserva);
    }

    @PatchMapping("/{id}/cancelar")
    public Reserva cancelar(@PathVariable Long id) {
        return service.cancelar(id);
    }

    @DeleteMapping("/{id}")
    public Map<String, String> excluir(@PathVariable Long id) {
        service.excluir(id);
        return Map.of("mensagem", "Reserva excluída com sucesso");
    }

    @GetMapping
    public List<Reserva> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public Reserva buscar(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @GetMapping("/resumo-home")
    public Map<String, Object> resumo() {
        return service.obterResumo();
    }
}