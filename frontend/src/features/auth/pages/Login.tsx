import LoginForm from "../components/LoginForm";
import SocialLinks from "../components/SocialLinks";
import { useNavigate } from "react-router-dom";


export default function Login() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center p-4 ">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Logo</h1>
        </div>

        <div className="flex mb-8">
          <button className="flex-1 text-blue-500 font-semibold text-center pb-2 relative">
            Login
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />
          </button>
          <button onClick={() => navigate("/signup")} className="flex-1 cursor-pointer text-blue-300 font-semibold text-center pb-2">
            Sign Up
          </button>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Welcome Back!</h2>
          <p className="text-gray-600 text-sm">
            Log in to your account to connect with professionals and explore opportunities.
          </p>
        </div>

        <LoginForm />

        <SocialLinks />
       
      </div>
    </div>
  );
}
