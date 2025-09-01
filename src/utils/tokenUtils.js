import { jwtDecode } from 'jwt-decode';

// Compat: previously the JWT had a full `user` object.
// Now it can contain standard claims like `sub` (userId), `rid` (roleId), `email`.
export function getUserDataFromToken() {
  const token = localStorage.getItem('@vistoria:token');

  if (!token) {
    console.warn('Token não encontrado no localStorage');
    return null;
  }

  try {
    const decoded = jwtDecode(token);

    // Old shape had { user, iat, exp }
    if (decoded && decoded.user) {
      const { user, iat, exp } = decoded;
      return { user, iat, exp };
    }

    // New shape: { sub, rid, email, iat, exp }
    const { sub, rid, email, iat, exp } = decoded || {};
    return { sub, rid, email, iat, exp };
  } catch (error) {
    console.error('Erro ao decodificar o token:', error);
    return null;
  }
}
