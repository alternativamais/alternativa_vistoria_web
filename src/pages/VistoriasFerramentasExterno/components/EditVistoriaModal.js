/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  Divider
} from '@mui/material';
import { EditOutlined } from '@ant-design/icons';
import { api } from 'services/api';
import { notification } from 'components/notification/index';
import ChecklistModal from './ChecklistModal';

const EditVistoriaModal = ({ open, onClose, vistoriaId }) => {
  const [dataVistoria, setDataVistoria] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [openChecklistModal, setOpenChecklistModal] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const steps = ['Itens', 'Assinatura'];
  const sigCanvas = useRef(null);

  useEffect(() => {
    if (open && vistoriaId) {
      buscarVistoria();
      setActiveStep(0);
      if (sigCanvas.current) sigCanvas.current.clear();
    }
  }, [open, vistoriaId]);

  const buscarVistoria = async () => {
    try {
      const response = await api.get(`/vistoria-ferramentas/${vistoriaId}`);
      setDataVistoria(response.data);
    } catch (error) {
      notification({ message: 'Erro ao buscar dados da vistoria!', type: 'error' });
    }
  };

  const handleOpenChecklist = (item) => {
    setSelectedItem(item);
    setOpenChecklistModal(true);
  };

  const handleCloseChecklist = () => {
    setOpenChecklistModal(false);
    setSelectedItem(null);
    buscarVistoria();
  };

  const todosVistoriados = dataVistoria?.itens?.every((item) => item.status === 'Vistoriado');

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleSalvarAssinatura = async () => {
    const signatureBase64 = sigCanvas.current ? sigCanvas.current.toDataURL('image/png') : '';
    try {
      await api.put(`/vistoria-ferramentas/${vistoriaId}`, {
        assinatura: signatureBase64,
        status: 'vistoriado ok'
      });
      notification({ message: 'Assinatura salva com sucesso e vistorias atualizadas!', type: 'success' });
      onClose('editmodal');
    } catch (error) {
      notification({ message: 'Erro ao salvar a assinatura!', type: 'error' });
    }
  };

  const renderStepContent = () => {
    if (activeStep === 0) {
      const itensUnicos =
        dataVistoria?.itens?.length > 0 ? Array.from(new Map(dataVistoria.itens.map((item) => [item.ferramenta_id, item])).values()) : [];
      return (
        <Box sx={{ mt: 2 }}>
          {dataVistoria ? (
            itensUnicos.length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Ferramenta</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }} align="right">
                        Ações
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {itensUnicos.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.tecnicoFerramenta.ferramenta.nome}</TableCell>
                        <TableCell>{item.status || 'Não finalizado'}</TableCell>
                        <TableCell align="right">
                          <Tooltip title="Editar Checklist">
                            <IconButton onClick={() => handleOpenChecklist(item)}>
                              <EditOutlined />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography variant="body2">Nenhuma ferramenta encontrada.</Typography>
            )
          ) : (
            <Typography variant="body2">Carregando...</Typography>
          )}
        </Box>
      );
    } else if (activeStep === 1) {
      return (
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Assinatura do Técnico
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <SignatureCanvas
            ref={sigCanvas}
            penColor="black"
            canvasProps={{
              width: 500,
              height: 200,
              className: 'sigCanvas',
              style: { border: '1px solid #ccc', borderRadius: 4 }
            }}
          />
          <Box sx={{ mt: 1 }}>
            <Button variant="outlined" onClick={() => sigCanvas.current && sigCanvas.current.clear()}>
              Limpar
            </Button>
          </Box>
        </Box>
      );
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle sx={{ textAlign: 'center' }}>Vistorias de Ferramentas</DialogTitle>
        <DialogContent dividers>
          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {renderStepContent()}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', p: 2 }}>
          {activeStep === 1 && (
            <Button onClick={handleBack} variant="outlined" sx={{ mr: 2 }}>
              Voltar
            </Button>
          )}
          {activeStep === 0 && (
            <>
              {todosVistoriados && (
                <Button onClick={handleNext} variant="contained" color="primary" sx={{ mr: 2 }}>
                  Próxima Parte
                </Button>
              )}
              <Button onClick={onClose} variant="outlined">
                Fechar
              </Button>
            </>
          )}
          {activeStep === 1 && (
            <Button onClick={handleSalvarAssinatura} variant="contained" color="primary">
              Salvar Assinatura
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {selectedItem && (
        <ChecklistModal open={openChecklistModal} onClose={handleCloseChecklist} item={selectedItem} vistoriaId={vistoriaId} />
      )}
    </>
  );
};

export default EditVistoriaModal;
