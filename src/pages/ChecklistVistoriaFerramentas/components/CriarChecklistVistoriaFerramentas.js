/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { Box, Button, Modal, TextField, IconButton } from '@mui/material';
import { api } from 'services/api';
import { notification } from 'components/notification';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';

const CriarChecklistVistoriaFerramentas = ({ open, onClose, onSuccess }) => {
  const [nome, setNome] = useState('');
  const [items, setItems] = useState([{ titulo: '' }]);

  useEffect(() => {
    if (!open) {
      setNome('');
      setItems([{ titulo: '' }]);
    }
  }, [open]);

  const handleAddItem = () => {
    setItems([...items, { titulo: '' }]);
  };

  const handleRemoveItem = (index) => {
    const novosItems = items.filter((_, i) => i !== index);
    setItems(novosItems);
  };

  const handleItemChange = (index, value) => {
    const novosItems = items.map((item, i) => (i === index ? { ...item, titulo: value } : item));
    setItems(novosItems);
  };

  const handleSubmit = async () => {
    const filteredItems = items.filter((item) => item.titulo.trim() !== '');
    try {
      await api.post('/checklist-vistoria-ferramentas/create', {
        checklist: { nome },
        items: filteredItems
      });
      notification({ message: 'Checklist criado com sucesso!', type: 'success' });
      onSuccess();
      onClose();
    } catch (error) {
      notification({
        message: 'Erro ao criar checklist. Verifique os dados e tente novamente!',
        type: 'error'
      });
    }
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="modal-criar-checklist" aria-describedby="modal-criar-checklist-descricao">
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
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <h2 id="modal-criar-checklist">Criar Novo Checklist</h2>
        <Box component="form" noValidate autoComplete="off" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField label="Nome do Checklist" name="nome" value={nome} onChange={(e) => setNome(e.target.value)} fullWidth />
          <Box>
            <h3>Itens</h3>
            {items.map((item, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, marginBottom: 1 }}>
                <TextField
                  label={`Item ${index + 1}`}
                  value={item.titulo}
                  onChange={(e) => handleItemChange(index, e.target.value)}
                  fullWidth
                />
                <IconButton onClick={() => handleRemoveItem(index)}>
                  <DeleteOutlined />
                </IconButton>
              </Box>
            ))}
            <Button onClick={handleAddItem} variant="outlined" startIcon={<PlusOutlined />}>
              Adicionar Item
            </Button>
          </Box>
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

export default CriarChecklistVistoriaFerramentas;
