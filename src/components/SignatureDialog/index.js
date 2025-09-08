/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Dialog, AppBar, Toolbar, IconButton, Typography, Button, Box } from '@mui/material';
import { DeleteOutlined } from '@ant-design/icons';
import { api } from 'services/api';
import { notification } from 'components/notification';

const SignatureDialog = ({ open, onClose, saveRoute, onSuccess }) => {
  const sigCanvas = useRef(null);

  const handleClear = () => {
    if (sigCanvas.current) sigCanvas.current.clear();
  };

  const handleSave = async () => {
    const signatureBase64 = sigCanvas.current ? sigCanvas.current.toDataURL('image/png') : '';
    try {
      await api.put(saveRoute, {
        assinatura: signatureBase64,
        status: 'vistoriado ok'
      });
      notification({
        message: 'Assinatura salva com sucesso!',
        type: 'success'
      });
      onClose();
      onSuccess();
    } catch (error) {
      notification({ message: 'Erro ao salvar a assinatura!', type: 'error' });
    }
  };

  return (
    <Dialog fullScreen open={open} onClose={onClose}>
      <AppBar position="static" color="default">
        <Toolbar>
          <IconButton edge="start" onClick={onClose}>
            <DeleteOutlined />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center' }}>
            Assinatura do Técnico
          </Typography>
          <Button onClick={handleSave} variant="contained">
            Salvar
          </Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Box
          sx={{
            flex: 1,
            border: '1px solid #ccc',
            m: 2,
            borderRadius: 1,
            position: 'relative'
          }}
        >
          <SignatureCanvas ref={sigCanvas} penColor="black" canvasProps={{ style: { width: '100%', height: '100%' } }} />
        </Box>
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Button onClick={handleClear} variant="outlined">
            Limpar
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default SignatureDialog;
