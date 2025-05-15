/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { Autocomplete, Box, Button, Modal, TextField, InputLabel, useTheme, useMediaQuery } from '@mui/material';
import { api } from 'services/api';
import { notification } from 'components/notification';

const DualListFerramentasSelector = ({ allFerramentas, selectedIds, onChange }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [availableSelected, setAvailableSelected] = useState([]);
  const [selectedSelected, setSelectedSelected] = useState([]);
  const [availableSearch, setAvailableSearch] = useState('');
  const [selectedSearch, setSelectedSearch] = useState('');

  const availableList = allFerramentas.filter((f) => !selectedIds.includes(f.id));
  const selectedList = allFerramentas.filter((f) => selectedIds.includes(f.id));

  const filteredAvailable = availableList.filter((item) => item.nome.toLowerCase().includes(availableSearch.toLowerCase()));
  const filteredSelected = selectedList.filter((item) => item.nome.toLowerCase().includes(selectedSearch.toLowerCase()));

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
          minHeight: 150,
          maxHeight: 250,
          overflowY: 'auto'
        }}
      >
        <InputLabel sx={{ mb: 1 }}>Disponíveis</InputLabel>
        <TextField
          size="small"
          placeholder="Pesquisar..."
          value={availableSearch}
          onChange={(e) => setAvailableSearch(e.target.value)}
          fullWidth
          sx={{ mb: 1 }}
        />
        {filteredAvailable.map((item) => (
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
          minHeight: 150,
          maxHeight: 250,
          overflowY: 'auto'
        }}
      >
        <InputLabel sx={{ mb: 1 }}>Selecionados</InputLabel>
        <TextField
          size="small"
          placeholder="Pesquisar..."
          value={selectedSearch}
          onChange={(e) => setSelectedSearch(e.target.value)}
          fullWidth
          sx={{ mb: 1 }}
        />
        {filteredSelected.map((item) => (
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

const CriarTecnico = ({ open, onClose, onSuccess }) => {
  const [nome, setNome] = useState('');
  const [ferramentaIds, setFerramentaIds] = useState([]);
  const [ferramentas, setFerramentas] = useState([]);
  const [tecNames, setTecNames] = useState([]);

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

  useEffect(() => {
    if (!open) return;
    const fetchTecNames = async () => {
      try {
        const response = await api.get('/sgp-integration/tecnicos_search');
        const nomes = response.data.tecnicos.map((t) => t.nome);
        setTecNames(nomes);
      } catch (error) {
        notification({
          message: 'Erro ao buscar técnicos!',
          type: 'error'
        });
      }
    };
    fetchTecNames();
  }, [open]);

  useEffect(() => {
    if (!open) {
      setNome('');
      setFerramentaIds([]);
    }
  }, [open]);

  const handleSubmit = async () => {
    try {
      const payload = {
        nome,
        ferramentaIds
      };
      await api.post('/tecnicos', payload);
      notification({ message: 'Técnico criado com sucesso!', type: 'success' });
      onSuccess();
      onClose();
    } catch (error) {
      notification({ message: 'Erro ao criar técnico. Verifique os dados e tente novamente!', type: 'error' });
    }
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="modal-criar-tecnico" aria-describedby="modal-criar-tecnico-descricao">
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
        <h2 id="modal-criar-tecnico">Criar Novo Técnico</h2>
        <Box component="form" noValidate autoComplete="off" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Autocomplete do nome */}
          <Autocomplete
            freeSolo
            options={tecNames}
            value={nome}
            onChange={(_, newValue) => setNome(newValue || '')}
            inputValue={nome}
            onInputChange={(_, newInput) => setNome(newInput)}
            renderInput={(params) => <TextField {...params} label="Nome" fullWidth size="small" />}
            ListboxProps={{
              style: {
                maxHeight: 200,
                overflowY: 'auto'
              }
            }}
          />

          {/* Dual List para seleção de Ferramentas */}
          <DualListFerramentasSelector allFerramentas={ferramentas} selectedIds={ferramentaIds} onChange={setFerramentaIds} />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button onClick={onClose} color="secondary">
              Cancelar
            </Button>
            <Button onClick={handleSubmit} variant="contained" color="primary">
              Criar
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default CriarTecnico;
