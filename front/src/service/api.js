import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});





export const criarReserva = async (dados) => {
    const response = await api.post('/reservas', dados);
    return response.data;
};

export const atualizarReserva = async (id, dados) => {
    const response = await api.put(`/reservas/${id}`, dados);
    return response.data;
};

export const cancelarReserva = async (id) => {
    const response = await api.patch(`/reservas/${id}/cancelar`);
    return response.data;
};

export const excluirReserva = async (id) => {
    const response = await api.delete(`/reservas/${id}`);
    return response.data;
};

export const listarReservas = async (filtros = {}) => {
    const params = new URLSearchParams();
    if (filtros.laboratorio) params.append('laboratorio', filtros.laboratorio);
    if (filtros.periodo) params.append('periodo', filtros.periodo);
    if (filtros.status) params.append('status', filtros.status);

    const response = await api.get(`/reservas?${params.toString()}`);
    return response.data;
};

export const buscarReservaPorId = async (id) => {
    const response = await api.get(`/reservas/${id}`);
    return response.data;
};

export const obterResumoHome = async () => {
    const response = await api.get('/reservas/resumo-home');
    return response.data;
};

export default api;