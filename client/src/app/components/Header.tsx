"use client";

import { useEffect, useRef, useState } from "react";
import useTheme from "../hooks/useTheme";
import ThemeSwitch from "./Theme";
import NetworkSwitcher from "./NetworkSwitcher";
import ConnectModal from "./ConnectModal";
import Image from "next/image";
import { toast } from "react-hot-toast";

const Header = () => {
  const [openConnectModal, setOpenConnectModal] = useState(false);
  const [openConnectedModal, setOpenConnectedModal] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [publicKey, setPublicKey] = useState('');
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const toggleModal = () => {
    setOpenConnectModal((prev) => !prev);
  };

  const toggleMenu = () => {
    setOpenMenu((prev) => !prev);
  };

  const toggleUserModal = () => {
    setOpenConnectedModal((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  useEffect(() => {
    const closeOnEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        toggleModal();
      }
    };
    document.body.addEventListener("keydown", closeOnEscapeKey);
    return () => {
      document.body.removeEventListener("keydown", closeOnEscapeKey);
    };
  }, []);

  useEffect(() => {
    if (openConnectModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [openConnectModal]);

  const { theme, changeTheme } = useTheme();

  const shortenPublicKey = (key: string) => {
    if (key.length > 16) {
      return `${key.slice(0, 8)}......${key.slice(-8)}`;
    }
    return key;
  };

  const copyToClipboard = (key: string) => {
    navigator.clipboard.writeText(key).then(
      () => {
        toast.success("Public key copied to clipboard!");
      },
      (err) => {
        toast.error("Failed to copy public key.");
        console.error("Failed to copy: ", err);
      }
    );
  };

  return (
    <>
      <header
        ref={dropdownRef}
        className="w-full fixed backdrop-blur-2xl font-serif font-bold dark:border-neutral-800 lg:bg-gray-200 lg:dark:bg-zinc-800/50 left-0 top-0 z-10 flex flex-wrap gap-4 py-2 px-4 md:py-4 md:px-10 justify-between items-center"
      >
        <div className="flex items-center gap-4">
          <a href="/">
            <div className="p-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full">
              <div className="bg-white p-1 rounded-full">
                <Image
                  className="border border-transparent"
                  src="/logo1.png"
                  alt="logo1"
                  width={100}
                  height={100}
                />
              </div>
            </div>
          </a>
        </div>

        <div className="hidden md:flex gap-8">
          {publicKey ? (
            <div className="flex justify-end items-center">
              <button
                className="mx-3 bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-full transition duration-300"
                onClick={() => copyToClipboard(publicKey || "")}
              >
                {shortenPublicKey(publicKey || "")}
              </button>
            </div>
          ) : (
            <button
              onClick={toggleModal}
              className="hidden md:block bg-blue-600 hover:bg-blue-800 text-white text-bold py-2 px-4 rounded-full transition duration-300"
            >
              Connect Wallet
            </button>
          )}
          <NetworkSwitcher />

          <ThemeSwitch
            className="flex md:hidden lg:hidden sm:hidden dark:transform-none transform dark:translate-none transition-all duration-500 ease-in-out"
            action={changeTheme}
            theme={theme}
            openMenu={openMenu}
          />
        </div>

        <div className="flex items-center md:hidden gap-8">
          <ThemeSwitch
            className="flex md:hidden dark:transform-none transform dark:translate-none transition-all duration-500 ease-in-out"
            action={changeTheme}
            theme={theme}
            openMenu={openMenu}
          />

          <button
            title="toggle menu"
            onClick={toggleMenu}
            className="flex flex-col gap-2 md:hidden"
          >
            <div
              className={`w-[1.5em] h-[2px] ${theme === "dark" ? "bg-[#ffffff]" : "bg-[#000000]"
                } rounded-full transition-all duration-300 ease-in-out ${openMenu
                  ? "rotate-45 translate-y-[0.625em]"
                  : "rotate-0 translate-y-0"
                }`}
            ></div>
            <div
              className={`w-[1.5em] h-[2px] ${theme === "dark" ? "bg-[#ffffff]" : "bg-[#000000]"
                } rounded-full transition-all duration-300 ease-in-out ${openMenu ? "opacity-0" : "opacity-100"
                }`}
            ></div>
            <div
              className={`w-[1.5em] h-[2px] ${theme === "dark" ? "bg-[#ffffff]" : "bg-[#000000]"
                } rounded-full transition-all duration-300 ease-in-out ${openMenu
                  ? "-rotate-45 translate-y-[-0.625em]"
                  : "rotate-0 translate-y-0"
                }`}
            ></div>
          </button>
        </div>

        <div
          className={`w-screen transition-all duration-300 ease-in-out grid ${openMenu
            ? "min-h-[4rem] grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
            } md:hidden`}
        >
          <div className="overflow-hidden">
            <div className="flex flex-wrap gap-8">
              {publicKey ? (
                <div className="flex justify-end items-center">
                  <button
                    className="mx-3 bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-full transition duration-300"
                    onClick={() => copyToClipboard(publicKey || "")}
                  >
                    {shortenPublicKey(publicKey || "")}
                  </button>
                </div>
              ) : (
                <button
                  onClick={toggleModal}
                  className="bg-blue-600 hover:bg-blue-800 text-white py-2 px-4 rounded-full transition duration-300"
                >
                  Connect Wallet
                </button>
              )}
              <NetworkSwitcher />
            </div>
          </div>
        </div>
      </header>

      <ConnectModal isOpen={openConnectModal} onClose={toggleModal} setAddress={setPublicKey} />
    </>
  );
};

export default Header;
