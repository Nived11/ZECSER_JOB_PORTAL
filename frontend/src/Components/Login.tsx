import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FaGoogle, FaFacebookF, FaApple } from "react-icons/fa";
import ApiPath from "../ApiPath";
import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

export default function Login() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [data, setData] = useState({ email: "", password: "" });

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${ApiPath}/login`, data);
            if (res.status === 200) {
                toast.success(res.data.message);

                // store token in cookie
                Cookies.set("token", res.data.token);

                setTimeout(() => {
                    navigate("/home");
                }, 2000);
            }
        } catch (error: any) {
            console.log("Login error:", error);
            toast.error(
                error?.response?.data?.message || "Login failed. Please try again."
            );
        }
    };

    return (
        <div className="login-container min-h-screen flex items-center justify-center p-4 bg-white">
            <div className="login-card w-full max-w-md bg-[#FAF9F6] rounded-3xl shadow-lg p-6 ">
                {/* Logo */}
                <div className="login-logo text-center mb-8">
                    <h1 className="login-logo-text text-2xl font-bold text-gray-800">Logo</h1>
                </div>

                {/* Tabs */}
                <div className="login-tabs flex mb-8">
                    <button className="login-tab-active flex-1 text-blue-500 font-semibold text-center pb-2 relative cursor-pointer">
                        Login
                        <div className="login-tab-underline absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full"></div>
                    </button>
                    <button
                        onClick={() => navigate("/signup")}
                        className="login-tab-inactive flex-1 text-blue-300 font-semibold text-center pb-2 cursor-pointer"
                    >
                        Sign Up
                    </button>
                </div>

                {/* Headings */}
                <div className="login-heading mb-6">
                    <h2 className="login-heading-title text-xl font-bold text-gray-800 mb-2">
                        Welcome Back!
                    </h2>
                    <p className="login-heading-subtitle text-gray-600 text-sm">
                        Log in to your account to connect with professionals and explore opportunities.
                    </p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleLogin} className="login-form space-y-4 mb-6 ">
                    <div className="login-form-group">
                        <label className="login-form-label block text-gray-600 text-sm mb-2">Email</label>
                        <input
                            type="email"

                            value={data.email}
                            onChange={(e) => setData({ ...data, email: e.target.value })}
                            className="login-form-input w-full p-3  border border-gray-200 rounded-lg focus:outline-none focus:border-blue-300 bg-white"
                            required
                        />
                    </div>

                    <div className="login-form-group">
                        <label className="login-form-label block text-gray-600 text-sm mb-2">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}

                                value={data.password}
                                onChange={(e) => setData({ ...data, password: e.target.value })}
                                className="login-form-input w-full p-3 bg-[#FAF9F6] border border-gray-200 rounded-lg focus:outline-none focus:border-blue-300 pr-12 bg-white"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="login-password-toggle absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <div className="login-forgot text-right">
                        <span className="login-forgot-link text-blue-500 text-sm cursor-pointer">
                            Forgot Password
                        </span>
                    </div>

                    <button
                        type="submit"
                        className="login-submit w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors cursor-pointer"
                    >
                        Login
                    </button>
                </form>

                {/* Social Login */}
                <div className="login-social text-center">
                    <p className="login-social-label text-gray-600 text-sm mb-4">Or Continue With</p>
                    <div className="login-social-buttons flex justify-center space-x-6">
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
        </div>
    );
}
