import { useEffect, useState } from "react";

interface Props {
  value: string;
  method: "email" | "phone";
  onVerify: (otp: string) => void;
  onClose: () => void;
  onResend: () => void;
  expiresAt: string;
}

export default function OtpVerifyModal({ value, method, onVerify, onClose, onResend, expiresAt, }: Props) {
  const [otp, setOtp] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    const expiry = new Date(expiresAt).getTime();

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = Math.max(0, Math.floor((expiry - now) / 1000));
      setSecondsLeft(diff);
      if (diff === 0) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  return (
    <div className="fixed inset-0 bg-white/50 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-white/70 p-8 rounded-xl shadow-xl w-full max-w-sm relative">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-gray-400 hover:text-red-500 text-lg font-bold cursor-pointer">
          ✕
        </button>

        <h2 className="text-lg font-semibold mb-4 text-center">
           Enter OTP sent to your {method}: <span className="font-mono text-sm">{value}</span>
        </h2>

        <input
          type="text"
          placeholder="______"
          maxLength={6}
          autoFocus
          className="w-full p-3 border border-gray-300 rounded mb-4 pl-8 text-right font-bold tracking-[35px] text-lg "
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <button
          onClick={() => onVerify(otp)}
          className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 cursor-pointer" >
          Verify
        </button>

        {secondsLeft > 0 ? (
          <p className="text-center text-sm mt-4 text-gray-600">
            Resend OTP in {Math.floor(secondsLeft / 60).toString().padStart(2, "0")}:{(secondsLeft % 60).toString().padStart(2, "0")}
          </p>
        ) : (
          <p className="text-center text-sm mt-4">
            Didn't get the OTP?{" "}
            <span onClick={onResend}
              className="text-blue-600 cursor-pointer font-medium hover:underline cursor-pointer" >
              Resend OTP
            </span>
          </p>
        )}
      </div>
    </div>
  );
}
