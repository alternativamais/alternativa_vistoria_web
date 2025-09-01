/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from 'services/api';

export const AuthContext = createContext({});

function AuthProvider({ children }) {
  const [data, setData] = useState(() => {
    const user = localStorage.getItem('@vistoria:user');
    const token = localStorage.getItem('@vistoria:token');
    const permissions = localStorage.getItem('@vistoria:permissions');
    const allowedScreens = localStorage.getItem('@vistoria:allowedScreens');

    if (user && token) {
      return {
        user: JSON.parse(user),
        token,
        permissions: permissions ? JSON.parse(permissions) : [],
        allowedScreens: allowedScreens ? JSON.parse(allowedScreens) : []
      };
    }
    return {};
  });

  const navigate = useNavigate();

  async function signIn({ email, password }) {
    try {
      const response = await api.post('/auth', { email, password });
      const { accessToken, user, permissions = [], allowedScreens = [] } = response.data;

      localStorage.setItem('@vistoria:user', JSON.stringify(user));
      localStorage.setItem('@vistoria:token', accessToken);
      localStorage.setItem('@vistoria:permissions', JSON.stringify(permissions));
      localStorage.setItem('@vistoria:allowedScreens', JSON.stringify(allowedScreens));

      api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
      setData({ user, token: accessToken, permissions, allowedScreens });

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
    localStorage.removeItem('@vistoria:user');
    localStorage.removeItem('@vistoria:token');
    localStorage.removeItem('@vistoria:permissions');
    localStorage.removeItem('@vistoria:allowedScreens');

    setData({});

    console.log('Deslogado com sucesso!');
  }

  async function checkToken() {
    if (data.token) {
      try {
        await api.get('/check-token');
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
        token: data.token,
        permissions: data.permissions || [],
        allowedScreens: data.allowedScreens || []
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
