import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FaGoogle, FaFacebookF, FaApple } from "react-icons/fa";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import ApiPath from "../ApiPath";

export default function Signup() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [otp, setOtp] = useState("");
    const [showOtpModal, setShowOtpModal] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Register user
            await axios.post(`${ApiPath}/register`, {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: "employee",
            });

            // Generate OTP
            await axios.post(`${ApiPath}/generate-otp`, {
                email: formData.email,
            });

            toast.success("Check your email for the OTP.");
            setShowOtpModal(true);
        } catch (err: any) {
            console.error("Signup error:", err);
            toast.error(err?.response?.data?.message || "Signup failed");
        }
    };

    const handleOtpVerify = async () => {
        try {
            const res = await axios.post(`${ApiPath}/verify-otp`, {
                email: formData.email,
                otp,
            });

            Cookies.set("token", res.data.token);
            toast.success(res.data.message || "OTP Verified Successfully");

            setTimeout(() => {
                navigate("/home");
            }, 2000);
        } catch (err: any) {
            console.error("OTP verify error:", err);
            toast.error(err?.response?.data?.message || "Invalid OTP");
        }
    };

    return (
        <div className="signup-container min-h-screen bg-white flex items-center justify-center p-4">
            <div className="signup-box w-full max-w-md  rounded-3xl shadow-lg p-6  bg-[#FAF9F6]">
                {/* Logo */}
                <div className="logo-section text-center mb-5">
                    <h1 className="text-2xl font-bold text-gray-800">Logo</h1>
                </div>

                {/* Tabs */}
                <div className="signup-tabs flex mb-6">
                    <button onClick={() => navigate("/")}
                        className="tab-login flex-1 text-blue-300 font-semibold text-center pb-2 relative cursor-pointer">
                        Login
                    </button>
                    <button className="tab-signup flex-1 text-blue-500 font-semibold text-center pb-2 relative">
                        Sign Up
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />
                    </button>
                </div>

                {/* Header Text */}
                <div className="signup-heading mb-5">
                    <h2 className="text-xl font-bold text-gray-800 mb-1">
                        Create an account
                    </h2>
                    <p className="text-gray-600 text-sm">
                        Build your profile, connect with peers, and discover jobs.
                    </p>
                </div>

                {/* Form Fields */}
                <form onSubmit={handleRegister} className="signup-form space-y-4 mb-6">
                    <div className="form-group">
                        <label className="block text-gray-600 text-sm mb-2">
                            Full Name
                        </label>
                        <input
                            type="text"
                            className="form-input w-full p-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-300"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value }) }
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="block text-gray-600 text-sm mb-2">Email</label>
                        <input
                            type="email"
                            className="form-input w-full p-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-300"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="block text-gray-600 text-sm mb-2">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="form-input w-full p-2.5  bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-300 pr-12"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value }) }
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer hover:text-gray-700 focus:outline-none" >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Terms Checkbox */}
                    <div className="flex items-start text-xs text-gray-600 gap-2">
                        <input type="checkbox" className="mt-1" required />
                        <label htmlFor="terms">
                            I agree to the{" "}
                            <span className="text-blue-500 cursor-pointer">
                                Terms & Conditions
                            </span>{" "}
                            and{" "}
                            <span className="text-blue-500 cursor-pointer">
                                Privacy Policy
                            </span>
                        </label>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="btn-submit w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors">
                        Sign Up
                    </button>
                </form>

                {/* Social */}
                <div className="social-login text-center">
                    <p className="text-gray-600 text-sm mb-4">Or Sign Up With</p>
                    <div className="flex justify-center space-x-6">
                        <button className="social-icon flex flex-col items-center space-y-1 cursor-pointer">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-gray-300">
                                <FaGoogle size={20} className="text-[#DB4437]" />
                            </div>
                            <span className="text-xs text-gray-600">Google</span>
                        </button>
                        <button className="social-icon flex flex-col items-center space-y-1 cursor-pointer">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-gray-300">
                                <FaFacebookF size={20} className="text-[#1877F2]" />
                            </div>
                            <span className="text-xs text-gray-600">Facebook</span>
                        </button>
                        <button className="social-icon flex flex-col items-center space-y-1 cursor-pointer">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-gray-300">
                                <FaApple size={20} className="text-black" />
                            </div>
                            <span className="text-xs text-gray-600">Apple ID</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* OTP Modal */}
            {showOtpModal && (
                <div className="fixed inset-0 bg-white bg-opacity-50 backdrop-blur-md flex items-center justify-center z-50">
                    <div className="bg-white/70 p-6 rounded-xl shadow-xl w-full max-w-sm border border-gray-200 backdrop-blur-lg">
                        <h2 className="text-lg font-semibold mb-4 text-center">
                            Enter OTP
                        </h2>
                        <input
                            type="text"
                            placeholder="Enter OTP"
                            className="w-full p-3 border border-gray-300 rounded mb-4"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                        />
                        <button
                            onClick={handleOtpVerify}
                            className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors cursor-pointer">
                            Verify
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
