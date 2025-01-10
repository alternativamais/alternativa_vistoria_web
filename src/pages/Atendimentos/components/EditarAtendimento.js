/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { Box, Button, Modal, TextField, Select, MenuItem, FormControl, InputLabel, Checkbox, FormControlLabel } from '@mui/material';
import { api } from 'services/api';
import { notification } from 'components/notification/index';

const formatDateToDatetimeLocal = (date) => {
  if (!date) return '';
  const formattedDate = new Date(date).toISOString();
  return formattedDate.slice(0, 16);
};

const EditarAtendimento = ({ open, onClose, onSuccess, atendimento }) => {
  const [formData, setFormData] = useState({
    veiculoId: atendimento?.veiculoId || '',
    vistorias: atendimento?.vistorias || [],
    status: atendimento?.status || 'pendente',
    kmSaida: atendimento?.kmSaida || '',
    kmChegada: atendimento?.kmChegada || '',
    horarioSaida: formatDateToDatetimeLocal(atendimento?.horarioSaida),
    horarioChegada: formatDateToDatetimeLocal(atendimento?.horarioChegada),
    observacao: atendimento?.observacao || ''
  });

  const [veiculos, setVeiculos] = useState([]);

  const [vistoriasDisponiveis, setVistoriasDisponiveis] = useState([]);

  const [novaVistoria, setNovaVistoria] = useState('');

  const [step, setStep] = useState(1);

  useEffect(() => {
    if (open) {
      fetchVeiculos();
      fetchVistorias();
    }
    if (atendimento) {
      setFormData({
        veiculoId: atendimento.veiculoId || '',
        vistorias: atendimento.vistorias || [],
        status: atendimento.status || 'pendente',
        kmSaida: atendimento.kmSaida || '',
        kmChegada: atendimento.kmChegada || '',
        horarioSaida: formatDateToDatetimeLocal(atendimento.horarioSaida),
        horarioChegada: formatDateToDatetimeLocal(atendimento.horarioChegada),
        observacao: atendimento.observacao || ''
      });
    }
  }, [open, atendimento]);

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
      const response = await api.get('/vistorias');
      setVistoriasDisponiveis(response.data);
    } catch (error) {
      notification({ message: 'Erro ao buscar vistorias!', type: 'error' });
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name.includes('km') ? parseInt(value, 10) || '' : value
    }));
  };

  const handleVistoriaStatusChange = (vistoriaId, concluido) => {
    const updatedVistorias = formData.vistorias.map((vistoria) =>
      vistoria.vistoriaId === vistoriaId ? { ...vistoria, concluido } : vistoria
    );
    setFormData((prev) => ({ ...prev, vistorias: updatedVistorias }));
  };

  const addVistoria = () => {
    if (!novaVistoria) {
      notification({ message: 'Selecione uma vistoria para adicionar.', type: 'warning' });
      return;
    }

    const vistoria = vistoriasDisponiveis.find((v) => v.id === novaVistoria);

    if (vistoria && !formData.vistorias.some((v) => v.vistoriaId === vistoria.id)) {
      setFormData((prev) => ({
        ...prev,
        vistorias: [
          ...prev.vistorias,
          {
            id: null,
            vistoriaId: vistoria.id,
            nomeCliente: vistoria.nomeCliente,
            concluido: false
          }
        ]
      }));
      setNovaVistoria('');
    } else {
      notification({ message: 'Vistoria já adicionada ou inválida.', type: 'info' });
    }
  };

  const removeVistoria = (vistoriaId) => {
    const updatedVistorias = formData.vistorias.filter((vist) => vist.vistoriaId !== vistoriaId);
    setFormData((prev) => ({ ...prev, vistorias: updatedVistorias }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...formData,
        vistorias: formData.vistorias.map((v) => ({
          id: v.id,
          vistoriaId: v.vistoriaId,
          concluido: v.concluido
        }))
      };

      await api.put(`/atendimentos/${atendimento.id}`, payload);
      onSuccess();
      onClose();
      notification({ message: 'Atendimento editado com sucesso!', type: 'success' });
    } catch (error) {
      notification({
        message: 'Erro ao editar atendimento. Verifique os dados e tente novamente.',
        type: 'error'
      });
    }
  };

  const handleNextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const handlePreviousStep = () => {
    setStep((prevStep) => prevStep - 1);
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="modal-editar-atendimento" aria-describedby="modal-editar-atendimento-descricao">
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
        <h2 id="modal-editar-atendimento">Editar Atendimento</h2>

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
              InputLabelProps={{
                shrink: true
              }}
            />
            <TextField
              label="Horário de Chegada"
              name="horarioChegada"
              type="datetime-local"
              value={formData.horarioChegada}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{
                shrink: true
              }}
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
            {formData.vistorias.map((vistoria) => (
              <Box key={vistoria.vistoriaId} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={vistoria.concluido || false}
                      onChange={(e) => handleVistoriaStatusChange(vistoria.vistoriaId, e.target.checked)}
                    />
                  }
                  label={`${vistoria.nomeCliente || 'Vistoria'} - ${vistoria.vistoriaId}`}
                />
                <Button onClick={() => removeVistoria(vistoria.vistoriaId)} color="error">
                  Remover
                </Button>
              </Box>
            ))}

            <FormControl fullWidth>
              <InputLabel id="nova-vistoria-label">Adicionar Vistoria</InputLabel>
              <Select labelId="nova-vistoria-label" value={novaVistoria} onChange={(e) => setNovaVistoria(e.target.value)}>
                {vistoriasDisponiveis
                  .filter((v) => !formData.vistorias.some((vist) => vist.vistoriaId === v.id))
                  .map((vistoria) => (
                    <MenuItem key={vistoria.id} value={vistoria.id}>
                      {vistoria.nomeCliente}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>

            <Button onClick={addVistoria} variant="outlined" color="primary">
              Adicionar Vistoria
            </Button>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button onClick={handlePreviousStep} color="secondary">
                Voltar
              </Button>
              <Button onClick={handleSubmit} variant="contained" color="primary">
                Salvar
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default EditarAtendimento;
