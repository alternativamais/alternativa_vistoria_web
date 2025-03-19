/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { Box, Button, Modal, TextField, IconButton, Checkbox, FormControlLabel } from '@mui/material';
import { api } from 'services/api';
import { notification } from 'components/notification';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';

const CriarChecklistVistoriaFerramentas = ({ open, onClose, onSuccess }) => {
  const [nome, setNome] = useState('');
  const [items, setItems] = useState([{ titulo: '', tag: '', remove_valor: false }]);

  useEffect(() => {
    if (!open) {
      setNome('');
      setItems([{ titulo: '', tag: '', remove_valor: false }]);
    }
  }, [open]);

  const handleAddItem = () => {
    setItems([...items, { titulo: '', tag: '', remove_valor: false }]);
  };

  const handleRemoveItem = (index) => {
    const novosItems = items.filter((_, i) => i !== index);
    setItems(novosItems);
  };

  const handleItemFieldChange = (index, field, value) => {
    const novosItems = items.map((item, i) => (i === index ? { ...item, [field]: value } : item));
    setItems(novosItems);
  };

  const handleSubmit = async () => {
    // Filtra os items com título preenchido
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
          gap: 2,
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
        <h2 id="modal-criar-checklist">Criar Novo Checklist</h2>
        <Box component="form" noValidate autoComplete="off" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField label="Nome do Checklist" name="nome" value={nome} onChange={(e) => setNome(e.target.value)} fullWidth />

          {/* Cabeçalho e botão fora da área com scroll */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0 }}>Itens</h3>
            <Button onClick={handleAddItem} variant="outlined" startIcon={<PlusOutlined />}>
              Adicionar Item
            </Button>
          </Box>

          {/* Área com scroll para os itens */}
          <Box sx={{ maxHeight: '300px', overflowY: 'auto', padding: 1 }}>
            {items.map((item, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                  marginBottom: 2,
                  padding: 2,
                  borderRadius: '8px',
                  backgroundColor: '#f9f9f9'
                }}
              >
                <TextField
                  label={`Item ${index + 1} - Título`}
                  value={item.titulo}
                  onChange={(e) => handleItemFieldChange(index, 'titulo', e.target.value)}
                  fullWidth
                />
                <TextField
                  label={`Item ${index + 1} - Tag (opcional)`}
                  value={item.tag}
                  onChange={(e) => handleItemFieldChange(index, 'tag', e.target.value)}
                  fullWidth
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={item.remove_valor}
                      onChange={(e) => handleItemFieldChange(index, 'remove_valor', e.target.checked)}
                    />
                  }
                  label="Remove Valor"
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <IconButton onClick={() => handleRemoveItem(index)}>
                    <DeleteOutlined />
                  </IconButton>
                </Box>
              </Box>
            ))}
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
