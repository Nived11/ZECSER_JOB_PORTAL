import { FaFacebookF, FaApple } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export default function SocialLinks(){
    return(
        <>
         <div className="login-social text-center">
          <p className="login-social-label text-gray-600 text-sm mb-4">Or Continue With</p>
          <div className="login-social-buttons flex justify-center space-x-6">
            <button className="social-icon flex flex-col items-center space-y-1 cursor-pointer">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-gray-300">
                <FcGoogle size={20} className="text-[#DB4437]" />

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
        </>
    )
}