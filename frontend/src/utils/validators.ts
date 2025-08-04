export const validateName = (name: string): string | null => {
  if (!name) return "Name is required";

  if (name.trim().length < 3) return "Name must be at least 3 characters";

  const regex = /^[a-zA-Z ]+$/;
  return regex.test(name)
    ? null
    : "Name can contain only letters and spaces";
};


export const validatePhone = (phone: string): string | null => {
  if (!phone) return "Phone number is required";

  const regex = /^\d{10}$/;
  return regex.test(phone)
    ? null
    : "Phone must be exactly 10 digits with numbers only";
};


export const validateEmail = (email: string): string | null => {
  if (!email) return "Email is required";

  const regex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

  return regex.test(email)
    ? null
    : "Enter a valid email";
};


export const validatePassword = (password: string): string | null => {
  if (!password) return "Password is required";
  const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/;
  return regex.test(password)
    ? null
    : "Min 6 chars, 1 uppercase, 1 number, 1 special";
};


