import axios from "axios";
import ApiPath from "../../../shared/ApiPath";

const authBase = `${ApiPath}/auth`;
const otpBase = `${ApiPath}/otp`;

export const registerUser = (data: any) =>
  axios.post(`${authBase}/register`, data);

export const loginUser = (data: any) =>
  axios.post(`${authBase}/login`, data, { withCredentials: true });

export const logoutUser = () =>
  axios.post(`${authBase}/logout`, {}, { withCredentials: true });

export const resetPassword = (value: string, newPassword: string, confirmPassword: string) => {
  const isPhone = /^\d{10}$/.test(value);
  return axios.post(`${authBase}/reset-password`, { [isPhone ? "phone" : "email"]: value,  newPassword,  confirmPassword, });
};

export const refreshToken = () => 
  axios.post(`${authBase}/refresh-token`, {}, { withCredentials: true });

export const generateOtp = (purpose: "signup" | "reset", email?: string, phone?: string) =>
  axios.post(`${otpBase}/generate-otp`, { email, phone, purpose });

export const verifyOtp = ( value: string, otp: string, purpose: "signup" | "reset", method: "email" | "phone") =>
  axios.post(`${otpBase}/verify-otp`, { [method]: value, otp, purpose }, { withCredentials: true });