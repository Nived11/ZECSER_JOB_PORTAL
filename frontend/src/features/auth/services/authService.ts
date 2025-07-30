import axios from "axios";
import ApiPath from "../../../shared/ApiPath";

export const registerUser = (data: any) => axios.post(`${ApiPath}/register`, data);
export const generateOtp = (email: string) => axios.post(`${ApiPath}/generate-otp`, { email });
export const verifyOtp = (email: string, otp: string) => axios.post(`${ApiPath}/verify-otp`, { email, otp });
export const loginUser = (data: any) => axios.post(`${ApiPath}/login`, data);
export const forgotPassword = (email: string) => axios.post(`${ApiPath}/forgot-password`, { email });
export const verifyResetOtp = (email: string, otp: string) => axios.post(`${ApiPath}/verify-resetpassword-otp`, { email, otp });
export const resetPassword = (email: string, newPassword: string, confirmPassword: string) =>
  axios.post(`${ApiPath}/reset-password`, { email, newPassword, confirmPassword });
