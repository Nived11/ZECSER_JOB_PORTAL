export const validatePassword = (password: string): string | null => {
  if (!password) return "Password is required";
  const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/;
  return regex.test(password)
    ? null
    : "Min 6 chars, 1 uppercase, 1 number, 1 special";
};
