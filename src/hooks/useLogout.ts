import axios from "axios";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

const useLogout = () => {
  const router = useRouter();

  const logout = async () => {
    try {
      await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {
        withCredentials: true,
      });

      localStorage.removeItem("access_token");
      localStorage.removeItem("user");

      router.push("/login");
    } catch {
      toast.error("Đăng xuất thất bại. Vui lòng thử lại!");
    }
  };

  return logout;
};

export default useLogout;
