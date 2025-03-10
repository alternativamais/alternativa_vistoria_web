/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
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
  Typography
} from '@mui/material';
import { EditOutlined } from '@ant-design/icons';
import { api } from 'services/api';
import { notification } from 'components/notification/index';
import ChecklistModal from './ChecklistModal';

const EditVistoriaModal = ({ open, onClose, vistoriaId }) => {
  const [dataVistoria, setDataVistoria] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [openChecklistModal, setOpenChecklistModal] = useState(false);

  useEffect(() => {
    if (open && vistoriaId) {
      buscarVistoria();
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
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle>Vistorias de Ferramentas</DialogTitle>
        <DialogContent dividers>
          {dataVistoria ? (
            dataVistoria.itens && dataVistoria.itens.length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Ferramenta</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dataVistoria.itens.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.ferramenta_nome}</TableCell>
                        <TableCell>Não finalizado</TableCell>
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
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Fechar
          </Button>
        </DialogActions>
      </Dialog>

      {selectedItem && (
        <ChecklistModal open={openChecklistModal} onClose={handleCloseChecklist} item={selectedItem} vistoriaId={vistoriaId} />
      )}
    </>
  );
};

export default EditVistoriaModal;
