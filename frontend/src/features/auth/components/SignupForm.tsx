import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { registerUser, generateOtp, verifyOtp } from "../services/authService";
import OtpVerifyModal from "../components/OtpVerifyModal";
import { validatePassword, validateEmail, validateName } from "../../../utils/validators";

export default function SignupForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [NameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpExpiresAt, setOtpExpiresAt] = useState<string>("");


  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const enteredName = validateName(formData.name);
    const enteredEmail = validateEmail(formData.email);
    const enteredPassword = validatePassword(formData.password);

    if (enteredName) { setNameError(enteredName); return; }
    if (enteredEmail) { setEmailError(enteredEmail); return; }
    if (enteredPassword) { setPasswordError(enteredPassword); return; }
    if (formData.password !== formData.confirmPassword) { setConfirmError("Passwords do not match"); return; }

    setConfirmError(null)

    try {
      const res = await generateOtp(formData.email, "signup");
      toast.success("OTP sent to email");
      localStorage.setItem("temp_signup", JSON.stringify(formData));
      setOtpExpiresAt(res.data.expiresAt);
      setShowOtpModal(true);
    } catch (err: any) {
      toast.error(err?.response?.data?.message);
    }
  };

  const handleOtpVerify = async (otp: string) => {
    try {
      await verifyOtp(formData.email, otp, "signup");
      const storedData = localStorage.getItem("temp_signup");
      if (!storedData) return toast.error("No signup data found!");

      const parsedData = JSON.parse(storedData);
      const res = await registerUser({ ...parsedData, role: "employee" });
      toast.success(res.data.message);
      localStorage.removeItem("temp_signup");
      setTimeout(() => navigate("/"), 2000);
      setShowOtpModal(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Invalid OTP");
    }
  };
  const handleResendOtp = async () => {
    try {
      const res = await generateOtp(formData.email, "signup");
      toast.success("OTP resent");
      setOtpExpiresAt(res.data.expiresAt);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Resend failed");
    }
  };

  return (
    <>
      <form onSubmit={handleRegister} className="space-y-4 mb-6">
        <div>
          <label className="block text-gray-600 text-sm mb-2">Full Name</label>
          <input type="text" className="w-full p-2  border border-gray-200 rounded-lg outline-none focus:border-blue-300"
            value={formData.name}
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value });
              setNameError(validateName(e.target.value));
            }} required />
          {NameError && (
            <span className="text-xs text-red-500">{NameError}</span>
          )}
        </div>

        <div>
          <label className="block text-gray-600 text-sm mb-2">Email</label>
          <input type="email" className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:border-blue-300"
            value={formData.email}
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value });
              setEmailError(validateEmail(e.target.value));
            }} required />
          {emailError && (
            <span className="text-xs text-red-500">{emailError}</span>
          )}
        </div>

        <div>
          <label className="block text-gray-600 text-sm mb-2">Password</label>
          <div className="relative">
            <input type={showPassword ? "text" : "password"}
              className={`w-full p-2 border pr-12 rounded-lg outline-none focus:border-blue-300 ${passwordError ? "border-red-500" : "border-gray-200"}`}
              value={formData.password}
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value });
                setPasswordError(validatePassword(e.target.value));
              }} required />

            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer">
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {passwordError && (
            <span className="text-xs text-red-500">{passwordError}</span>
          )}
        </div>

        <div>
          <label className="block text-gray-600 text-sm mb-2">Confirm Password</label>
          <div className="relative">
            <input type={showConfirmPassword ? "text" : "password"}
              className={`w-full p-2 border rounded-lg outline-none focus:border-blue-300 ${confirmError ? "border-red-500" : "border-gray-200"}`}
              value={formData.confirmPassword}
              onChange={(e) => {
                setFormData({ ...formData, confirmPassword: e.target.value });
                if (formData.password !== e.target.value) {
                  setConfirmError("Passwords do not match");
                } else {
                  setConfirmError(null);
                }
              }} required />

            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer" >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {confirmError && <span className="text-xs text-red-500">{confirmError}</span>}
        </div>


        <div className="flex items-start text-xs text-gray-600 gap-2">
          <input type="checkbox" className="mt-1" required />
          <label>
            I agree to the{" "}
            <span className="text-blue-500 cursor-pointer">Terms</span> and{" "}
            <span className="text-blue-500 cursor-pointer">Privacy Policy</span>
          </label>
        </div>

        <button type="submit" className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 cursor-pointer">
          Sign Up
        </button>
      </form>

      {showOtpModal && (
        <OtpVerifyModal
          email={formData.email}
          expiresAt={otpExpiresAt}
          onVerify={handleOtpVerify}
          onClose={() => { localStorage.removeItem("temp_signup"); setShowOtpModal(false); }}
          onResend={handleResendOtp}
        />
      )}
    </>
  );
}
