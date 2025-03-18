/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Dialog, TextField, Button } from '@mui/material';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { api } from 'services/api';
import { notification } from 'components/notification/index';

const GaleriaFerramentas = () => {
  const { idvistoria } = useParams();
  const [grupos, setGrupos] = useState([]); // Cada grupo contém { item, imagens }
  const [loading, setLoading] = useState(true);

  // Estados para o modal: indices do grupo e da imagem selecionada
  const [selectedGroupIndex, setSelectedGroupIndex] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  // Estados para exclusão
  const [dialogoAberto, setDialogoAberto] = useState(false);
  const [senha, setSenha] = useState('');
  const [imagemParaApagar, setImagemParaApagar] = useState(null);

  useEffect(() => {
    fetchImagens();
  }, [idvistoria]);

  const fetchImagens = async () => {
    try {
      const response = await api.get(`/imagens-vistoria-ferramentas/vistoria/${idvistoria}`);
      // O retorno já é um array de grupos, cada um com { item, imagens }
      setGrupos(response.data);
      setLoading(false);
    } catch (error) {
      notification({ message: 'Erro ao buscar imagens!', type: 'error' });
      setLoading(false);
    }
  };

  // Abre o modal informando o grupo e a imagem selecionada (por índice)
  const handleImagemClick = (groupIndex, imageIndex) => {
    setSelectedGroupIndex(groupIndex);
    setSelectedImageIndex(imageIndex);
  };

  const handleCloseModal = () => {
    setSelectedGroupIndex(null);
    setSelectedImageIndex(null);
  };

  const handleNext = () => {
    if (selectedGroupIndex === null || selectedImageIndex === null) return;
    const imagensGrupo = grupos[selectedGroupIndex].imagens;
    const nextIndex = (selectedImageIndex + 1) % imagensGrupo.length;
    setSelectedImageIndex(nextIndex);
  };

  const handlePrev = () => {
    if (selectedGroupIndex === null || selectedImageIndex === null) return;
    const imagensGrupo = grupos[selectedGroupIndex].imagens;
    const prevIndex = (selectedImageIndex - 1 + imagensGrupo.length) % imagensGrupo.length;
    setSelectedImageIndex(prevIndex);
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

    if (senha !== '2025') {
      notification({ message: 'Senha incorreta!', type: 'error' });
      return;
    }

    try {
      await api.delete(`/imagens-vistoria-ferramentas/${id}`);
      notification({ message: 'Imagem apagada com sucesso!', type: 'success' });
      // Atualiza o grupo removendo a imagem apagada
      const updatedGrupos = grupos.map((grupo, index) => {
        if (index === selectedGroupIndex) {
          return {
            ...grupo,
            imagens: grupo.imagens.filter((img) => img.id !== id)
          };
        }
        return grupo;
      });
      setGrupos(updatedGrupos);
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
          Imagens da Vistoria de Ferramentas
        </Typography>
      </Box>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
          <Typography variant="body1">Carregando...</Typography>
        </Box>
      ) : grupos.length > 0 ? (
        grupos.map((grupo, groupIndex) => (
          <Box key={grupo.item.id} sx={{ marginBottom: '40px' }}>
            {/* Cabeçalho do grupo com o comentário ou outra informação */}
            <Typography variant="h6" sx={{ marginBottom: '10px' }}>
              {grupo.item.comentario}
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px'
              }}
            >
              {grupo.imagens.map((img, imageIndex) => (
                <Box
                  key={img.id}
                  sx={{
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: '10px',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    cursor: 'pointer',
                    aspectRatio: `${4} / ${3}`,
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)'
                    }
                  }}
                  onClick={() => handleImagemClick(groupIndex, imageIndex)}
                >
                  <img
                    src={img.url}
                    alt={grupo.item.comentario || 'Imagem'}
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
                      // Define o grupo e a imagem selecionada para exclusão, se necessário
                      setSelectedGroupIndex(groupIndex);
                      setSelectedImageIndex(imageIndex);
                      abrirDialogoApagar();
                    }}
                  >
                    X
                  </Button>
                </Box>
              ))}
            </Box>
          </Box>
        ))
      ) : (
        <Typography variant="body1" sx={{ textAlign: 'center', marginTop: '50px' }}>
          Nenhuma imagem encontrada para esta vistoria.
        </Typography>
      )}

      {/* Modal para exibir a imagem selecionada */}
      <Dialog open={selectedGroupIndex !== null && selectedImageIndex !== null} onClose={handleCloseModal} maxWidth="md" fullWidth>
        {selectedGroupIndex !== null && selectedImageIndex !== null && (
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
              src={grupos[selectedGroupIndex].imagens[selectedImageIndex].url}
              alt={grupos[selectedGroupIndex].item.comentario || 'Imagem'}
              style={{
                maxWidth: '100%',
                maxHeight: '80vh',
                objectFit: 'contain',
                borderRadius: '15px'
              }}
            />
            <Typography variant="body2" sx={{ marginTop: '10px' }}>
              {grupos[selectedGroupIndex].item.comentario}
            </Typography>
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

      {/* Diálogo para confirmação de exclusão */}
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

export default GaleriaFerramentas;
