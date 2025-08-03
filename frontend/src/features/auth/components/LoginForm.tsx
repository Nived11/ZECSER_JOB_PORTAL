import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loginUser, verifyOtp, resetPassword, generateOtp } from "../services/authService";
import OtpVerifyModal from "../components/OtpVerifyModal";
import { validatePassword } from "../../../utils/validators";

export default function LoginForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showResetNewPassword, setShowResetNewPassword] = useState(false);
  const [showResetConfirmPassword, setShowResetConfirmPassword] = useState(false);
  const [data, setData] = useState({ email: "", password: "" });
  const [otpModal, setOtpModal] = useState(false);
  const [resetModal, setResetModal] = useState(false);
  const [resetData, setResetData] = useState({ newPassword: "", confirmPassword: "" });
  const [resetPasswordError, setResetPasswordError] = useState<string | null>(null);
  const [otpExpiresAt, setOtpExpiresAt] = useState<string>("");


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await loginUser(data);
      toast.success(res.data.message);
      setTimeout(() => navigate("/home"), 2000);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Login failed");
    }
  };

  const handleForgotPassword = async () => {
    if (!data.email) return toast.error("Enter your email first");
    try {
      const res = await generateOtp(data.email, "reset");
      toast.success("OTP sent to email");
      setOtpExpiresAt(res.data.expiresAt);
      setOtpModal(true);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to send OTP");
    }
  };


  const handleOtpVerify = async (otp: string) => {
    try {
      await verifyOtp(data.email, otp, "reset");
      toast.success("OTP verified. Now reset password");
      setOtpModal(false);
      setResetModal(true);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Invalid OTP");
    }
  };

  const handleResetPassword = async () => {
    const { newPassword, confirmPassword } = resetData;
    const error = validatePassword(newPassword);
    setResetPasswordError(error);

    if (error) return;
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
  const handleResendOtp = async () => {
    try {
      const res = await generateOtp(data.email, "reset");
      toast.success("OTP resent");
      setOtpExpiresAt(res.data.expiresAt);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Resend failed");
    }
  };

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setResetData((prev) => ({ ...prev, newPassword }));
    setResetPasswordError(validatePassword(newPassword));
  };

  return (
    <>
      <form onSubmit={handleLogin} className="space-y-4 mb-6">
        <div>
          <label className="block text-gray-600 text-sm mb-2">Email</label>
          <input  type="email"
            className="w-full p-3 border border-gray-200 rounded-lg"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
            required/>
        </div>

        <div>
          <label className="block text-gray-600 text-sm mb-2">Password</label>
          <div className="relative">
            <input type={showPassword ? "text" : "password"}
              className="w-full p-3 border border-gray-200 rounded-lg pr-12"
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
              required/>

            <button type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <div className="text-right">
          <span className="text-blue-500 text-sm cursor-pointer" onClick={handleForgotPassword}>
            Forgot Password ?
          </span>
        </div>

        <button  type="submit"
          className="cursor-pointer w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600" >
          Login
        </button>
      </form>

      {otpModal && (
        <OtpVerifyModal
          email={data.email}
          onVerify={handleOtpVerify}
          onClose={() => setOtpModal(false)}
          onResend={handleResendOtp}
          expiresAt={otpExpiresAt}
        />
      )}


      {resetModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4 text-center">Reset Password</h2>

            <div className="relative mb-2">
              <input type={showResetNewPassword ? "text" : "password"}
                placeholder="New Password"
                className="w-full p-3 border border-gray-300 rounded pr-12"
                value={resetData.newPassword}
                onChange={handleNewPasswordChange} />

              <button  type="button"
                onClick={() => setShowResetNewPassword(!showResetNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer" >
                {showResetNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              
            </div>
            {resetPasswordError && <span className="text-red-500 text-sm mb-3 block">{resetPasswordError}</span>}

            <div className="relative mb-4">

              <input type={showResetConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                className="w-full p-3 border border-gray-300 rounded pr-12"
                value={resetData.confirmPassword}
                onChange={(e) => setResetData({ ...resetData, confirmPassword: e.target.value })}/>

              <button type="button"
                onClick={() => setShowResetConfirmPassword(!showResetConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer" >
                {showResetConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>

            </div>

            <button  onClick={handleResetPassword}
              className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 cursor-pointer" >
              Submit
            </button>
          </div>
        </div>
      )}
    </>
  );
}
