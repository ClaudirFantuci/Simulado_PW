// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { obterResumoHome } from '../service/api';
import './Home.css';

const Home = () => {
    const navigate = useNavigate();
    const [resumo, setResumo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState(null);

    useEffect(() => {
        carregarResumo();
    }, []);

    const carregarResumo = async () => {
        try {
            setLoading(true);
            const dados = await obterResumoHome();
            setResumo(dados);
            setErro(null);
        } catch (error) {
            setErro(error.message);
        } finally {
            setLoading(false);
        }
    };

    const formatarDataHora = (dataHora) => {
        return new Date(dataHora).toLocaleString('pt-BR', {
            dateStyle: 'full',
            timeStyle: 'medium',
        });
    };

    if (loading) {
        return (
            <div className="home-container">
                <div className="loading">Carregando...</div>
            </div>
        );
    }

    if (erro) {
        return (
            <div className="home-container">
                <div className="erro">Erro ao carregar dados: {erro}</div>
            </div>
        );
    }

    return (
        <div className="home-container">
            <div className="welcome-section">
                <h2>Bem-vindo ao Sistema de Reservas</h2>
                <p className="subtitle">Gerencie reservas de laboratórios de forma simples e eficiente</p>

                {resumo && (
                    <div className="datetime-card">
                        <span className="datetime-label">Data e Hora do Servidor:</span>
                        <span className="datetime-value">{formatarDataHora(resumo.dataHoraServidor)}</span>
                    </div>
                )}

                <button
                    className="btn-primary btn-large"
                    onClick={() => navigate('/reservas')}
                >
                    Gerenciar Reservas
                </button>
            </div>

            {resumo && (
                <div className="resumo-section">
                    <h3>Resumo das Reservas</h3>

                    <div className="stat-card">
                        <div className="stat-content">
                            <div className="stat-label">Total de Reservas Ativas</div>
                            <div className="stat-value">{resumo.reservasAtivas}</div>
                        </div>
                    </div>

                    <h4>🔬 Ocupação por Laboratório</h4>
                    <div className="labs-grid">
                        {Object.entries(resumo.ocupacaoAtivaPorLaboratorio).map(([lab, ocupacao]) => {
                            return (
                                <div key={lab} className="lab-card">
                                    <div className="lab-header">
                                        <span className="lab-name">{lab}</span>
                                        <span className="lab-ocupacao">{ocupacao}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;