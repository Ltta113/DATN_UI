"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook } from "@fortawesome/free-brands-svg-icons";
import { useFacebookAuth } from "hooks/useFacebookAuth";

export const FacebookButton = () => {
  const facebookAuth = useFacebookAuth();

  return (
    <button
      type="button"
      onClick={() => facebookAuth.mutate()}
      className="flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 cursor-pointer"
    >
      <FontAwesomeIcon icon={faFacebook} className="h-5 w-5 mr-2" />
      <span>Facebook</span>
    </button>
  );
};
