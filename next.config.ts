import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "upload.wikimedia.org",
      "picsum.photos",
      "res.cloudinary.com",
      "salt.tikicdn.com",
      "lh3.googleusercontent.com",
    ],
  },
  async redirects() {
    return [
      {
        source: "/trang-chu",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
