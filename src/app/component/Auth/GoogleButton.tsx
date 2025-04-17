"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { useGoogleAuth } from "hooks/useGoogleAuth";

export const GoogleButton = () => {
  const googleAuth = useGoogleAuth();

  return (
    <button
      type="button"
      onClick={() => googleAuth.mutate()}
      className="flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 cursor-pointer"
    >
      <FontAwesomeIcon icon={faGoogle} className="h-5 w-5 mr-2" />
      <span>Google</span>
    </button>
  );
};
