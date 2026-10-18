import axios from 'axios';
import { useState } from 'react';

import {
  register as registerRequest,
} from '../services/authService';

import { RegisterResponse } from '../types/auth';

import {
  calculateAge,
  formatDate,
} from '../utils/dateUtils';

import {
  validateRegister,
} from '../utils/registerValidation';

export default function useRegister() {
  const [firstName, setFirstName] =
    useState('');

  const [middleName, setMiddleName] =
    useState('');

  const [lastName, setLastName] =
    useState('');

  const [birthDate, setBirthDate] =
    useState<Date | null>(null);

  const [sex, setSex] =
    useState('');

  const [phone, setPhone] =
    useState('');

  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [
    acceptedTerms,
    setAcceptedTerms,
  ] = useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [loading, setLoading] =
    useState(false);

  const age = calculateAge(birthDate);

  const handleRegister =
    async (): Promise<RegisterResponse | null> => {
      const validationError =
        validateRegister({
          firstName,
          lastName,
          birthDate,
          sex,
          phone,
          email,
          password,
          acceptedTerms,
        });

      if (validationError) {
        setError(validationError);
        return null;
      }

      try {
        setLoading(true);
        setError(null);

        const response =
          await registerRequest({
            first_name:
              firstName.trim(),

            middle_name:
              middleName.trim() || null,

            last_name:
              lastName.trim(),

            birth_date:
              birthDate
                ? formatDate(birthDate)
                : '',

            sex: sex as
              | 'male'
              | 'female',

            phone_number:
              phone.trim(),

            email:
              email.trim(),

            password,
          });

        return response;
      } catch (err) {
        if (axios.isAxiosError(err)) {
          const responseMessage =
            err.response?.data?.message;

          setError(
            responseMessage ||
              (err.code === 'ECONNABORTED'
                ? 'The server took too long to respond. Please try again.'
                : err.request
                  ? 'Unable to connect to the server. Make sure your phone and computer are on the same Wi-Fi network and that the backend is running.'
                  : 'Unable to send your registration. Please try again.')
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
    firstName,
    middleName,
    lastName,
    birthDate,
    age,
    sex,
    phone,
    email,
    password,
    acceptedTerms,
    error,
    loading,

    setFirstName,
    setMiddleName,
    setLastName,
    setBirthDate,
    setSex,
    setPhone,
    setEmail,
    setPassword,
    setAcceptedTerms,

    handleRegister,
  };
}