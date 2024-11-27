/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, CircularProgress, Typography, Dialog } from '@mui/material';
import { api } from 'services/api';

const Galeria = () => {
  const { idvistoria } = useParams();
  const [imagens, setImagens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imagemSelecionada, setImagemSelecionada] = useState(null);

  useEffect(() => {
    fetchImagens();
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

  const handleImagemClick = (img) => {
    setImagemSelecionada(img);
  };

  const handleCloseModal = () => {
    setImagemSelecionada(null);
  };

  return (
    <Box sx={{ padding: '20px' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <Typography variant="h5" sx={{ marginLeft: '10px' }}>
          Galeria de Imagens
        </Typography>
      </Box>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
          <CircularProgress />
        </Box>
      ) : imagens.length > 0 ? (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px'
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
              onClick={() => handleImagemClick(img)}
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
          Nenhuma imagem encontrada para esta vistoria.
        </Typography>
      )}

      {/* Modal para exibir a imagem selecionada */}
      <Dialog open={!!imagemSelecionada} onClose={handleCloseModal} maxWidth="md" fullWidth>
        {imagemSelecionada && (
          <Box sx={{ textAlign: 'center', padding: '20px' }}>
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
          </Box>
        )}
      </Dialog>
    </Box>
  );
};

export default Galeria;
