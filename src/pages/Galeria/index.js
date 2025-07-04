/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Dialog, TextField, Button } from '@mui/material';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { api } from 'services/api';
import { notification } from 'components/notification/index';

const Galeria = () => {
  const { idvistoria } = useParams();

  const [imagens, setImagens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imagensCorrecao, setImagensCorrecao] = useState([]);
  const [loadingCorrecoes, setLoadingCorrecoes] = useState(true);
  const [imagemSelecionada, setImagemSelecionada] = useState(null);
  const [currentGallery, setCurrentGallery] = useState('');
  const [dialogoAberto, setDialogoAberto] = useState(false);
  const [senha, setSenha] = useState('');
  const [imagemParaApagar, setImagemParaApagar] = useState(null);

  useEffect(() => {
    fetchImagens();
    fetchImagensCorrecao();
  }, [idvistoria]);

  const fetchImagens = async () => {
    try {
      const response = await api.get(`/imagens-vistorias/vistoria/${idvistoria}`);
      const imagensFormatadas = response.data.map((img) => ({
        src: img.url,
        id: img.id,
        descricao: img.descricao,
        width: img.width || 4,
        height: img.height || 3
      }));
      setImagens(imagensFormatadas);
      setLoading(false);
    } catch (error) {
      notification({ message: 'Erro ao buscar imagens!', type: 'error' });
      setLoading(false);
    }
  };

  const fetchImagensCorrecao = async () => {
    try {
      const response = await api.get(`/imagens-correcao/vistoria/${idvistoria}`);
      const imagensFormatadas = response.data.map((img) => ({
        src: img.urlImagem,
        id: img.id,
        descricao: '',
        width: 4,
        height: 3
      }));
      setImagensCorrecao(imagensFormatadas);
      setLoadingCorrecoes(false);
    } catch (error) {
      notification({ message: 'Erro ao buscar imagens de correção!', type: 'error' });
      setLoadingCorrecoes(false);
    }
  };

  const handleImagemClick = (img, gallery) => {
    setImagemSelecionada(img);
    setCurrentGallery(gallery);
  };

  const handleCloseModal = () => {
    setImagemSelecionada(null);
  };

  const handleNext = () => {
    const galleryArray = currentGallery === 'correcao' ? imagensCorrecao : imagens;
    if (imagemSelecionada && galleryArray.length > 0) {
      const currentIndex = galleryArray.findIndex((img) => img.id === imagemSelecionada.id);
      const nextIndex = (currentIndex + 1) % galleryArray.length;
      setImagemSelecionada(galleryArray[nextIndex]);
    }
  };

  const handlePrev = () => {
    const galleryArray = currentGallery === 'correcao' ? imagensCorrecao : imagens;
    if (imagemSelecionada && galleryArray.length > 0) {
      const currentIndex = galleryArray.findIndex((img) => img.id === imagemSelecionada.id);
      const prevIndex = (currentIndex - 1 + galleryArray.length) % galleryArray.length;
      setImagemSelecionada(galleryArray[prevIndex]);
    }
  };

  const abrirDialogoApagar = () => {
    setDialogoAberto(true);
  };

  const fecharDialogoApagar = () => {
    setDialogoAberto(false);
    setSenha('');
    setImagemParaApagar(null);
  };

  const confirmarApagar = async (id) => {
    if (!id) {
      notification({ message: 'ID inválido ou indefinido!', type: 'error' });
      return;
    }

    console.log('ID para apagar:', id);

    // if (senha !== '2025') {
    //   notification({ message: 'Senha incorreta!', type: 'error' });
    //   return;
    // }

    try {
      await api.delete(`/imagens-vistorias/${id}`);
      notification({ message: 'Imagem apagada com sucesso!', type: 'success' });

      setImagens((prev) => prev.filter((img) => img.id !== id));

      fecharDialogoApagar();
      handleCloseModal();
    } catch (error) {
      console.log(error);
      notification({ message: 'Erro ao apagar imagem!', type: 'error' });
    }
  };

  return (
    <Box sx={{ padding: '20px' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <Typography variant="h5" sx={{ marginLeft: '10px' }}>
          Primeiras imagens: Vistoria
        </Typography>
      </Box>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
          <Typography variant="body1">Carregando...</Typography>
        </Box>
      ) : imagens.length > 0 ? (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '40px'
          }}
        >
          {imagens.map((img) => (
            <Box
              key={img.id}
              sx={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '10px',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'pointer',
                aspectRatio: `${img.width} / ${img.height}`,
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)'
                }
              }}
              onClick={() => handleImagemClick(img, 'vistoria')}
            >
              <img
                src={img.src}
                alt={img.descricao || 'Imagem'}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
              <Button
                variant="contained"
                color="error"
                sx={{
                  position: 'absolute',
                  top: '5px',
                  right: '5px',
                  minWidth: '30px',
                  minHeight: '30px',
                  padding: '5px',
                  fontSize: '12px'
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setImagemParaApagar(img);
                  abrirDialogoApagar();
                }}
              >
                X
              </Button>
            </Box>
          ))}
        </Box>
      ) : (
        <Typography variant="body1" sx={{ textAlign: 'center', marginTop: '50px' }}>
          Nenhuma imagem encontrada para esta vistoria.
        </Typography>
      )}

      {/* Seção de imagens de correção */}
      <Typography variant="h5" sx={{ marginLeft: '10px' }}>
        Segundas imagens: Correção
      </Typography>
      {loadingCorrecoes ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
          <Typography variant="body1">Carregando...</Typography>
        </Box>
      ) : imagensCorrecao.length > 0 ? (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px'
          }}
        >
          {imagensCorrecao.map((img) => (
            <Box
              key={img.id}
              sx={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '10px',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'pointer',
                aspectRatio: `${img.width} / ${img.height}`
              }}
              onClick={() => handleImagemClick(img, 'correcao')}
            >
              <img
                src={img.src}
                alt={img.descricao || 'Imagem'}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
            </Box>
          ))}
        </Box>
      ) : (
        <Typography variant="body1" sx={{ textAlign: 'center', marginTop: '50px' }}>
          Nenhuma imagem de correção encontrada para esta vistoria.
        </Typography>
      )}

      {/* Modal para exibir a imagem selecionada */}
      <Dialog open={!!imagemSelecionada} onClose={handleCloseModal} maxWidth="md" fullWidth>
        {imagemSelecionada && (
          <Box sx={{ textAlign: 'center', padding: '20px', position: 'relative' }}>
            <Box
              onClick={handlePrev}
              sx={{
                position: 'absolute',
                left: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                color: 'white',
                borderRadius: '50%',
                padding: '10px',
                cursor: 'pointer',
                '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.7)' }
              }}
            >
              <LeftOutlined style={{ fontSize: '20px' }} />
            </Box>
            <img
              src={imagemSelecionada.src}
              alt={imagemSelecionada.descricao || 'Imagem'}
              style={{
                maxWidth: '100%',
                maxHeight: '80vh',
                objectFit: 'contain',
                borderRadius: '15px'
              }}
            />
            {imagemSelecionada.descricao && (
              <Typography variant="body2" sx={{ marginTop: '10px' }}>
                {imagemSelecionada.descricao}
              </Typography>
            )}
            <Box
              onClick={handleNext}
              sx={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                color: 'white',
                borderRadius: '50%',
                padding: '10px',
                cursor: 'pointer',
                '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.7)' }
              }}
            >
              <RightOutlined style={{ fontSize: '20px' }} />
            </Box>
          </Box>
        )}
      </Dialog>

      {/* Diálogo para confirmação de exclusão (apenas para imagens de vistoria) */}
      <Dialog open={dialogoAberto} onClose={fecharDialogoApagar}>
        <Box sx={{ padding: '20px', textAlign: 'center' }}>
          <Typography variant="h6" sx={{ marginBottom: '20px' }}>
            Tem certeza que deseja apagar esta imagem?
          </Typography>
          <TextField
            label="Senha"
            type="password"
            fullWidth
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            sx={{ marginBottom: '20px' }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="outlined" onClick={fecharDialogoApagar}>
              Cancelar
            </Button>
            <Button variant="contained" color="error" onClick={() => confirmarApagar(imagemParaApagar?.id)}>
              Confirmar
            </Button>
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
};

export default Galeria;
