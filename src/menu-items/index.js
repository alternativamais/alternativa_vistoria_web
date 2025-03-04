import admin from './admin';
import inspetor from './inspetor';
import vistoriaInstalacaoInterno from './vistoria-instalacao-interno';
import vistoriaFerramentas from './vistorias-ferramentas';

const menuItems = {
  items: [admin, vistoriaInstalacaoInterno, inspetor, vistoriaFerramentas].filter(
    (item) => Array.isArray(item.children) && item.children.length > 0
  )
};

export default menuItems;
