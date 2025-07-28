import { useEffect, useState } from "react";
import axios from "axios";
import ApiPath from "../ApiPath";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

interface UserData {
  name: string;
}

export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await axios.get(`${ApiPath}/home`, { withCredentials: true });
      setUser(res.data);
    } catch (err: any) {
      console.error("Fetch user failed:", err);
      toast.error(err?.response?.data?.message );
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const res = await axios.post(`${ApiPath}/logout`, {}, { withCredentials: true });
      toast.success(res.data.message);
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      console.error("Logout error:", err);
      toast.error("Logout failed. Try again.");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-100 to-purple-200 px-4">
      <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center border border-gray-100">
        {loading ? (
          <h1 className="text-xl font-semibold text-gray-600">Loading...</h1>
        ) : user ? (
          <>
            <h1 className="text-3xl font-bold text-purple-600 mb-4">
              👋 Welcome, {user.name}
            </h1>
            <button
              onClick={handleLogout}
              className="mt-6 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors cursor-pointer shadow-lg"
            >
              Logout
            </button>
          </>
        ) : (
          <h1 className="text-xl font-semibold text-red-500">
            Failed to load user data.
          </h1>
        )}
      </div>
    </div>
  );
}
