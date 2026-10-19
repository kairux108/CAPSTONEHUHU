import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { validateProfile } from '../validation/profileValidation';
import type {
  PatientProfile,
  ProfileFieldErrors,
  ProfileFormValues,
  ProfileSaveResult,
  UpdatePatientProfileData,
} from '../types/profile.types';

type UseProfileFormOptions = {
  patient: PatientProfile;
  onSave: (
    data: UpdatePatientProfileData
  ) => Promise<ProfileSaveResult>;
  onSaved: () => void | Promise<void>;
};

function createForm(
  patient: PatientProfile
): ProfileFormValues {
  return {
    first_name: patient.first_name ?? '',
    middle_name: patient.middle_name ?? '',
    last_name: patient.last_name ?? '',
    birth_date: patient.birth_date ?? '',
    sex:
      patient.sex === 'male' || patient.sex === 'female'
        ? patient.sex
        : '',
    phone_number: patient.phone_number ?? '',
    email: patient.email ?? '',
    address: patient.address ?? '',
    city: patient.city ?? '',
    province: patient.province ?? '',
    blood_type: patient.blood_type ?? '',
    emergency_contact_name:
      patient.emergency_contact_name ?? '',
    emergency_contact_number:
      patient.emergency_contact_number ?? '',
  };
}

function toUpdateData(
  form: ProfileFormValues
): UpdatePatientProfileData | null {
  if (form.sex !== 'male' && form.sex !== 'female') {
    return null;
  }

  return {
    first_name: form.first_name.trim(),
    middle_name: form.middle_name.trim() || null,
    last_name: form.last_name.trim(),
    birth_date: form.birth_date.slice(0, 10),
    sex: form.sex,
    phone_number: form.phone_number.trim(),
    email: form.email.trim(),
    address: form.address.trim() || null,
    city: form.city.trim() || null,
    province: form.province.trim() || null,
    blood_type: form.blood_type.trim().toUpperCase() || null,
    emergency_contact_name:
      form.emergency_contact_name.trim() || null,
    emergency_contact_number:
      form.emergency_contact_number.trim() || null,
  };
}

export default function useProfileForm({
  patient,
  onSave,
  onSaved,
}: UseProfileFormOptions) {
  const [form, setForm] = useState(() => createForm(patient));
  const [errors, setErrors] = useState<ProfileFieldErrors>({});
  const submittingRef = useRef(false);

  useEffect(() => {
    setForm(createForm(patient));
    setErrors({});
  }, [patient]);

  const updateField = useCallback(
    <Field extends keyof ProfileFormValues>(
      field: Field,
      value: ProfileFormValues[Field]
    ) => {
      setForm(current => ({ ...current, [field]: value }));
      setErrors(current => ({ ...current, [field]: undefined }));
    },
    []
  );

  const submit = useCallback(async () => {
    if (submittingRef.current) {
      return null;
    }

    const nextErrors = validateProfile(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return null;
    }

    const data = toUpdateData(form);
    if (!data) {
      setErrors(current => ({
        ...current,
        sex: 'Select a sex.',
      }));
      return null;
    }

    submittingRef.current = true;

    try {
      const result = await onSave(data);

      if (!result.success && result.fieldErrors) {
        setErrors(current => ({
          ...current,
          ...result.fieldErrors,
        }));
      }

      if (result.success) {
        await onSaved();
      }

      return result;
    } finally {
      submittingRef.current = false;
    }
  }, [form, onSave, onSaved]);

  return {
    form,
    errors,
    updateField,
    submit,
  };
}
