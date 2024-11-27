import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

const notyf = new Notyf({
  position: {
    x: 'right',
    y: 'top'
  }
});

export const notification = ({ message, type }) => {
  switch (type) {
    case 'success':
      notyf.success(message);
      break;
    case 'error':
      notyf.error(message);
      break;
    case 'warning':
      notyf.open({
        type: 'warning',
        message: message,
        background: 'orange',
        icon: false
      });
      break;
    default:
      console.warn('Tipo de notificação inválido!');
  }
};
