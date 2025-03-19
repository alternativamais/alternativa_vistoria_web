/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { Box, Button, Modal, TextField, IconButton, Checkbox, FormControlLabel } from '@mui/material';
import { api } from 'services/api';
import { notification } from 'components/notification';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';

const EditarChecklistVistoriaFerramentas = ({ open, onClose, onSuccess, checklist }) => {
  const [nome, setNome] = useState('');
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (open && checklist) {
      setNome(checklist.nome);
      setItems(
        checklist.items && checklist.items.length > 0
          ? checklist.items.map((item) => ({
              ...item,
              tag: item.tag || '',
              remove_valor: item.remove_valor || false
            }))
          : []
      );
    }
  }, [open, checklist]);

  useEffect(() => {
    if (!open) {
      setNome('');
      setItems([]);
    }
  }, [open]);

  const handleAddItem = () => {
    setItems([...items, { titulo: 'Novo item do checklist', tag: '', remove_valor: false }]);
  };

  const handleItemChange = (index, field, value) => {
    const novosItems = items.map((item, i) => (i === index ? { ...item, [field]: value } : item));
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
      // Atualiza os itens existentes, incluindo remove_valor
      await api.put(`/checklist-vistoria-ferramentas/${checklist.id}`, {
        nome,
        items: existingItems.map((item) => ({
          id: item.id,
          titulo: item.titulo,
          tag: item.tag,
          remove_valor: item.remove_valor
        }))
      });

      // Cria novos itens, incluindo remove_valor
      if (newItems.length > 0) {
        await Promise.all(
          newItems.map((item) =>
            api.post('/checklist-vistoria-ferramentas/item', {
              checklist_id: checklist.id,
              titulo: item.titulo,
              tag: item.tag,
              remove_valor: item.remove_valor
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
          gap: 2,
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
        <h2 id="modal-editar-checklist">Editar Checklist</h2>
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
                  padding: 2,
                  borderRadius: '8px',
                  marginBottom: 1,
                  backgroundColor: '#f9f9f9'
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <TextField
                    label={`Item ${index + 1} - Título`}
                    value={item.titulo}
                    onChange={(e) => handleItemChange(index, 'titulo', e.target.value)}
                    fullWidth
                  />
                  <TextField
                    label={`Item ${index + 1} - Tag (opcional)`}
                    value={item.tag}
                    onChange={(e) => handleItemChange(index, 'tag', e.target.value)}
                    fullWidth
                  />
                  <FormControlLabel
                    control={
                      <Checkbox checked={item.remove_valor} onChange={(e) => handleItemChange(index, 'remove_valor', e.target.checked)} />
                    }
                    label="Remove Valor"
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <IconButton onClick={() => handleDeleteItem(index, item)}>
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
              Atualizar
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditarChecklistVistoriaFerramentas;
