import { jwtDecode } from 'jwt-decode';

export function getUserDataFromToken() {
  const token = localStorage.getItem('@vistoria:token');

  if (!token) {
    console.warn('Token não encontrado no localStorage');
    return null;
  }

  try {
    const decoded = jwtDecode(token);

    const { user, iat, exp } = decoded;

    return { user, iat, exp };
  } catch (error) {
    console.error('Erro ao decodificar o token:', error);
    return null;
  }
}
