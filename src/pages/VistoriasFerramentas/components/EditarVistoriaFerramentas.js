/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { Box, Button, Modal, TextField, Select, MenuItem, FormControl, InputLabel, useTheme, useMediaQuery } from '@mui/material';
import { api } from 'services/api';
import { notification } from 'components/notification';
import { PlusCircleOutlined, MinusCircleOutlined, UpOutlined, DownOutlined } from '@ant-design/icons';

// Componente reutilizado para seleção dupla de checklists
const DualListChecklistSelector = ({ allChecklists, selectedIds, onChange }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Listas derivadas: disponíveis e selecionados
  const availableList = allChecklists.filter((c) => !selectedIds.includes(c.id));
  const selectedList = allChecklists.filter((c) => selectedIds.includes(c.id));

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

const EditarVistoriaFerramentas = ({ open, onClose, onSuccess, vistoria }) => {
  // Estado do formulário com dados iniciais para edição
  const [formData, setFormData] = useState({
    tecnico_id: '',
    data_vistoria: '',
    status: '',
    items: [] // Cada item: { id, ferramenta_id, comentario, checklistIds, expanded }
  });

  // Estados para dados auxiliares
  const [tecnicos, setTecnicos] = useState([]);
  const [checklistsDisponiveis, setChecklistsDisponiveis] = useState([]);
  const [ferramentas, setFerramentas] = useState([]);

  // Busca a lista de técnicos
  useEffect(() => {
    const fetchTecnicos = async () => {
      try {
        const response = await api.get('/tecnicos');
        setTecnicos(response.data);
      } catch (error) {
        notification({ message: 'Erro ao buscar técnicos!', type: 'error' });
      }
    };
    fetchTecnicos();
  }, []);

  // Busca os checklists disponíveis
  useEffect(() => {
    const fetchChecklists = async () => {
      try {
        const response = await api.get('/checklist-vistoria-ferramentas');
        setChecklistsDisponiveis(response.data);
      } catch (error) {
        notification({ message: 'Erro ao buscar checklists!', type: 'error' });
      }
    };
    fetchChecklists();
  }, []);

  // Busca as ferramentas disponíveis
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

  // Quando a vistoria para edição for carregada, preenche o formulário
  useEffect(() => {
    if (vistoria) {
      setFormData({
        tecnico_id: vistoria.vistoria.tecnico_id.toString(),
        data_vistoria: vistoria.vistoria.data_vistoria,
        status: vistoria.vistoria.status,
        items: vistoria.itens.map((item) => ({
          id: item.id,
          ferramenta_id: item.ferramenta_id.toString(),
          comentario: item.comentario,
          checklistIds: item.checklists ? item.checklists.map((chk) => chk.id) : [],
          expanded: true
        }))
      });
    }
  }, [vistoria]);

  // Reseta o formulário quando o modal fecha
  useEffect(() => {
    if (!open) {
      setFormData({
        tecnico_id: '',
        data_vistoria: '',
        status: '',
        items: []
      });
    }
  }, [open]);

  // Handler para alteração dos campos do formulário
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Handlers para manipulação dos itens
  const handleAddItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: null,
          ferramenta_id: '',
          comentario: '',
          checklistIds: [],
          expanded: true
        }
      ]
    }));
  };

  // Função para remover um item do formulário.
  // Se o item possuir um ID (persistido), é chamada a rota DELETE para removê-lo.
  const handleRemoveItem = async (index) => {
    const item = formData.items[index];
    if (item.id) {
      if (window.confirm('Deseja realmente remover este item?')) {
        try {
          await api.delete(`/vistoria-ferramentas/${vistoria.vistoria.id}/itens/${item.id}`);
          notification({ message: 'Item removido com sucesso!', type: 'success' });
        } catch (error) {
          notification({ message: 'Erro ao remover o item!', type: 'error' });
          return;
        }
      } else {
        return;
      }
    }
    // Remove o item do estado (persistido ou não)
    setFormData((prev) => {
      const newItems = [...prev.items];
      newItems.splice(index, 1);
      return { ...prev, items: newItems };
    });
  };

  const handleItemChange = (index, field, value) => {
    setFormData((prev) => {
      const newItems = [...prev.items];
      newItems[index] = { ...newItems[index], [field]: value };
      return { ...prev, items: newItems };
    });
  };

  const toggleItemExpansion = (index) => {
    setFormData((prev) => {
      const newItems = [...prev.items];
      newItems[index].expanded = !newItems[index].expanded;
      return { ...prev, items: newItems };
    });
  };

  // Ao enviar, primeiro atualiza a vistoria com os itens existentes (com id definido)
  // Em seguida, para cada novo item (id nulo), cria o item via POST na rota
  // /vistoria-ferramentas/{vistoriaId}/itens com payload incluindo checklistIds.
  const handleSubmit = async () => {
    try {
      const existingItems = formData.items.filter((item) => item.id !== null);
      const newItems = formData.items.filter((item) => item.id === null);

      // Atualiza a vistoria com os itens existentes, incluindo checklistIds
      const payload = {
        tecnico_id: Number(formData.tecnico_id),
        data_vistoria: formData.data_vistoria,
        status: formData.status,
        items: existingItems.map((item) => ({
          id: item.id,
          ferramenta_id: Number(item.ferramenta_id),
          comentario: item.comentario,
          checklistIds: item.checklistIds // Agora incluindo a atualização dos checklists
        }))
      };

      await api.put(`/vistoria-ferramentas/${vistoria.vistoria.id}`, payload);

      // Para cada novo item, cria o item via POST com o payload que inclui checklistIds
      for (let novo of newItems) {
        const novoPayload = {
          ferramenta_id: Number(novo.ferramenta_id),
          comentario: novo.comentario,
          checklistIds: novo.checklistIds
        };
        await api.post(`/vistoria-ferramentas/${vistoria.vistoria.id}/itens`, novoPayload);
      }

      onSuccess();
      onClose();
      notification({ message: 'Vistoria atualizada com sucesso!', type: 'success' });
    } catch (error) {
      notification({
        message: 'Erro ao atualizar vistoria. Verifique os dados e tente novamente!',
        type: 'error'
      });
    }
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="modal-editar-vistoria" aria-describedby="modal-editar-vistoria-descricao">
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90vw', sm: '70vw', md: '600px' },
          maxHeight: '90vh',
          overflowY: 'auto',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: '8px'
        }}
      >
        <h2 id="modal-editar-vistoria">Editar Vistoria de Ferramentas</h2>
        <Box component="form" noValidate autoComplete="off" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Técnico */}
          <FormControl fullWidth>
            <InputLabel id="tecnico-label">Técnico</InputLabel>
            <Select labelId="tecnico-label" name="tecnico_id" value={formData.tecnico_id} onChange={handleChange} label="Técnico">
              {tecnicos.map((tec) => (
                <MenuItem key={tec.id} value={tec.id}>
                  {tec.nome}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Data da Vistoria */}
          <TextField
            label="Data da Vistoria"
            name="data_vistoria"
            type="date"
            value={formData.data_vistoria}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />

          {/* Status */}
          <FormControl fullWidth>
            <InputLabel id="status-label">Status</InputLabel>
            <Select labelId="status-label" name="status" value={formData.status} onChange={handleChange} label="Status">
              <MenuItem value="a vistoriar">A Vistoriar</MenuItem>
              <MenuItem value="cancelado">Cancelado</MenuItem>
              <MenuItem value="pendente de agendamento">Pendente de Agendamento</MenuItem>
              <MenuItem value="vistoriado ok">Vistoriado OK</MenuItem>
            </Select>
          </FormControl>

          {/* Itens */}
          <Box>
            <h3>Itens</h3>
            {formData.items.map((item, index) => (
              <Box
                key={index}
                sx={{
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  p: 2,
                  mb: 2
                }}
              >
                {/* Cabeçalho com toggle de expansão */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 1,
                    cursor: 'pointer'
                  }}
                  onClick={() => toggleItemExpansion(index)}
                >
                  <span>Item {index + 1}</span>
                  <span>{item.expanded ? <UpOutlined /> : <DownOutlined />}</span>
                </Box>
                {item.expanded && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {/* Seleção da Ferramenta */}
                    <FormControl fullWidth>
                      <InputLabel id={`ferramenta-label-${index}`}>Ferramenta</InputLabel>
                      <Select
                        labelId={`ferramenta-label-${index}`}
                        name="ferramenta_id"
                        value={item.ferramenta_id}
                        onChange={(e) => handleItemChange(index, 'ferramenta_id', e.target.value)}
                        label="Ferramenta"
                      >
                        {ferramentas.map((ferramenta) => (
                          <MenuItem key={ferramenta.id} value={ferramenta.id}>
                            {ferramenta.nome}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <TextField
                      label="Comentário"
                      name="comentario"
                      value={item.comentario}
                      onChange={(e) => handleItemChange(index, 'comentario', e.target.value)}
                      fullWidth
                    />
                    {/* Dual List para Checklists */}
                    <DualListChecklistSelector
                      allChecklists={checklistsDisponiveis}
                      selectedIds={item.checklistIds}
                      onChange={(newSelected) => handleItemChange(index, 'checklistIds', newSelected)}
                    />
                  </Box>
                )}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1, gap: 1 }}>
                  <Button onClick={() => handleRemoveItem(index)} color="error" startIcon={<MinusCircleOutlined />}>
                    Remover Item
                  </Button>
                </Box>
              </Box>
            ))}
            <Button onClick={handleAddItem} variant="outlined" startIcon={<PlusCircleOutlined />}>
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

export default EditarVistoriaFerramentas;
