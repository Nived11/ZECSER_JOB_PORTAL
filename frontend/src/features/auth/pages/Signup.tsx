import SignupForm from "../components/SignupForm";
import { useNavigate } from "react-router-dom";
import SocialLinks from "../components/SocialLinks";

export default function Signup() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-6">
        <div className="text-center mb-5">
          <h1 className="text-2xl font-bold text-gray-800">Logo</h1>
        </div>

        <div className="flex mb-6">
          <button onClick={() => navigate("/")} className="flex-1 text-blue-300 font-semibold text-center pb-2 cursor-pointer">
            Login
          </button>
          <button className="flex-1 text-blue-500 font-semibold text-center pb-2 relative">
            Sign Up
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />
          </button>
        </div>
        <div className="signup-heading mb-5">
          <h2 className="text-xl font-bold text-gray-800 mb-1">
            Create an account
          </h2>
          <p className="text-gray-600 text-sm">
            Build your profile, connect with peers, and discover jobs.
          </p>
        </div>

        <SignupForm />

        <SocialLinks />
       
      </div>
    </div>
  );
}
