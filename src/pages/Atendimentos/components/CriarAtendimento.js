/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { Box, Button, Modal, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { api } from 'services/api';
import { notification } from 'components/notification/index';
import { useAuth } from 'hooks/auth';

const CriarAtendimento = ({ open, onClose, onSuccess }) => {
  const { user } = useAuth();

  const initialFormData = {
    veiculoId: '',
    vistorias: [],
    status: 'aberta',
    kmSaida: '',
    kmChegada: '',
    horarioSaida: '',
    horarioChegada: '',
    observacao: ''
  };

  const [vistoriaInputs, setVistoriaInputs] = useState([{ vistoriaId: '' }]);

  const [formData, setFormData] = useState(initialFormData);
  const [veiculos, setVeiculos] = useState([]);
  const [vistoriasDisponiveis, setVistoriasDisponiveis] = useState([]);
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (open) {
      fetchVeiculos();
      fetchVistorias();
    } else {
      resetForm();
    }
  }, [open]);

  const resetForm = () => {
    setFormData(initialFormData);

    setVistoriaInputs([{ vistoriaId: '' }]);
    setStep(1);
  };

  const fetchVeiculos = async () => {
    try {
      const response = await api.get('/veiculos');
      setVeiculos(response.data);
    } catch (error) {
      notification({ message: 'Erro ao buscar veículos!', type: 'error' });
    }
  };

  const fetchVistorias = async () => {
    try {
      const response = await api.get(`/vistorias/user/${user.id}`);
      setVistoriasDisponiveis(response.data);
    } catch (error) {
      notification({ message: 'Erro ao buscar vistorias!', type: 'error' });
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: name.includes('km') ? parseInt(value, 10) || '' : value
    });
  };

  const handleVistoriaChange = (index, vistoriaId) => {
    const newVistorias = [...vistoriaInputs];
    newVistorias[index] = { vistoriaId, concluido: false };
    setVistoriaInputs(newVistorias);
  };

  const addVistoria = () => {
    const last = vistoriaInputs[vistoriaInputs.length - 1];
    if (!last.vistoriaId) return;

    setVistoriaInputs([...vistoriaInputs, { vistoriaId: '' }]);
  };

  const removeVistoria = (index) => {
    const newVistorias = vistoriaInputs.filter((_, i) => i !== index);
    setVistoriaInputs(newVistorias);
  };

  const availableOptions = (index) => {
    const alreadySelected = new Set(
      vistoriaInputs
        .filter((_, i) => i !== index)
        .map((item) => item.vistoriaId)
        .filter((id) => id !== '')
    );

    return vistoriasDisponiveis.filter((vistoria) => !alreadySelected.has(vistoria.id));
  };

  const isAddButtonDisabled = () => {
    const last = vistoriaInputs[vistoriaInputs.length - 1];
    return !last.vistoriaId || availableOptions(-1).length === 0;
  };

  const handleNextStep = () => {
    setStep((prev) => prev + 1);
  };

  const handlePreviousStep = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...formData,

        vistorias: vistoriaInputs
          .filter((item) => item.vistoriaId)
          .map((item) => ({
            vistoriaId: item.vistoriaId,
            concluido: item.concluido || false
          }))
      };

      await api.post('/atendimentos', payload);
      notification({ message: 'Atendimento criado com sucesso!', type: 'success' });
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erro ao criar atendimento:', error);
      notification({ message: 'Erro ao criar atendimento. Verifique os dados e tente novamente!', type: 'error' });
    }
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="modal-criar-atendimento" aria-describedby="modal-criar-atendimento-descricao">
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: '8px'
        }}
      >
        <h2 id="modal-criar-atendimento">Criar Novo Atendimento</h2>
        {step === 1 && (
          <Box component="form" noValidate autoComplete="off" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel id="veiculo-label">Veículo</InputLabel>
              <Select labelId="veiculo-label" name="veiculoId" value={formData.veiculoId} onChange={handleChange}>
                {veiculos.map((veiculo) => (
                  <MenuItem key={veiculo.id} value={veiculo.id}>
                    {`${veiculo.modelo} - ${veiculo.marca} (${veiculo.placa})`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField label="KM Saída" name="kmSaida" type="number" value={formData.kmSaida} onChange={handleChange} fullWidth />
            <TextField label="KM Chegada" name="kmChegada" type="number" value={formData.kmChegada} onChange={handleChange} fullWidth />
            <TextField
              label="Horário de Saída"
              name="horarioSaida"
              type="datetime-local"
              value={formData.horarioSaida}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Horário de Chegada"
              name="horarioChegada"
              type="datetime-local"
              value={formData.horarioChegada}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Observação"
              name="observacao"
              value={formData.observacao}
              onChange={handleChange}
              fullWidth
              multiline
              rows={3}
            />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button onClick={onClose} color="secondary">
                Cancelar
              </Button>
              <Button onClick={handleNextStep} variant="contained" color="primary">
                Próximo
              </Button>
            </Box>
          </Box>
        )}

        {step === 2 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {vistoriaInputs.map((item, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FormControl fullWidth>
                  <InputLabel id={`vistoria-label-${index}`}>Vistoria</InputLabel>
                  <Select
                    labelId={`vistoria-label-${index}`}
                    value={item.vistoriaId}
                    onChange={(e) => handleVistoriaChange(index, e.target.value)}
                  >
                    {availableOptions(index).map((vistoria) => (
                      <MenuItem key={vistoria.id} value={vistoria.id}>
                        {vistoria.nomeCliente}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button onClick={() => removeVistoria(index)} color="error">
                  Remover
                </Button>
              </Box>
            ))}

            <Button onClick={addVistoria} variant="outlined" color="primary" disabled={isAddButtonDisabled()}>
              Adicionar Vistoria
            </Button>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button onClick={handlePreviousStep} color="secondary">
                Voltar
              </Button>
              <Button onClick={handleSubmit} variant="contained" color="primary">
                Criar
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default CriarAtendimento;
