// src/pages/LoginForm.tsx
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { loginUser, verifyResetOtp, resetPassword, generateOtp,} from "../services/authService";
import OtpVerifyModal from "../components/OtpVerifyModal";

export default function LoginForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({ email: "", password: "" });
  const [otpModal, setOtpModal] = useState(false);
  const [resetModal, setResetModal] = useState(false);
  const [resetData, setResetData] = useState({ newPassword: "", confirmPassword: "",});

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await loginUser(data);
      toast.success(res.data.message);
      Cookies.set("token", res.data.token);
      setTimeout(() => navigate("/home"), 2000);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Login failed");
    }
  };

  const handleForgotPassword = async () => {
    if (!data.email) return toast.error("Enter your email first");
    try {
      await generateOtp(data.email);
      toast.success("OTP sent to email");
      setOtpModal(true);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to send OTP");
    }
  };

  const handleOtpVerify = async (enteredOtp: string) => {
    try {
      await verifyResetOtp(data.email, enteredOtp);
      toast.success("OTP verified. Now reset password");
      setOtpModal(false);
      setResetModal(true);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Invalid OTP");
    }
  };

  const handleResetPassword = async () => {
    const { newPassword, confirmPassword } = resetData;
    if (!newPassword || !confirmPassword) return toast.error("Fill all fields");
    if (newPassword !== confirmPassword) return toast.error("Passwords mismatch");

    try {
      await resetPassword(data.email, newPassword, confirmPassword);
      toast.success("Password updated successfully");
      setResetModal(false);
      setResetData({ newPassword: "", confirmPassword: "" });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Reset failed");
    }
  };

  return (
    <>
      <form onSubmit={handleLogin} className="space-y-4 mb-6">
        <div>
          <label className="block text-gray-600 text-sm mb-2">Email</label>
          <input type="email"
            className="w-full p-3 border border-gray-200 rounded-lg"
            value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} required/>
        </div>

        <div>
          <label className="block text-gray-600 text-sm mb-2">Password</label>
          <div className="relative">
            <input  type={showPassword ? "text" : "password"}
              className="w-full p-3 border border-gray-200 rounded-lg pr-12"
              value={data.password}  onChange={(e) => setData({ ...data, password: e.target.value })}  required/>
            <button type="button"
              onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <div className="text-right">
          <span  className="text-blue-500 text-sm cursor-pointer"  onClick={handleForgotPassword}>
            Forgot Password ?
          </span>
        </div>

        <button type="submit"  className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600">
          Login
        </button>
      </form>

      {otpModal && (
        <OtpVerifyModal
          email={data.email}
          onVerify={handleOtpVerify}
          onClose={() => setOtpModal(false)}
        />
      )}

      {resetModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4 text-center">Reset Password</h2>
            <input  type="password"
              placeholder="New Password"
              className="w-full p-3 border border-gray-300 rounded mb-3"
              value={resetData.newPassword}  onChange={(e) => setResetData({ ...resetData, newPassword: e.target.value })}/>
            <input  type="password"
              placeholder="Confirm Password"
              className="w-full p-3 border border-gray-300 rounded mb-4"
              value={resetData.confirmPassword} onChange={(e) => setResetData({ ...resetData, confirmPassword: e.target.value })}/>
            <button  onClick={handleResetPassword} className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600">
              Submit
            </button>
          </div>
        </div>
      )}
    </>
  );
}
