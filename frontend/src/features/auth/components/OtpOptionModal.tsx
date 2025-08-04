interface Props {
  onSelect: (method: "email" | "phone") => void;
  onClose: () => void;
}

export default function OtpOptionModal({ onSelect, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-white/50 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-sm shadow-xl relative">
        
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-gray-400 hover:text-red-500 text-lg font-bold cursor-pointer" >
          ✕
        </button>

        <h2 className="text-lg font-semibold text-center mb-6">
          Choose OTP Delivery
        </h2>

        <div className="flex gap-4">
          <button
            onClick={() => onSelect("email")}
            className="w-1/2 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 cursor-pointer">
            Email
          </button>

          <button
            onClick={() => onSelect("phone")}
            className="w-1/2 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 cursor-pointer">
            Phone
          </button>

        </div>

        <p className="text-xs text-gray-500 mt-4 text-center">
          You can choose to receive the OTP via Email or Phone.
        </p>
      </div>
    </div>
  );
}
