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

export const resetPassword = (email: string, newPassword: string, confirmPassword: string) =>
  axios.post(`${authBase}/reset-password`, { email, newPassword, confirmPassword });

export const refreshToken = () =>
  axios.post(`${authBase}/refresh-token`, {}, { withCredentials: true });

export const generateOtp = (email: string, purpose: "signup" | "reset") =>
  axios.post(`${otpBase}/generate-otp`, { email, purpose });

export const verifyOtp = (email: string, otp: string, purpose: "signup" | "reset") =>
  axios.post(`${otpBase}/verify-otp`, { email, otp, purpose }, { withCredentials: true });
