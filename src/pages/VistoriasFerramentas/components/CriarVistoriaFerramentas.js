/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Modal,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useTheme,
  useMediaQuery,
  Typography
} from '@mui/material';
import { api } from 'services/api';
import { notification } from 'components/notification';
import { PlusCircleOutlined, MinusCircleOutlined, UpOutlined, DownOutlined } from '@ant-design/icons';

const DualListChecklistSelector = ({ allChecklists, selectedIds, onChange }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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

const CriarVistoriaFerramentas = ({ open, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    tecnico_id: '',
    data_vistoria: '',
    status: 'pendente de agendamento',
    items: []
  });

  const [tecnicos, setTecnicos] = useState([]);

  const [checklistsDisponiveis, setChecklistsDisponiveis] = useState([]);

  const [ferramentas, setFerramentas] = useState([]);

  useEffect(() => {
    const fetchTecnicos = async () => {
      try {
        const response = await api.get('/tecnicos');
        // Filtra os técnicos para não exibir os deletados
        const tecnicosAtivos = response.data.filter((tec) => tec.status === 'ativo');
        setTecnicos(tecnicosAtivos);
      } catch (error) {
        notification({ message: 'Erro ao buscar técnicos!', type: 'error' });
      }
    };
    fetchTecnicos();
  }, []);

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

  useEffect(() => {
    const fetchFerramentas = async () => {
      try {
        if (formData.tecnico_id) {
          const response = await api.get(`/ferramentas/tecnico/${formData.tecnico_id}`);
          setFerramentas(response.data.ferramentas);
        } else {
          setFerramentas([]);
        }
      } catch (error) {
        notification({ message: 'Erro ao buscar ferramentas!', type: 'error' });
      }
    };
    fetchFerramentas();
  }, [formData.tecnico_id]);

  useEffect(() => {
    if (!open) {
      setFormData({
        tecnico_id: '',
        data_vistoria: '',
        status: 'pendente de agendamento',
        items: []
      });
      setFerramentas([]);
    }
  }, [open]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          ferramenta_id: '',
          comentario: '',
          checklistIds: [],
          expanded: true
        }
      ]
    }));
  };

  const handleRemoveItem = (index) => {
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

  const getFerramentasDisponiveisParaItem = (currentItemIndex) => {
    const selecionadasEmOutros = formData.items
      .filter((_, idx) => idx !== currentItemIndex)
      .map((item) => Number(item.ferramenta_id))
      .filter(Boolean);
    const currentSelected = Number(formData.items[currentItemIndex]?.ferramenta_id);
    return ferramentas.filter((ferramenta) => ferramenta.id === currentSelected || !selecionadasEmOutros.includes(ferramenta.id));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        tecnico_id: Number(formData.tecnico_id),
        data_vistoria: formData.data_vistoria,
        status: formData.status,
        items: formData.items.map((item) => {
          const newItem = {
            ferramenta_id: Number(item.ferramenta_id),
            comentario: item.comentario
          };
          if (item.checklistIds && item.checklistIds.length > 0) {
            newItem.checklistIds = item.checklistIds;
          }
          return newItem;
        })
      };

      await api.post('/vistoria-ferramentas', payload);
      onSuccess();
      onClose();
      notification({ message: 'Vistoria criada com sucesso!', type: 'success' });
    } catch (error) {
      notification({
        message: 'Erro ao criar vistoria. Verifique os dados e tente novamente!',
        type: 'error'
      });
    }
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="modal-criar-vistoria" aria-describedby="modal-criar-vistoria-descricao">
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
        <h2 id="modal-criar-vistoria">Criar Nova Vistoria de Ferramentas</h2>
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

          {/* Itens de Vistoria */}
          <Box>
            <h3>Ferramentas</h3>
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
                  <Box component="span">Item {index + 1}</Box>
                  <Box component="span">{item.expanded ? <UpOutlined /> : <DownOutlined />}</Box>
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
                        {getFerramentasDisponiveisParaItem(index).map((ferramenta) => (
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
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                  <Button onClick={() => handleRemoveItem(index)} color="error" startIcon={<MinusCircleOutlined />}>
                    Remover Item
                  </Button>
                </Box>
              </Box>
            ))}
            {/* Verifica se o técnico possui ferramentas para permitir adicionar um item */}
            {formData.tecnico_id && ferramentas.length > 0 ? (
              <Button onClick={handleAddItem} variant="outlined" startIcon={<PlusCircleOutlined />}>
                Adicionar Ferramenta
              </Button>
            ) : formData.tecnico_id ? (
              <Typography variant="body2" color="textSecondary">
                O técnico não possui ferramentas para vistoriar.
              </Typography>
            ) : null}
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

export default CriarVistoriaFerramentas;
