/* eslint-disable react/prop-types */
import React, { useState, useRef } from 'react';
import { Box, Button } from '@mui/material';
import { api } from 'services/api';
import isMobile from 'is-mobile';
import Webcam from 'react-webcam';
import { notification } from 'components/notification/index';

const UploadImagens = ({ idVistoria, onSuccess }) => {
  const [imagens, setImagens] = useState([]);
  const [cameraAtiva, setCameraAtiva] = useState(false);
  const webcamRef = useRef(null);

  const isMobileDevice = isMobile();

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

    try {
      await api.post('/imagens-vistorias/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (onSuccess) {
        onSuccess();
      }
      notification({ message: 'Imagens enviadas com sucesso!', type: 'success' });
      setImagens([]);
    } catch (error) {
      notification({ message: 'Erro ao enviar imagens. Tente novamente!', type: 'error' });
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

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {!isMobileDevice && !cameraAtiva && (
        <Button variant="contained" color="primary" onClick={iniciarCamera}>
          Abrir Câmera
        </Button>
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
      {isMobileDevice && !cameraAtiva && (
        <Button variant="contained" color="primary" onClick={abrirCameraNativa}>
          Abrir Câmera do Celular
        </Button>
      )}
      <Box>
        <h3>Imagens Capturadas:</h3>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {imagens.map((img, index) => (
            <img key={index} src={img.preview} alt={`Imagem ${index + 1}`} style={{ width: 100, height: 100, objectFit: 'cover' }} />
          ))}
        </Box>
      </Box>
      <Button variant="contained" color="primary" onClick={handleUploadImagens} disabled={!imagens.length || !idVistoria}>
        Enviar Imagens
      </Button>
    </Box>
  );
};

export default UploadImagens;
