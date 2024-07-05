"use client";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import Blockies from "react-blockies";
import Image from "next/image";
import GenericModal from "./GenericModal";
import AccountBalance from "./AccountBalance";
import { toast } from "react-hot-toast";

interface Props {
  openConnectedModal: boolean;
  publicKey: string;
  closeConnectedModal: () => void;
  setPublicKey: Dispatch<SetStateAction<string | null>>;
}

const UserModal: React.FC<Props> = ({
  openConnectedModal,
  publicKey,
  closeConnectedModal,
  setPublicKey,
}) => {
  const [animate, setAnimate] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const closeModal = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setAnimate(false);
    setTimeout(() => {
      closeConnectedModal();
    }, 400);
  };

  useEffect(() => {
    if (openConnectedModal) {
      setAnimate(true);
    } else {
      setAnimate(false);
    }
  }, [openConnectedModal]);

  useEffect(() => {
    const id = setTimeout(() => {
      setIsCopied(false);
    }, 1500);

    return () => clearTimeout(id);
  }, [isCopied]);

  const handleCopyClick = () => {
    if (!publicKey) return;
    navigator.clipboard.writeText(publicKey);
    setIsCopied(true);
  };

  const handleDisconnect = () => {
    setPublicKey("");
    toast.success("Wallet Disconnected!");
    closeModalHandler();
  };

  const closeModalHandler = () => {
    setAnimate(false);
    setTimeout(() => {
      closeConnectedModal();
    }, 400);
  };

  return (
    <GenericModal
      isOpen={openConnectedModal}
      onClose={closeModalHandler}
      animate={animate}
      className="w-[80vw] h-[60vh] mx-auto md:w-[25rem] md:h-[30rem] text-white"
    >
      <div className="flex flex-col items-center justify-center h-full w-full">
        <div className="flex h-[80%] w-[80%] flex-col items-center justify-evenly">
          <Blockies
            seed={publicKey}
            scale={15}
            className="rounded-full h-24 w-24 mb-3"
          />
          <AccountBalance publicKey={publicKey} />
          <span className="flex justify-between p-3 border-[1px] border-outline-gray rounded-full w-full">
            <span className="flex justify-center">
              {publicKey
                ?.slice(0, 10)
                .concat("...")
                .concat(publicKey?.slice(-10))}
            </span>
            <Image
              onClick={handleCopyClick}
              className="border-l-[1px] border-outline-grey border-solid pl-1 cursor-pointer"
              src={isCopied ? "/assets/tick.svg" : "/assets/copy.svg"}
              width={20}
              height={20}
              alt="#"
            />
          </span>
          <button
            onClick={handleDisconnect}
            className="p-3 w-full rounded-lg bg-blue-600 hover:bg-blue-800"
          >
            Disconnect
          </button>
        </div>
      </div>
    </GenericModal>
  );
};

export default UserModal;
