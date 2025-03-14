/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { Box, Button, Modal, Step, StepLabel, Stepper, Typography } from '@mui/material';
import ClienteInfo from './ClienteInfo';
import MetragemAndChecklist from './MetragemAndChecklist';
import UploadImagens from './UploadImagens';
import ResumoStatus from './ResumoStatus';
import { api } from 'services/api';
import { notification } from 'components/notification/index';

const Etapas = ['Dados do Cliente', 'Metragem e Checklist', 'Upload de Imagens', 'Resumo e Status'];

const EditarVistoria = ({ open, onClose, onSuccess, vistoria }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    tipoVistoria: null,
    nomeCliente: null,
    enderecoCliente: null,
    coordenadasCto: null,
    coordenadasEnderecoCliente: null,
    resumoVistoria: null,
    status: null,
    metragemCabo: null,
    assinaturaEletronica: false
  });
  const [checklistData, setChecklistData] = useState([]);
  const [checklistSelections, setChecklistSelections] = useState({});

  useEffect(() => {
    if (vistoria) {
      setFormData({
        tipoVistoria: vistoria.tipoVistoria || null,
        nomeCliente: vistoria.nomeCliente || null,
        enderecoCliente: vistoria.enderecoCliente || null,
        coordenadasCto: vistoria.coordenadasCto || null,
        coordenadasEnderecoCliente: vistoria.coordenadasEnderecoCliente || null,
        resumoVistoria: vistoria.resumoVistoria || null,
        status: vistoria.status || null,
        metragemCabo: vistoria.metragemCabo || null,
        assinaturaEletronica: vistoria.assinaturaEletronica || false
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
      notification({ message: 'Erro ao buscar checklists. Tente novamente!', type: 'error' });
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
      notification({ message: 'Erro ao buscar checklists vinculados!', type: 'error' });
    }
  };

  const handleSituacaoChange = (checklistId, situacao, motivo = null) => {
    setChecklistSelections((prev) => ({
      ...prev,
      [checklistId]: {
        ...prev[checklistId],
        situacao,
        motivo
      }
    }));
  };

  const handleSave = async () => {
    try {
      const updatedFormData = { ...formData };

      if (updatedFormData.status === 'vistoriado ok') {
        updatedFormData.dataHoraConclusao = new Date().toISOString();
      }

      await api.put(`/vistorias/${vistoria.id}`, updatedFormData);

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
            motivo: situacao === 'impossibilitado' ? motivo : null,
            status: true
          });
        } else {
          await api.post('/checklist-vistorias', {
            vistoria: Number(vistoria.id),
            checklist: Number(checklistId),
            situacao,
            motivo: situacao === 'impossibilitado' ? motivo : null,
            status: true
          });
        }
      }

      notification({ message: 'Dados salvos com sucesso!', type: 'success' });
      onSuccess();
      // Se for a última etapa, fecha o modal; caso contrário, permanece aberto.
      if (activeStep === Etapas.length - 1) {
        handleClose();
      }
    } catch (error) {
      notification({ message: 'Erro ao salvar os dados. Verifique e tente novamente!', type: 'error' });
    }
  };

  const handleClose = () => {
    setActiveStep(0);
    onClose();
  };

  const handleChange = (event) => {
    const { name, value, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'metragemCabo' ? Number(value) : name === 'assinaturaEletronica' ? checked : value
    }));
  };

  const handleStatusChange = (event) => {
    const novoStatus = event.target.value;
    handleChange(event);
    if (novoStatus === 'correcao pendente de agendamento') {
      const agora = new Date();
      const formattedDate = agora.toISOString().slice(0, 19).replace('T', ' ');
      handleChange({ target: { name: 'dataHoraConclusao', value: formattedDate } });
    }
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
        return <ClienteInfo formData={formData} handleChange={handleChange} vistoria={vistoria} />;
      case 1:
        return (
          <MetragemAndChecklist
            formData={formData}
            handleChange={handleChange}
            checklistData={checklistData}
            checklistSelections={checklistSelections}
            handleSituacaoChange={handleSituacaoChange}
            vistoria={vistoria}
          />
        );
      case 2:
        return <UploadImagens idVistoria={vistoria?.id} />;
      case 3:
        return <ResumoStatus formData={formData} handleChange={handleChange} handleStatusChange={handleStatusChange} />;
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
            {activeStep > 0 && (
              <Button onClick={handleBack} variant="outlined">
                Voltar
              </Button>
            )}
            {/* Botão de salvar permanece em todas as etapas, mas só fecha o modal na última */}
            <Button onClick={handleSave} variant="contained" color="primary">
              Salvar
            </Button>
            {activeStep < Etapas.length - 1 && (
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
