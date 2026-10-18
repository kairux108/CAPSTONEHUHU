export type RegisterValues = {
  firstName: string;
  lastName: string;
  birthDate: Date | null;
  sex: string;
  phone: string;
  email: string;
  password: string;
  acceptedTerms: boolean;
};

export function validateRegister(
  values: RegisterValues
): string | null {
  const {
    firstName,
    lastName,
    birthDate,
    sex,
    phone,
    email,
    password,
    acceptedTerms,
  } = values;

  if (!firstName.trim()) {
    return 'Please enter your first name.';
  }

  if (!lastName.trim()) {
    return 'Please enter your last name.';
  }

  if (!birthDate) {
    return 'Please select your date of birth.';
  }

  if (!sex) {
    return 'Please select your sex.';
  }

  if (!phone.trim()) {
    return 'Please enter your phone number.';
  }

  if (!email.trim()) {
    return 'Please enter your email address.';
  }

  if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
    return 'Please enter a valid email address.';
  }

  if (!password) {
    return 'Please enter a password.';
  }

  if (password.length < 6) {
    return 'Password must be at least 6 characters.';
  }

  if (!acceptedTerms) {
    return 'Please agree to the Terms and Privacy Policy.';
  }

  return null;
}