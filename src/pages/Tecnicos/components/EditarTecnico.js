/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { Box, Button, Modal, TextField, InputLabel, useTheme, useMediaQuery } from '@mui/material';
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
            onClick={() =>
              availableSelected.includes(item.id)
                ? setAvailableSelected(availableSelected.filter((id) => id !== item.id))
                : setAvailableSelected([...availableSelected, item.id])
            }
          >
            {item.nome}
          </Box>
        ))}
      </Box>

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
            onClick={() =>
              selectedSelected.includes(item.id)
                ? setSelectedSelected(selectedSelected.filter((id) => id !== item.id))
                : setSelectedSelected([...selectedSelected, item.id])
            }
          >
            {item.nome}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

const EditarTecnico = ({ open, onClose, onSuccess, tecnico }) => {
  const [nome, setNome] = useState('');
  const [ferramentaIds, setFerramentaIds] = useState([]);
  const [ferramentas, setFerramentas] = useState([]);

  useEffect(() => {
    const fetchFerramentas = async () => {
      try {
        const { data } = await api.get('/ferramentas');
        setFerramentas(data);
      } catch {
        notification({
          message: 'Erro ao buscar ferramentas!',
          type: 'error'
        });
      }
    };
    fetchFerramentas();
  }, []);

  useEffect(() => {
    if (tecnico) {
      setNome(tecnico.nome);
      const ids = (tecnico.ferramentas || []).map((f) => f.idFerramenta);
      setFerramentaIds(ids);
    }
  }, [tecnico]);

  useEffect(() => {
    if (!open) {
      setFerramentaIds([]);
    }
  }, [open]);

  const handleSubmit = async () => {
    try {
      await api.put(`/tecnicos/${tecnico.id}`, {
        nome,
        ferramentaIds
      });
      notification({
        message: 'Técnico atualizado com sucesso!',
        type: 'success'
      });
      onSuccess();
      onClose();
    } catch {
      notification({
        message: 'Erro ao atualizar técnico. Verifique os dados!',
        type: 'error'
      });
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
          <TextField label="Nome" value={nome} fullWidth size="small" disabled />

          <DualListFerramentasSelector allFerramentas={ferramentas} selectedIds={ferramentaIds} onChange={setFerramentaIds} />

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 2
            }}
          >
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
