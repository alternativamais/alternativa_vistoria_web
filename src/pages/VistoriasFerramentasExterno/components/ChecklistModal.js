/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Checkbox,
  Typography,
  Grid,
  FormGroup,
  FormControlLabel,
  Stepper,
  Step,
  StepLabel,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { api } from 'services/api';
import { notification } from 'components/notification/index';
import UploadImagens from './UploadImagens';

const steps = ['Checklists', 'Subir Imagens', 'Comentários', 'Status'];

const ChecklistModal = ({ open, onClose, item, vistoriaId }) => {
  const [activeStep, setActiveStep] = useState(0);
  // Armazena o estado atual da checklist
  const [checklistData, setChecklistData] = useState(item.checklists || []);
  // Armazena o estado inicial para comparação ao enviar as alterações
  const initialChecklistData = useRef(item.checklists || []);
  const [expandedGroups, setExpandedGroups] = useState({});
  const [comentario, setComentario] = useState(item.comentario || '');
  // Estado para o campo status, com valor inicial padrão ou vindo do item
  const [status, setStatus] = useState(item.status || 'Em andamento');

  // Atualiza o estado local do item da checklist
  const updateChecklistItem = (checklistId, itemId, newMarked) => {
    setChecklistData((prevData) =>
      prevData.map((checklist) => {
        if (checklist.id === checklistId) {
          return {
            ...checklist,
            items: checklist.items.map((ci) => (ci.id === itemId ? { ...ci, marked: newMarked } : ci))
          };
        }
        return checklist;
      })
    );
  };

  // Ao clicar num item, apenas atualiza o estado local (não chama API)
  const handleToggleItem = (checklistId, checklistItem) => {
    updateChecklistItem(checklistId, checklistItem.id, !checklistItem.marked);
  };

  // Ao clicar no checkbox do grupo, alterna todos os itens localmente
  const handleToggleGroup = (checklist) => {
    const allChecked = checklist.items.every((ci) => ci.marked);
    checklist.items.forEach((ci) => {
      updateChecklistItem(checklist.id, ci.id, !allChecked);
    });
  };

  const handleAccordionChange = (checklistId) => (event, isExpanded) => {
    setExpandedGroups((prev) => ({ ...prev, [checklistId]: isExpanded }));
  };

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleClose = () => {
    setActiveStep(0);
    onClose();
  };

  // Ao clicar em "Concluir", compara o estado atual com o inicial e envia as alterações em lote
  const handleSubmit = async () => {
    try {
      const vistoriaItemId = item.id;
      const checklistItemIdsToMark = [];
      const checklistItemIdsToUnmark = [];

      // Percorre cada checklist para identificar alterações
      initialChecklistData.current.forEach((initialChecklist) => {
        const currentChecklist = checklistData.find((ch) => ch.id === initialChecklist.id);
        if (currentChecklist) {
          initialChecklist.items.forEach((initialItem) => {
            const currentItem = currentChecklist.items.find((ci) => ci.id === initialItem.id);
            if (currentItem && currentItem.marked !== initialItem.marked) {
              if (currentItem.marked) {
                checklistItemIdsToMark.push(currentItem.id);
              } else {
                checklistItemIdsToUnmark.push(currentItem.id);
              }
            }
          });
        }
      });

      // Se houver itens para marcar, envia em lote
      if (checklistItemIdsToMark.length > 0) {
        await api.post('/checklist-vistoria-ferramentas/mark-multiple', {
          vistoriaItemId,
          checklistItemIds: checklistItemIdsToMark
        });
      }

      // Se houver itens para desmarcar, envia em lote
      if (checklistItemIdsToUnmark.length > 0) {
        await api.post('/checklist-vistoria-ferramentas/unmark-multiple', {
          vistoriaItemId,
          checklistItemIds: checklistItemIdsToUnmark
        });
      }

      // Atualiza os demais dados (como comentário, status, etc.)
      const payload = {
        items: [
          {
            id: item.id,
            comentario: comentario,
            status: status
          }
        ]
      };
      await api.put(`/vistoria-ferramentas/${vistoriaId}`, payload);
      notification({ message: 'Dados atualizados com sucesso!', type: 'success' });
      handleClose();
    } catch (error) {
      notification({ message: 'Erro ao atualizar dados!', type: 'error' });
    }
  };

  // Renderiza o conteúdo de cada step
  const renderStepContent = () => {
    if (activeStep === 0) {
      return (
        <>
          {checklistData && checklistData.length > 0 ? (
            checklistData.map((checklist, index, array) => {
              const allChecked = checklist.items.every((ci) => ci.marked);
              const someChecked = checklist.items.some((ci) => ci.marked);
              const isFirst = index === 0;
              const isLast = index === array.length - 1;
              return (
                <Accordion
                  key={checklist.id}
                  expanded={expandedGroups[checklist.id] || false}
                  onChange={handleAccordionChange(checklist.id)}
                  style={{
                    borderTopLeftRadius: isFirst ? '8px' : 0,
                    borderTopRightRadius: isFirst ? '8px' : 0,
                    borderBottomLeftRadius: isLast ? '8px' : 0,
                    borderBottomRightRadius: isLast ? '8px' : 0,
                    border: '1px solid #E2E2E2FF',
                    margin: 0
                  }}
                >
                  <AccordionSummary
                    aria-controls={`checklist-${checklist.id}-content`}
                    id={`checklist-${checklist.id}-header`}
                    style={{
                      backgroundColor: '#FFFFFFFF',
                      borderTopLeftRadius: isFirst ? '8px' : 0,
                      borderTopRightRadius: isFirst ? '8px' : 0,
                      borderBottomLeftRadius: isLast ? '8px' : 0,
                      borderBottomRightRadius: isLast ? '8px' : 0,
                      height: 10
                    }}
                  >
                    <Box display="flex" alignItems="center">
                      <Checkbox
                        checked={allChecked}
                        indeterminate={someChecked && !allChecked}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleGroup(checklist);
                        }}
                        onFocus={(e) => e.stopPropagation()}
                      />
                      <Typography
                        component="span"
                        variant="subtitle1"
                        sx={{
                          textTransform: 'uppercase',
                          fontWeight: 'bold',
                          fontSize: '15px'
                        }}
                      >
                        {checklist.nome}
                      </Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <FormGroup>
                      <Grid container>
                        {checklist.items.map((ci) => (
                          <Grid item xs={12} sm={6} md={4} key={ci.id}>
                            <FormControlLabel
                              control={<Checkbox checked={ci.marked} onChange={() => handleToggleItem(checklist.id, ci)} />}
                              label={ci.titulo}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </FormGroup>
                  </AccordionDetails>
                </Accordion>
              );
            })
          ) : (
            <Typography variant="body2">Nenhum checklist disponível.</Typography>
          )}
        </>
      );
    } else if (activeStep === 1) {
      // Renderiza o componente de UploadImagens passando o ID correto para upload
      return (
        <UploadImagens
          vistoriaFerramentaItemId={item.id}
          onSuccess={() => {
            notification({ message: 'Upload concluído!', type: 'success' });
          }}
        />
      );
    } else if (activeStep === 2) {
      return (
        <Box p={3}>
          <Typography variant="h6" gutterBottom>
            Comentários da Ferramenta
          </Typography>
          <TextField
            label="Digite o comentário"
            multiline
            fullWidth
            minRows={3}
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            variant="outlined"
          />
        </Box>
      );
    } else if (activeStep === 3) {
      return (
        <Box p={3}>
          <Typography variant="h6" gutterBottom>
            Status da Vistoria
          </Typography>
          <FormControl fullWidth variant="outlined">
            <InputLabel id="status-label">Status</InputLabel>
            <Select labelId="status-label" label="Status" value={status} onChange={(e) => setStatus(e.target.value)}>
              <MenuItem value="Vistoriado">Vistoriado</MenuItem>
              <MenuItem value="Em andamento">Em andamento</MenuItem>
            </Select>
          </FormControl>
        </Box>
      );
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Checklist - {item.ferramenta_nome}</DialogTitle>
      <DialogContent dividers>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {renderStepContent()}
      </DialogContent>
      <DialogActions>
        {activeStep > 0 && (
          <Button onClick={handleBack} color="primary">
            Voltar
          </Button>
        )}
        {activeStep < steps.length - 1 ? (
          <Button onClick={handleNext} color="primary">
            Avançar
          </Button>
        ) : (
          <Button onClick={handleSubmit} color="primary">
            Salvar
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ChecklistModal;
