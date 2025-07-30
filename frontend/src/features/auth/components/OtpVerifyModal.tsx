import { useState } from "react";

interface Props {
  email: string;
  onVerify: (otp: string) => void;
  onClose: () => void;
}

export default function OtpVerifyModal({ email, onVerify, onClose }: Props) {
  const [otp, setOtp] = useState("");

  return (
    <div className="fixed inset-0 bg-white/50 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-white/70 p-6 rounded-xl shadow-xl w-full max-w-sm relative">

        <button onClick={onClose} className="absolute right-3 top-3 text-gray-400 hover:text-red-500 text-lg font-bold">
          ✕
        </button>

        <h2 className="text-lg font-semibold mb-4 text-center">Enter OTP sent to {email}</h2>
        
        <input type="text"  placeholder="Enter OTP"
          className="w-full p-3 border border-gray-300 rounded mb-4"
          value={otp}  onChange={(e) => setOtp(e.target.value)} />

        <button  onClick={() => onVerify(otp)} className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600">
          Verify
        </button>

      </div>
    </div>
  );
}
