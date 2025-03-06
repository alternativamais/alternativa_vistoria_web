/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { Box, Button, Modal, TextField } from '@mui/material';
import { api } from 'services/api';
import { notification } from 'components/notification';

const EditarFerramenta = ({ open, onClose, onSuccess, ferramenta }) => {
  const [nome, setNome] = useState('');
  const [valor, setValor] = useState('');
  const [numeroNotaFiscal, setNumeroNotaFiscal] = useState('');
  const [localCompra, setLocalCompra] = useState('');
  const [dataCompra, setDataCompra] = useState('');

  useEffect(() => {
    if (ferramenta) {
      setNome(ferramenta.nome);
      setValor(ferramenta.valor);
      setNumeroNotaFiscal(ferramenta.numero_nota_fiscal);
      setLocalCompra(ferramenta.local_compra);
      setDataCompra(ferramenta.data_compra);
    }
  }, [ferramenta]);

  useEffect(() => {
    if (!open) {
      setNome('');
      setValor('');
      setNumeroNotaFiscal('');
      setLocalCompra('');
      setDataCompra('');
    }
  }, [open]);

  const handleSubmit = async () => {
    try {
      await api.put(`/ferramentas/${ferramenta.id}`, {
        nome,
        valor: parseFloat(valor),
        numero_nota_fiscal: numeroNotaFiscal,
        local_compra: localCompra,
        data_compra: dataCompra
      });
      notification({ message: 'Ferramenta atualizada com sucesso!', type: 'success' });
      onSuccess();
      onClose();
    } catch (error) {
      notification({ message: 'Erro ao atualizar ferramenta. Verifique os dados e tente novamente!', type: 'error' });
    }
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="modal-editar-ferramenta" aria-describedby="modal-editar-ferramenta-descricao">
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
          borderRadius: '8px'
        }}
      >
        <h2 id="modal-editar-ferramenta">Editar Ferramenta</h2>
        <Box component="form" noValidate autoComplete="off" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField label="Nome" name="nome" value={nome} onChange={(e) => setNome(e.target.value)} fullWidth />
          <TextField label="Valor" name="valor" type="number" value={valor} onChange={(e) => setValor(e.target.value)} fullWidth />
          <TextField
            label="Número Nota Fiscal"
            name="numeroNotaFiscal"
            value={numeroNotaFiscal}
            onChange={(e) => setNumeroNotaFiscal(e.target.value)}
            fullWidth
          />
          <TextField
            label="Local de Compra"
            name="localCompra"
            value={localCompra}
            onChange={(e) => setLocalCompra(e.target.value)}
            fullWidth
          />
          <TextField
            label="Data de Compra"
            name="dataCompra"
            type="date"
            value={dataCompra}
            onChange={(e) => setDataCompra(e.target.value)}
            InputLabelProps={{
              shrink: true
            }}
            fullWidth
          />
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

export default EditarFerramenta;
