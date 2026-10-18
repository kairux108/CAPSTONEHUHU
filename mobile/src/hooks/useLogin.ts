import axios from 'axios';
import { useState } from 'react';

import { login as loginRequest } from '../services/authService';
import { AuthUser } from '../types/auth';
import { validateLogin } from '../utils/authValidation';

export default function useLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] =
    useState<string | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [user, setUser] =
    useState<AuthUser | null>(null);

  const handleLogin = async () => {
    const validationError = validateLogin(
      email,
      password
    );

    if (validationError) {
      setError(validationError);
      return null;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await loginRequest({
        email: email.trim(),
        password,
      });

      setUser(response.user);

      return response;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message =
          err.response?.data?.message;

        setError(
          message ||
            'Unable to connect to CURA. Please try again.'
        );
      } else {
        setError(
          'Something went wrong. Please try again.'
        );
      }

      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    password,
    error,
    loading,
    user,

    setEmail,
    setPassword,

    handleLogin,
  };
}