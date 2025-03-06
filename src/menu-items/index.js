import admin from './admin';
import inspetor from './inspetor';
import vistoriaFerramentasInterno from './vistoria-ferramentas-interno';
import vistoriaInstalacaoInterno from './vistoria-instalacao-interno';
import vistoriaInstalacaoExterno from './vistorias-ferramentas';

const menuItems = {
  items: [admin, vistoriaInstalacaoInterno, inspetor, vistoriaFerramentasInterno, vistoriaInstalacaoExterno].filter(
    (item) => Array.isArray(item.children) && item.children.length > 0
  )
};

export default menuItems;
