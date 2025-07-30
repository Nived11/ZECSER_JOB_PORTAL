import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { registerUser, generateOtp, verifyOtp } from "../services/authService";
import OtpVerifyModal from "../components/OtpVerifyModal";

export default function SignupForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [showOtpModal, setShowOtpModal] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await registerUser({ ...formData, role: "employee" });
      await generateOtp(formData.email);
      toast.success(res.data.message);
      setShowOtpModal(true);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Signup failed");
    }
  };

  const handleOtpVerify = async (otp: string) => {
    try {
      const res = await verifyOtp(formData.email, otp);
      Cookies.set("token", res.data.token);
      toast.success(res.data.message);
      setShowOtpModal(false);
      setTimeout(() => navigate("/home"), 2000);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Invalid OTP");
    }
  };

  return (
    <>
      <form onSubmit={handleRegister} className="space-y-4 mb-6">
        <div>
          <label className="block text-gray-600 text-sm mb-2">Full Name</label>
          <input type="text" className="w-full p-2.5 border border-gray-200 rounded-lg"
            value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
        </div>

        <div>
          <label className="block text-gray-600 text-sm mb-2">Email</label>
          <input type="email" className="w-full p-2.5 border border-gray-200 rounded-lg"
            value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
        </div>

        <div>
          <label className="block text-gray-600 text-sm mb-2">Password</label>
          <div className="relative">
            <input type={showPassword ? "text" : "password"} className="w-full p-2.5 border border-gray-200 rounded-lg pr-12"
              value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />

            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <div className="flex items-start text-xs text-gray-600 gap-2">
          <input type="checkbox" className="mt-1" required />
          <label>
            I agree to the{" "}
            <span className="text-blue-500 cursor-pointer">Terms</span> and{" "}
            <span className="text-blue-500 cursor-pointer">Privacy Policy</span>
          </label>
        </div>

        <button type="submit" className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600">
          Sign Up
        </button>
      </form>


      {showOtpModal && (
        <OtpVerifyModal email={formData.email}
          onVerify={handleOtpVerify}
          onClose={() => setShowOtpModal(false)} />)}

    </>
  );
}
