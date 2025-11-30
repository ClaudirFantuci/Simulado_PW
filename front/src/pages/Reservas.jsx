import React, { useState, useEffect } from 'react';
import FormReserva from '../components/FormReserva';
import {
    listarReservas,
    criarReserva,
    atualizarReserva,
    cancelarReserva,
    excluirReserva,
} from '../service/api';
import websocketService from '../service/websocket';
import './Reservas.css';

const Reservas = () => {
    const [reservas, setReservas] = useState([]);
    const [reservaSelecionada, setReservaSelecionada] = useState(null);
    const [loading, setLoading] = useState(false);
    const [mensagem, setMensagem] = useState(null);
    const [filtros, setFiltros] = useState({
        laboratorio: '',
        periodo: '',
        status: '',
    });

    useEffect(() => {
        carregarReservas();

        // Conectar ao WebSocket
        websocketService.connect(handleWebSocketMessage);

        return () => {
            websocketService.disconnect();
        };
    }, []);

    const handleWebSocketMessage = (notificacao) => {
        mostrarMensagem(`Notificação: ${notificacao.mensagem}`, 'info');
        carregarReservas(); // Atualiza a lista
    };

    const carregarReservas = async () => {
        try {
            setLoading(true);
            const dados = await listarReservas(filtros);
            setReservas(dados);
        } catch (error) {
            mostrarMensagem(error.message, 'erro');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitForm = async (formData) => {
        try {
            setLoading(true);

            if (reservaSelecionada) {
                const response = await atualizarReserva(reservaSelecionada.id, formData);
                mostrarMensagem(response.mensagem, 'sucesso');
            } else {
                const response = await criarReserva(formData);
                mostrarMensagem(response.mensagem, 'sucesso');
            }

            setReservaSelecionada(null);
            await carregarReservas();
        } catch (error) {
            mostrarMensagem(error.message, 'erro');
        } finally {
            setLoading(false);
        }
    };

    const handleEditar = (reserva) => {
        setReservaSelecionada(reserva);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelarReserva = async (id) => {
        if (!window.confirm('Deseja realmente cancelar esta reserva?')) return;

        try {
            setLoading(true);
            const response = await cancelarReserva(id);
            mostrarMensagem(response.mensagem, 'sucesso');
            await carregarReservas();
        } catch (error) {
            mostrarMensagem(error.message, 'erro');
        } finally {
            setLoading(false);
        }
    };

    const handleExcluir = async (id) => {
        if (!window.confirm('Deseja realmente excluir esta reserva? Esta ação não pode ser desfeita.')) return;

        try {
            setLoading(true);
            const response = await excluirReserva(id);
            mostrarMensagem(response.mensagem, 'sucesso');
            await carregarReservas();
        } catch (error) {
            mostrarMensagem(error.message, 'erro');
        } finally {
            setLoading(false);
        }
    };

    const handleFiltroChange = (e) => {
        const { name, value } = e.target;
        setFiltros(prev => ({ ...prev, [name]: value }));
    };

    const aplicarFiltros = () => {
        carregarReservas();
    };

    const limparFiltros = () => {
        setFiltros({ laboratorio: '', periodo: '', status: '' });
        setTimeout(() => carregarReservas(), 100);
    };

    const mostrarMensagem = (texto, tipo) => {
        setMensagem({ texto, tipo });
        setTimeout(() => setMensagem(null), 5000);
    };

    const formatarDataHora = (dataHora) => {
        return new Date(dataHora).toLocaleString('pt-BR');
    };

    const getStatusBadge = (status) => {
        return status === 'ATIVA' ? 'badge-ativa' : 'badge-cancelada';
    };

    return (
        <div className="reservas-container">
            {mensagem && (
                <div className={`mensagem mensagem-${mensagem.tipo}`}>
                    {mensagem.texto}
                </div>
            )}

            <FormReserva
                reservaSelecionada={reservaSelecionada}
                onSubmit={handleSubmitForm}
                onCancelar={() => setReservaSelecionada(null)}
            />

            <div className="filtros-container">
                <h3>Filtros</h3>
                <div className="filtros-grid">
                    <select name="laboratorio" value={filtros.laboratorio} onChange={handleFiltroChange}>
                        <option value="">Todos os Laboratórios</option>
                        <option value="LAB_1">LAB-1</option>
                        <option value="LAB_2">LAB-2</option>
                        <option value="LAB_3">LAB-3</option>
                        <option value="LAB_4">LAB-4</option>
                        <option value="LAB_5">LAB-5</option>
                    </select>

                    <select name="periodo" value={filtros.periodo} onChange={handleFiltroChange}>
                        <option value="">Todos os Períodos</option>
                        <option value="MANHA">Manhã</option>
                        <option value="TARDE">Tarde</option>
                        <option value="NOITE">Noite</option>
                    </select>

                    <select name="status" value={filtros.status} onChange={handleFiltroChange}>
                        <option value="">Todos os Status</option>
                        <option value="ATIVA">Ativa</option>
                        <option value="CANCELADA">Cancelada</option>
                    </select>

                    <button className="btn btn-primary" onClick={aplicarFiltros}>Aplicar</button>
                    <button className="btn btn-secondary" onClick={limparFiltros}>Limpar</button>
                </div>
            </div>

            <div className="tabela-container">
                <h3>Lista de Reservas ({reservas.length})</h3>

                {loading && <div className="loading">Carregando...</div>}

                {!loading && reservas.length === 0 && (
                    <div className="empty-state">Nenhuma reserva encontrada</div>
                )}

                {!loading && reservas.length > 0 && (
                    <div className="table-responsive">
                        <table className="table-reservas">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Laboratório</th>
                                    <th>Dia</th>
                                    <th>Período</th>
                                    <th>Solicitante</th>
                                    <th>Status</th>
                                    <th>Observação</th>
                                    <th>Criado Em</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reservas.map(reserva => (
                                    <tr key={reserva.id}>
                                        <td>{reserva.id}</td>
                                        <td><strong>{reserva.laboratorio.replace('_', '-')}</strong></td>
                                        <td>{reserva.diaSemana}</td>
                                        <td>{reserva.periodo}</td>
                                        <td>{reserva.solicitante}</td>
                                        <td>
                                            <span className={`badge ${getStatusBadge(reserva.status)}`}>
                                                {reserva.status}
                                            </span>
                                        </td>
                                        <td className="observacao-cell">
                                            {reserva.observacao || '-'}
                                        </td>
                                        <td>{formatarDataHora(reserva.criadoEm)}</td>
                                        <td>
                                            <div className="acoes-cell">
                                                {reserva.status === 'ATIVA' && (
                                                    <>
                                                        <button
                                                            className="btn-acao btn-editar"
                                                            onClick={() => handleEditar(reserva)}
                                                            title="Editar"
                                                        >
                                                            Editar
                                                        </button>
                                                        <button
                                                            className="btn-acao btn-cancelar"
                                                            onClick={() => handleCancelarReserva(reserva.id)}
                                                            title="Cancelar"
                                                        >
                                                            Cancelar
                                                        </button>
                                                    </>
                                                )}
                                                {reserva.status === 'CANCELADA' && (
                                                    <button
                                                        className="btn-acao btn-excluir"
                                                        onClick={() => handleExcluir(reserva.id)}
                                                        title="Excluir"
                                                    >
                                                        Excluir
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Reservas;