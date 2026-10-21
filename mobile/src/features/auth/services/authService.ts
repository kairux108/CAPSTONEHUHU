import * as SecureStore from 'expo-secure-store';

import {
  LoginCredentials,
  LoginResponse,
  RegisterCredentials,
  RegisterResponse,
} from '../types/auth';

import api from '../../../services/api';

const TOKEN_KEY = 'cura_token';

export async function login(
  credentials: LoginCredentials
): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>(
    '/login',
    credentials
  );

  const data = response.data;

  if (!data.token) {
    throw new Error(
      'Authentication token was not returned.'
    );
  }

  await SecureStore.setItemAsync(
    TOKEN_KEY,
    data.token
  );

  return data;
}

export async function register(
  credentials: RegisterCredentials
): Promise<RegisterResponse> {
  const response =
    await api.post<RegisterResponse>(
      '/register',
      credentials
    );

  return response.data;
}

export async function getStoredToken() {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function logout() {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}