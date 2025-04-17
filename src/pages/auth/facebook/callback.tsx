import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

const FacebookCallbackPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleFacebookCallback = async () => {
      if (!router.isReady) return;

      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/facebook/callback${window.location.search}`
        );

        localStorage.setItem("access_token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        router.push("/");
      } catch (error: unknown) {
        console.error("Lỗi xác thực Facebook", error);
        if (axios.isAxiosError(error) && error.response) {
          setError(error.response.data?.error || "Đã có lỗi xảy ra");
        } else {
          setError("Đã có lỗi xảy ra");
        }
      } finally {
        setLoading(false);
      }
    };

    if (router.isReady) {
      handleFacebookCallback();
    }
  }, [router]);

  if (loading) {
    return (
      <div className="text-center p-4">Đang xác thực tài khoản Facebook...</div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <p>Xác thực thất bại: {error}</p>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => router.push("/login")}
        >
          Quay lại trang đăng nhập
        </button>
      </div>
    );
  }

  return <div className="text-center p-4">Đang chuyển hướng...</div>;
};

export default FacebookCallbackPage;
