/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from 'services/api';

export const AuthContext = createContext({});

function AuthProvider({ children }) {
  const [data, setData] = useState(() => {
    const user = localStorage.getItem('@alvo:user');
    const token = localStorage.getItem('@alvo:token');
    if (user && token) {
      return { user: JSON.parse(user), token };
    }
    return {};
  });

  const navigate = useNavigate();

  async function signIn({ email, password }) {
    try {
      const response = await api.post('/auth', { email, password });
      const { accessToken, user } = response.data;

      localStorage.setItem('@alvo:user', JSON.stringify(user));
      localStorage.setItem('@alvo:token', accessToken);

      api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
      setData({ user, token: accessToken });

      console.log('Bem-vindo!');
      return;
    } catch (e) {
      if (e.response) {
        console.log(e.response.data.message);
      } else {
        console.log('Sem acesso ao sistema, tente novamente mais tarde!');
      }
      throw e;
    }
  }

  function signOut() {
    localStorage.removeItem('@alvo:user');
    localStorage.removeItem('@alvo:token');

    setData({});

    console.log('Deslogado com sucesso!');
  }

  async function checkToken() {
    if (data.token) {
      try {
        await api.get('/users/1');
      } catch {
        signOut();
      }
    }
  }

  useEffect(() => {
    if (data.token) {
      api.defaults.headers.common.Authorization = `Bearer ${data.token}`;
    } else {
      signOut();
    }
  }, [data.token]);

  useEffect(() => {
    checkToken();
  }, [navigate]);

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        user: data.user,
        token: data.token
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);

  return context;
}

export { AuthProvider, useAuth };
