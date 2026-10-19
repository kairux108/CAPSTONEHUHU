import type {
  ProfileFieldErrors,
  ProfileFormValues,
} from '../types/profile.types';

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function isValidPhilippineMobile(value: string) {
  const normalized = value.replace(/[\s()-]/g, '');

  return /^(09\d{9}|\+639\d{9})$/.test(normalized);
}

function isValidBirthDate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(
    value.slice(0, 10)
  );

  if (!match) {
    return false;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(23, 59, 59, 999);

  return (
    year >= 1900 &&
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day &&
    date <= today
  );
}

export function validateProfile(
  form: ProfileFormValues
): ProfileFieldErrors {
  const errors: ProfileFieldErrors = {};

  if (!form.first_name.trim()) {
    errors.first_name = 'First name is required.';
  }

  if (!form.last_name.trim()) {
    errors.last_name = 'Last name is required.';
  }

  if (!isValidBirthDate(form.birth_date)) {
    errors.birth_date =
      'Choose a valid birth date (1900 through today).';
  }

  if (form.sex !== 'male' && form.sex !== 'female') {
    errors.sex = 'Select a sex.';
  }

  if (!isValidPhilippineMobile(form.phone_number)) {
    errors.phone_number =
      'Enter a Philippine mobile number (09XXXXXXXXX or +639XXXXXXXXX).';
  }

  if (!isValidEmail(form.email)) {
    errors.email = 'Enter a valid email address.';
  }

  if (
    form.blood_type.trim() &&
    !/^(A|B|AB|O)[+-]$/i.test(form.blood_type.trim())
  ) {
    errors.blood_type =
      'Use A+, A-, B+, B-, AB+, AB-, O+, or O-.';
  }

  const hasEmergencyName =
    form.emergency_contact_name.trim().length > 0;
  const hasEmergencyNumber =
    form.emergency_contact_number.trim().length > 0;

  if (hasEmergencyName && !hasEmergencyNumber) {
    errors.emergency_contact_number =
      'Enter a number for this emergency contact.';
  } else if (!hasEmergencyName && hasEmergencyNumber) {
    errors.emergency_contact_name =
      'Enter a name for this emergency contact.';
  }

  if (
    hasEmergencyNumber &&
    !isValidPhilippineMobile(form.emergency_contact_number)
  ) {
    errors.emergency_contact_number =
      'Enter a valid Philippine mobile number.';
  }

  const limits: Partial<
    Record<keyof ProfileFormValues, number>
  > = {
    first_name: 255,
    middle_name: 255,
    last_name: 255,
    phone_number: 30,
    email: 255,
    address: 500,
    city: 255,
    province: 255,
    blood_type: 10,
    emergency_contact_name: 255,
    emergency_contact_number: 30,
  };

  for (const [field, max] of Object.entries(limits)) {
    const key = field as keyof ProfileFormValues;

    if (form[key].trim().length > max && !errors[key]) {
      errors[key] = `Maximum ${max} characters allowed.`;
    }
  }

  return errors;
}
