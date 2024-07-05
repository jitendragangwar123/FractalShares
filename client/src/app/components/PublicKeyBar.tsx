"use client";

import React from "react";
import Blockies from "react-blockies";
import { Dispatch, SetStateAction } from "react";

const PublicKeyBar = ({
  setOpenConnectedModal,
  publicKey,
}: {
  publicKey: string;
  setOpenConnectedModal: Dispatch<SetStateAction<boolean>>;
}) => {
  const toggleModal = () => {
    setOpenConnectedModal((prev) => !prev);
  };

  if (!publicKey) {
    return (
      <button
        onClick={toggleModal}
        className="bg-blue-600 hover:bg-blue-800 py-2 px-4 text-white rounded-full transition duration-300"
      >
        Connect Wallet
      </button>
    );
  }

  return (
    <button
      onClick={toggleModal}
      className="bg-blue-600 hover:bg-blue-800 py-2 px-4 text-white rounded-full transition duration-300"
    >
      <span className="flex items-center">
        <Blockies seed={publicKey} className="rounded-full h-8 w-8 mr-2" />
        {publicKey?.slice(0, 10).concat("...").concat(publicKey?.slice(-10))}
      </span>
    </button>
  );
};

export default PublicKeyBar;
