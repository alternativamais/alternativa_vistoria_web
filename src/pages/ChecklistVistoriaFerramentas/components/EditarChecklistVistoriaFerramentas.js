/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { Box, Button, Modal, TextField, IconButton } from '@mui/material';
import { api } from 'services/api';
import { notification } from 'components/notification';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';

const EditarChecklistVistoriaFerramentas = ({ open, onClose, onSuccess, checklist }) => {
  const [nome, setNome] = useState('');
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (open && checklist) {
      setNome(checklist.nome);
      setItems(checklist.items && checklist.items.length > 0 ? checklist.items : []);
    }
  }, [open, checklist]);

  useEffect(() => {
    if (!open) {
      setNome('');
      setItems([]);
    }
  }, [open]);

  const handleAddItem = () => {
    setItems([...items, { titulo: 'Novo item do checklist' }]);
  };

  const handleItemChange = (index, value) => {
    const novosItems = items.map((item, i) => (i === index ? { ...item, titulo: value } : item));
    setItems(novosItems);
  };

  const handleDeleteItem = async (index, item) => {
    if (item.id) {
      if (window.confirm('Deseja realmente deletar este item?')) {
        try {
          await api.delete(`/checklist-vistoria-ferramentas/item/${item.id}`);
          notification({ message: 'Item deletado com sucesso!', type: 'success' });
          const novosItems = items.filter((_, i) => i !== index);
          setItems(novosItems);
          onSuccess();
        } catch (error) {
          notification({ message: 'Erro ao deletar o item!', type: 'error' });
        }
      }
    } else {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async () => {
    const filteredItems = items.filter((item) => item.titulo.trim() !== '');
    const existingItems = filteredItems.filter((item) => item.id);
    const newItems = filteredItems.filter((item) => !item.id);

    try {
      await api.put(`/checklist-vistoria-ferramentas/${checklist.id}`, {
        nome,
        items: existingItems
      });

      if (newItems.length > 0) {
        await Promise.all(
          newItems.map((item) =>
            api.post('/checklist-vistoria-ferramentas/item', {
              checklist_id: checklist.id,
              titulo: item.titulo
            })
          )
        );
      }
      notification({ message: 'Checklist atualizado com sucesso!', type: 'success' });
      onSuccess();
      onClose();
    } catch (error) {
      notification({
        message: 'Erro ao atualizar checklist. Verifique os dados e tente novamente!',
        type: 'error'
      });
    }
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="modal-editar-checklist" aria-describedby="modal-editar-checklist-descricao">
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
        <h2 id="modal-editar-checklist">Editar Checklist</h2>
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
                <IconButton onClick={() => handleDeleteItem(index, item)}>
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
              Atualizar
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditarChecklistVistoriaFerramentas;
