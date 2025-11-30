import React, { useState, useEffect } from 'react';
import './FormReserva.css';

const LABORATORIOS = ['LAB_1', 'LAB_2', 'LAB_3', 'LAB_4', 'LAB_5'];
const DIAS_SEMANA = ['SEG', 'TER', 'QUA', 'QUI', 'SEX'];
const PERIODOS = ['MANHA', 'TARDE', 'NOITE'];

const FormReserva = ({ reservaSelecionada, onSubmit, onCancelar }) => {
    const [formData, setFormData] = useState({
        laboratorio: '',
        diaSemana: '',
        periodo: '',
        solicitante: '',
        observacao: '',
    });

    const isEdicao = Boolean(reservaSelecionada);

    useEffect(() => {
        if (reservaSelecionada) {
            setFormData({
                laboratorio: reservaSelecionada.laboratorio || '',
                diaSemana: reservaSelecionada.diaSemana || '',
                periodo: reservaSelecionada.periodo || '',
                solicitante: reservaSelecionada.solicitante || '',
                observacao: reservaSelecionada.observacao || '',
            });
        } else {
            limparForm();
        }
    }, [reservaSelecionada]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validação básica
        if (!formData.laboratorio || !formData.diaSemana || !formData.periodo || !formData.solicitante) {
            alert('Preencha todos os campos obrigatórios');
            return;
        }

        onSubmit(formData);
    };

    const limparForm = () => {
        setFormData({
            laboratorio: '',
            diaSemana: '',
            periodo: '',
            solicitante: '',
            observacao: '',
        });
    };

    const handleCancelar = () => {
        limparForm();
        if (onCancelar) onCancelar();
    };

    return (
        <div className="form-container">
            <h3>{isEdicao ? 'Editar Reserva' : ' Nova Reserva'}</h3>

            <form onSubmit={handleSubmit} className="form-reserva">
                <div className="form-row">
                    <div className="form-group">
                        <label>Laboratório *</label>
                        <select
                            name="laboratorio"
                            value={formData.laboratorio}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Selecione...</option>
                            {LABORATORIOS.map(lab => (
                                <option key={lab} value={lab}>
                                    {lab.replace('_', '-')}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Dia da Semana *</label>
                        <select
                            name="diaSemana"
                            value={formData.diaSemana}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Selecione...</option>
                            {DIAS_SEMANA.map(dia => (
                                <option key={dia} value={dia}>{dia}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Período *</label>
                        <select
                            name="periodo"
                            value={formData.periodo}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Selecione...</option>
                            {PERIODOS.map(per => (
                                <option key={per} value={per}>
                                    {per.charAt(0) + per.slice(1).toLowerCase()}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Solicitante *</label>
                        <input
                            type="text"
                            name="solicitante"
                            value={formData.solicitante}
                            onChange={handleChange}
                            placeholder="Nome do solicitante"
                            required
                            disabled={isEdicao}
                            title={isEdicao ? 'Não é possível alterar o solicitante' : ''}
                        />
                        {isEdicao && (
                            <small className="help-text">⚠️ Campo imutável em edição</small>
                        )}
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group full-width">
                        <label>Observação</label>
                        <textarea
                            name="observacao"
                            value={formData.observacao}
                            onChange={handleChange}
                            placeholder="Observações adicionais (opcional)"
                            rows="3"
                            maxLength="500"
                        />
                        <small className="help-text">
                            {formData.observacao.length}/500 caracteres
                        </small>
                    </div>
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn btn-primary">
                        {isEdicao ? 'Atualizar' : 'Salvar'}
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={handleCancelar}>
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FormReserva;