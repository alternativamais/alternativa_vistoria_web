/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { Box, Button, Modal, Step, StepLabel, Stepper, Typography } from '@mui/material';
import DadosOS from './DadosOS';
import Checklist from './Checklist';
import UploadImagens from './UploadImagens'; // Importação do componente de upload
import { api } from 'services/api';

const Etapas = ['Dados da OS', 'Checklist', 'Upload de Imagens'];

const EditarVistoria = ({ open, onClose, onSuccess, vistoria }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    tipoVistoria: '',
    nomeCliente: '',
    enderecoCliente: '',
    coordenadasCto: '',
    coordenadasEnderecoCliente: '',
    resumoVistoria: '',
    status: ''
  });
  const [checklistData, setChecklistData] = useState([]);
  const [checklistSelections, setChecklistSelections] = useState({});
  // const [enviado, setEnviado] = useState(false);

  // Carrega os dados da vistoria e do checklist
  useEffect(() => {
    if (vistoria) {
      setFormData({
        tipoVistoria: vistoria.tipoVistoria || '',
        nomeCliente: vistoria.nomeCliente || '',
        enderecoCliente: vistoria.enderecoCliente || '',
        coordenadasCto: vistoria.coordenadasCto || '',
        coordenadasEnderecoCliente: vistoria.coordenadasEnderecoCliente || '',
        resumoVistoria: vistoria.resumoVistoria || '',
        status: vistoria.status || ''
      });
      fetchChecklistData();
      fetchLinkedChecklist(vistoria.id);
    }
  }, [vistoria]);

  const fetchChecklistData = async () => {
    try {
      const response = await api.get('/checklist');
      setChecklistData(response.data);
    } catch (error) {
      console.error('Erro ao buscar checklists:', error);
      alert('Erro ao buscar checklists. Tente novamente.');
    }
  };

  const fetchLinkedChecklist = async (vistoriaId) => {
    try {
      const response = await api.get(`/checklist-vistorias/vistoria/${vistoriaId}`);
      const linked = response.data.reduce((acc, item) => {
        acc[item.checklist.id] = { situacao: item.situacao, motivo: item.motivo, status: item.status, id: item.id };
        return acc;
      }, {});
      setChecklistSelections(linked);
    } catch (error) {
      console.error('Erro ao buscar checklists vinculados:', error);
    }
  };

  const handleSituacaoChange = (checklistId, situacao, motivo = '') => {
    setChecklistSelections((prev) => ({
      ...prev,
      [checklistId]: {
        ...prev[checklistId],
        situacao, // Atualiza a situação
        motivo // Atualiza o motivo
      }
    }));
  };

  const handleSave = async () => {
    try {
      await api.put(`/vistorias/${vistoria.id}`, formData);

      for (const checklistId of Object.keys(checklistSelections)) {
        const { situacao, motivo, id } = checklistSelections[checklistId];
        if (!situacao) {
          alert(`Checklist ID ${checklistId} está sem situação. Verifique antes de salvar.`);
          return;
        }

        if (id) {
          await api.put(`/checklist-vistorias/${id}`, {
            vistoria: Number(vistoria.id),
            checklist: Number(checklistId),
            situacao,
            motivo: situacao === 'impossibilitado' ? motivo : '',
            status: true
          });
        } else {
          await api.post('/checklist-vistorias', {
            vistoria: Number(vistoria.id),
            checklist: Number(checklistId),
            situacao,
            motivo: situacao === 'impossibilitado' ? motivo : '',
            status: true
          });
        }
      }

      alert('Dados salvos com sucesso!');
      onSuccess();
      handleClose();
    } catch (error) {
      console.error('Erro ao salvar os dados:', error);
      alert('Erro ao salvar os dados. Verifique e tente novamente.');
    }
  };

  const handleClose = () => {
    // setEnviado(false);
    setActiveStep(0);
    onClose();
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNext = () => {
    if (activeStep < Etapas.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return <DadosOS formData={formData} handleChange={handleChange} />;
      case 1:
        return (
          <Checklist
            checklistData={checklistData}
            checklistSelections={checklistSelections}
            handleSituacaoChange={handleSituacaoChange}
            vistoria={vistoria}
          />
        );
      case 2:
        return (
          <UploadImagens
            idVistoria={vistoria?.id}
            onSuccess={() => alert('Imagens enviadas com sucesso!')}
            // setEnviado={setEnviado}
          />
        );
      default:
        return <Typography>Etapa desconhecida.</Typography>;
    }
  };

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="modal-editar-vistoria" aria-describedby="modal-editar-vistoria-descricao">
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
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {Etapas.map((label, index) => (
            <Step key={index}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Box component="form" noValidate autoComplete="off" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {renderStepContent(activeStep)}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button onClick={handleBack} disabled={activeStep === 0}>
              Voltar
            </Button>
            {activeStep === Etapas.length - 1 ? (
              <Button
                onClick={handleSave}
                variant="contained"
                color="primary"
                // disabled={!enviado}
              >
                Salvar Tudo
              </Button>
            ) : (
              <Button onClick={handleNext} variant="contained" color="primary">
                Avançar
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditarVistoria;
