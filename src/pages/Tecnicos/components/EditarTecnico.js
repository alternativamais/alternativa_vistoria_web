/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { Box, Button, Modal, TextField, InputLabel, useTheme, useMediaQuery } from '@mui/material';
import { api } from 'services/api';
import { notification } from 'components/notification';

// Componente Dual List para seleção de Ferramentas
const DualListFerramentasSelector = ({ allFerramentas, selectedIds, onChange }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Filtra a lista de ferramentas disponíveis e as já selecionadas
  const availableList = allFerramentas.filter((f) => !selectedIds.includes(f.id));
  const selectedList = allFerramentas.filter((f) => selectedIds.includes(f.id));

  const [availableSelected, setAvailableSelected] = useState([]);
  const [selectedSelected, setSelectedSelected] = useState([]);

  const handleAdd = () => {
    const newSelected = Array.from(new Set([...selectedIds, ...availableSelected]));
    onChange(newSelected);
    setAvailableSelected([]);
  };

  const handleRemove = () => {
    const newSelected = selectedIds.filter((id) => !selectedSelected.includes(id));
    onChange(newSelected);
    setSelectedSelected([]);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: 2,
        mt: 1
      }}
    >
      {/* Painel dos disponíveis */}
      <Box
        sx={{
          flex: 1,
          border: '1px solid #ccc',
          borderRadius: 1,
          p: 1,
          minHeight: 150
        }}
      >
        <InputLabel sx={{ mb: 1 }}>Disponíveis</InputLabel>
        {availableList.map((item) => (
          <Box
            key={item.id}
            sx={{
              p: 0.5,
              cursor: 'pointer',
              backgroundColor: availableSelected.includes(item.id) ? '#eee' : 'transparent'
            }}
            onClick={() => {
              if (availableSelected.includes(item.id)) {
                setAvailableSelected(availableSelected.filter((id) => id !== item.id));
              } else {
                setAvailableSelected([...availableSelected, item.id]);
              }
            }}
          >
            {item.nome}
          </Box>
        ))}
      </Box>
      {/* Botões de movimentação */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: isMobile ? 'row' : 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 1
        }}
      >
        <Button onClick={handleAdd} variant="outlined" size="small">
          {isMobile ? 'Adicionar' : '>'}
        </Button>
        <Button onClick={handleRemove} variant="outlined" size="small">
          {isMobile ? 'Remover' : '<'}
        </Button>
      </Box>
      {/* Painel dos selecionados */}
      <Box
        sx={{
          flex: 1,
          border: '1px solid #ccc',
          borderRadius: 1,
          p: 1,
          minHeight: 150
        }}
      >
        <InputLabel sx={{ mb: 1 }}>Selecionados</InputLabel>
        {selectedList.map((item) => (
          <Box
            key={item.id}
            sx={{
              p: 0.5,
              cursor: 'pointer',
              backgroundColor: selectedSelected.includes(item.id) ? '#eee' : 'transparent'
            }}
            onClick={() => {
              if (selectedSelected.includes(item.id)) {
                setSelectedSelected(selectedSelected.filter((id) => id !== item.id));
              } else {
                setSelectedSelected([...selectedSelected, item.id]);
              }
            }}
          >
            {item.nome}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

const EditarTecnico = ({ open, onClose, onSuccess, tecnico }) => {
  // Estados para o formulário
  const [nome, setNome] = useState('');
  const [ferramentaIds, setFerramentaIds] = useState([]);
  const [ferramentas, setFerramentas] = useState([]);

  // Busca a lista de ferramentas disponíveis via GET em /ferramentas
  useEffect(() => {
    const fetchFerramentas = async () => {
      try {
        const response = await api.get('/ferramentas');
        setFerramentas(response.data);
      } catch (error) {
        notification({ message: 'Erro ao buscar ferramentas!', type: 'error' });
      }
    };
    fetchFerramentas();
  }, []);

  // Preenche o formulário com os dados do técnico recebido
  useEffect(() => {
    if (tecnico) {
      setNome(tecnico.nome);
      // Mapeia os ids usando o campo "idFerramenta"
      const ids = (tecnico.ferramentas || []).map((f) => f.idFerramenta);
      setFerramentaIds(ids);
    }
  }, [tecnico]);

  // Reseta o formulário quando o modal é fechado
  useEffect(() => {
    if (!open) {
      setNome('');
      setFerramentaIds([]);
    }
  }, [open]);

  // Handler para atualizar o técnico via PUT em /tecnicos/{id}
  const handleSubmit = async () => {
    try {
      const payload = { nome, ferramentaIds };
      await api.put(`/tecnicos/${tecnico.id}`, payload);
      notification({ message: 'Técnico atualizado com sucesso!', type: 'success' });
      onSuccess();
      onClose();
    } catch (error) {
      notification({ message: 'Erro ao atualizar técnico. Verifique os dados e tente novamente!', type: 'error' });
    }
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="modal-editar-tecnico" aria-describedby="modal-editar-tecnico-descricao">
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90vw', sm: '400px' },
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: '8px'
        }}
      >
        <h2 id="modal-editar-tecnico">Editar Técnico</h2>
        <Box component="form" noValidate autoComplete="off" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField label="Nome" name="nome" value={nome} onChange={(e) => setNome(e.target.value)} fullWidth />
          {/* Dual List para seleção de Ferramentas */}
          <DualListFerramentasSelector allFerramentas={ferramentas} selectedIds={ferramentaIds} onChange={setFerramentaIds} />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button onClick={onClose} color="secondary">
              Cancelar
            </Button>
            <Button onClick={handleSubmit} variant="contained" color="primary">
              Atualizar
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditarTecnico;
