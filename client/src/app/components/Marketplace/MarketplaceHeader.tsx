"use client";

import { useEffect, useRef, useState } from "react";
import useTheme from "../../hooks/useTheme";
import ThemeSwitch from "../Theme";
import NetworkSwitcher from "../NetworkSwitcher";
import ConnectModal from "../ConnectModal";
import Image from "next/image";
import { toast } from "react-hot-toast";
import Link from "next/link";

const MarketplaceHeader = () => {
    const [openConnectModal, setOpenConnectModal] = useState(false);
    const [openMenu, setOpenMenu] = useState(false);
    const [publicKey, setPublicKey] = useState('');
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    const toggleModal = () => {
        setOpenConnectModal((prev) => !prev);
    };

    const toggleMenu = () => {
        setOpenMenu((prev) => !prev);
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
                className="w-full fixed top-0 z-10 font-serif font-bold flex justify-between items-center gap-4 py-2 px-4 md:py-4 md:px-10 bg-white dark:bg-gray-800/50 backdrop-blur-2xl lg:bg-gray-200 lg:dark:bg-zinc-800/50"
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

                <div className="flex items-center gap-4 ml-auto md:flex md:gap-8">
                    <Link href="/marketplace" legacyBehavior>
                        <a className="text-gery-300 text-xl hover:underline">Marketplace</a>
                    </Link>
                    <Link href="/portfolio" legacyBehavior>
                        <a className="text-gery-300 text-xl mr-2 hover:underline">Portfolio</a>
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    {publicKey ? (
                        <div className="flex items-center gap-4">
                            <button
                                className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-full transition duration-300"
                                onClick={() => copyToClipboard(publicKey)}
                            >
                                {shortenPublicKey(publicKey)}
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={toggleModal}
                            className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-full transition duration-300"
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

                <div
                    className={`w-screen transition-all duration-300 ease-in-out grid md:hidden ${openMenu
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                        }`}
                >
                    <div className="overflow-hidden">
                        <div className="flex flex-wrap gap-8">
                            {publicKey ? (
                                <div className="flex items-center gap-4">
                                    <button
                                        className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-full transition duration-300"
                                        onClick={() => copyToClipboard(publicKey)}
                                    >
                                        {shortenPublicKey(publicKey)}
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={toggleModal}
                                    className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-full transition duration-300"
                                >
                                    Connect Wallet
                                </button>
                            )}

                            <NetworkSwitcher />
                        </div>
                    </div>
                </div>

                <button
                    title="toggle menu"
                    onClick={toggleMenu}
                    className="flex flex-col items-center justify-center gap-2 md:hidden"
                >
                    <div
                        className={`w-[1.5em] h-[2px] ${theme === "dark" ? "bg-white" : "bg-black"
                            } rounded-full transition-all duration-300 ease-in-out ${openMenu
                                ? "rotate-45 translate-y-[0.625em]"
                                : "rotate-0 translate-y-0"
                            }`}
                    ></div>
                    <div
                        className={`w-[1.5em] h-[2px] ${theme === "dark" ? "bg-white" : "bg-black"
                            } rounded-full transition-all duration-300 ease-in-out ${openMenu ? "opacity-0" : "opacity-100"
                            }`}
                    ></div>
                    <div
                        className={`w-[1.5em] h-[2px] ${theme === "dark" ? "bg-white" : "bg-black"
                            } rounded-full transition-all duration-300 ease-in-out ${openMenu
                                ? "-rotate-45 translate-y-[-0.625em]"
                                : "rotate-0 translate-y-0"
                            }`}
                    ></div>
                </button>
            </header>

            <ConnectModal isOpen={openConnectModal} onClose={toggleModal} setAddress={setPublicKey} />
        </>
    );
};

export default MarketplaceHeader;
