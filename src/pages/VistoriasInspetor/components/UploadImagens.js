/* eslint-disable react/prop-types */
import React, { useState, useRef } from 'react';
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, LinearProgress, Typography, IconButton } from '@mui/material';
import { DeleteOutlined } from '@ant-design/icons';
import { api } from 'services/api';
import isMobile from 'is-mobile';
import Webcam from 'react-webcam';
import { notification } from 'components/notification/index';

const UploadImagens = ({ idVistoria, onSuccess }) => {
  const [imagens, setImagens] = useState([]);
  const [cameraAtiva, setCameraAtiva] = useState(false);
  const webcamRef = useRef(null);

  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [saveOptionVisible, setSaveOptionVisible] = useState(false);
  const [canCloseModal, setCanCloseModal] = useState(false);

  const isMobileDevice = isMobile();

  const selecionarDaGaleria = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;

    input.onchange = (event) => {
      const arquivos = Array.from(event.target.files);
      const novasImagens = arquivos.map((file) => ({
        file,
        preview: URL.createObjectURL(file)
      }));
      setImagens((prev) => [...prev, ...novasImagens]);
    };
    input.click();
  };

  const abrirCameraNativa = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;

    input.setAttribute('capture', 'environment');
    input.onchange = (event) => {
      const arquivos = Array.from(event.target.files);
      const novasImagens = arquivos.map((file) => ({
        file,
        preview: URL.createObjectURL(file)
      }));
      setImagens((prev) => [...prev, ...novasImagens]);
    };
    input.click();
  };

  const iniciarCamera = () => {
    setCameraAtiva(true);
  };

  const pararCamera = () => {
    setCameraAtiva(false);
  };

  const capturarFoto = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      const file = dataURIToFile(imageSrc, `foto_${Date.now()}.png`);
      setImagens((prev) => [...prev, { file, preview: imageSrc }]);
    } else {
      notification({ message: 'Não foi possível capturar a foto!', type: 'error' });
    }
  };

  const dataURIToFile = (dataURI, fileName) => {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new File([ab], fileName, { type: mimeString });
  };

  const removerImagem = (index) => {
    setImagens((prev) => prev.filter((_, i) => i !== index));
  };

  const salvarImagens = () => {
    imagens.forEach((img, index) => {
      const link = document.createElement('a');
      link.href = img.preview;
      link.download = `imagem_${index + 1}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  const handleUploadImagens = async () => {
    if (!idVistoria) {
      notification({ message: 'ID da vistoria não foi definido!', type: 'error' });
      return;
    }

    const formData = new FormData();
    formData.append('idVistoria', idVistoria);
    imagens.forEach((img) => {
      formData.append('files', img.file);
    });

    setUploadModalOpen(true);
    setUploadProgress(0);
    setSaveOptionVisible(false);
    setCanCloseModal(false);

    const closeModalTimer = setTimeout(() => {
      setCanCloseModal(true);
    }, 5000);

    const saveOptionTimer = setTimeout(() => {
      setSaveOptionVisible(true);
    }, 30000);

    try {
      await api.post('/imagens-vistorias/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });

      clearTimeout(closeModalTimer);
      clearTimeout(saveOptionTimer);
      notification({ message: 'Imagens enviadas com sucesso!', type: 'success' });
      setImagens([]);
      setUploadModalOpen(false);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      clearTimeout(closeModalTimer);
      clearTimeout(saveOptionTimer);
      notification({ message: 'Erro ao enviar imagens. Tente novamente!', type: 'error' });
      setUploadModalOpen(false);
    }
  };

  const imagensEnviadas = Math.floor((uploadProgress / 100) * imagens.length);

  const handleCloseModal = () => {
    if (canCloseModal) {
      setUploadModalOpen(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Opções para desktop */}
      {!isMobileDevice && !cameraAtiva && (
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="contained" color="primary" onClick={iniciarCamera}>
            Abrir Câmera
          </Button>
          <Button variant="contained" color="secondary" onClick={selecionarDaGaleria}>
            Selecionar da Galeria
          </Button>
        </Box>
      )}

      {/* Opções para mobile */}
      {isMobileDevice && !cameraAtiva && (
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="contained" color="primary" onClick={abrirCameraNativa}>
            Abrir Câmera do Celular
          </Button>
          <Button variant="contained" color="secondary" onClick={selecionarDaGaleria}>
            Selecionar da Galeria
          </Button>
        </Box>
      )}

      {cameraAtiva && (
        <Box>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/png"
            videoConstraints={{
              facingMode: 'environment'
            }}
            style={{ width: '100%', maxHeight: 300 }}
          />
          <Box sx={{ display: 'flex', gap: 2, marginTop: 2 }}>
            <Button variant="contained" color="secondary" onClick={capturarFoto}>
              Tirar Foto
            </Button>
            <Button variant="contained" color="error" onClick={pararCamera}>
              Fechar Câmera
            </Button>
          </Box>
        </Box>
      )}

      <Box>
        <Typography variant="h6" style={{ paddingBottom: 15 }}>
          Imagens Capturadas:
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {imagens.map((img, index) => (
            <Box key={index} sx={{ position: 'relative', display: 'inline-block' }}>
              <img src={img.preview} alt={`Imagem ${index + 1}`} style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 4 }} />
              <IconButton
                size="small"
                onClick={() => removerImagem(index)}
                sx={{
                  position: 'absolute',
                  top: -8,
                  right: -8,
                  color: '#ffffff',
                  backgroundColor: '#ff4d4f',
                  '&:hover': {
                    backgroundColor: '#B53638FF'
                  }
                }}
              >
                <DeleteOutlined fontSize="small" />
              </IconButton>
            </Box>
          ))}
        </Box>
      </Box>

      <Button variant="contained" color="primary" onClick={handleUploadImagens} disabled={!imagens.length || !idVistoria}>
        Enviar Imagens
      </Button>

      {/* Modal de upload */}
      <Dialog open={uploadModalOpen} onClose={handleCloseModal}>
        <DialogTitle>Enviando Imagens</DialogTitle>
        <DialogContent>
          <Box sx={{ width: '100%', mb: 2 }}>
            <LinearProgress variant="determinate" value={uploadProgress} />
          </Box>
          <Typography variant="body1">
            {imagensEnviadas} de {imagens.length} imagens enviadas.
          </Typography>
          <Typography variant="body2">Progresso: {uploadProgress}%</Typography>
          {saveOptionVisible && (
            <Typography variant="caption" color="error">
              O upload está demorando. Você pode optar por salvar as imagens no seu dispositivo.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          {saveOptionVisible && (
            <Button onClick={salvarImagens} color="secondary">
              Salvar Imagens
            </Button>
          )}
          <Button onClick={handleCloseModal} disabled={!canCloseModal}>
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UploadImagens;
