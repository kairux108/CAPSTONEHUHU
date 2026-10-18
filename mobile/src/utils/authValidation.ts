export function validateLogin(
  email: string,
  password: string
): string | null {
  if (!email.trim()) {
    return 'Email address is required.';
  }

  if (!email.includes('@')) {
    return 'Please enter a valid email address.';
  }

  if (!password.trim()) {
    return 'Password is required.';
  }

  return null;
}