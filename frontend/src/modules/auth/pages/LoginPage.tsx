import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '../components/LoginForm';
import { useAuthStore } from '../store/auth.store';
import { URLS } from '@/routes/urls';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { accessToken } = useAuthStore();

  // Redirect if already logged in
  useEffect(() => {
    if (accessToken) {
      navigate(URLS.DASHBOARD, { replace: true });
    }
  }, [accessToken, navigate]);

  return <LoginForm />;
};

