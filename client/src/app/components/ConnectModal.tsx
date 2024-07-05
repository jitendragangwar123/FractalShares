import Image from "next/image";
import GenericModal from "./GenericModal";
import { SetStateAction, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { toast } from "react-hot-toast";
import CopyButton from "./CopyButton";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  setAddress: (publicKey: string) => void;
};

interface WalletData {
  [key: string]: string;
}

const ConnectModal = ({ isOpen, onClose, setAddress }: Props) => {
  const [animate, setAnimate] = useState(false);
  const [walletData, setWalletData] = useState<WalletData>({});
  const [currentScreen, setCurrentScreen] = useState<
    "create" | "import" | null
  >("create");
  const [keypair, setKeypair] = useState({ publicKey: "", secret: "" });
  const [publicKeyToFund, setPublicKeyToFund] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [secret, setSecret] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const closeModal = () => {
    setAnimate(false);
    setTimeout(() => {
      onClose();
      setCurrentScreen(null);
    }, 400);
  };

  useEffect(() => {
    if (isOpen) {
      setAnimate(true);
      setCurrentScreen("create");
      generateKeypair();
    } else {
      setAnimate(false);
    }
  }, [isOpen]);

  const handleAttributeChange = (attribute: string, value: string) => {
    setWalletData((prevData) => ({ ...prevData, [attribute]: value }));
  };

  const connectWallet = () => {
    if (!(window as any).diam) {
      toast.error("Diam Wallet extension is not installed!");
      return;
    }
    (window as any).diam
      .connect()
      .then((res: { message: SetStateAction<string>[] }) => {
        const address: any = res.message[0];
        setAddress(address);
        toast.success("Wallet Connected!");
      })
      .catch((error: any) => {
        console.error("Failed to connect wallet:", error);
        toast.error("Failed to connect wallet!");
      });
  };

  const generateKeypair = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        "https://fractal-shares.vercel.app/createKeyPair",
        {
          method: "POST",
        }
      );
      const data = await response.json();
      setKeypair({
        publicKey: data.publicKey,
        secret: data.secret,
      });
      setPublicKeyToFund(data.publicKey);
      setIsLoading(false);
    } catch (error) {
      console.error("Error generating keypair:", error);
      toast.error("Error generating keypair");
      toast.dismiss();
      setIsLoading(false);
    }
  };

  const generatePublicKey = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        "https://fractal-shares.vercel.app/generatePublicKey",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ senderSecret: secret }),
        }
      );
      const data = await response.json();
      setPublicKey(data.publicKey);
      setIsLoading(false);
    } catch (error) {
      console.error("Error generating public key:", error);
      toast.error("Error generating public key");
      toast.dismiss();
      setIsLoading(false);
    }
  };

  const fundDiamTokens = async () => {
    try {
      setIsLoading(true);
      toast.loading("Wait for Transactions.....");
      const response = await fetch(
        "https://fractal-shares.vercel.app/fundDiamTokens",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ publicKey: publicKeyToFund }),
        }
      );
      const data = await response.json();
      toast.dismiss();
      toast.success("Wallet Connected!");
      setAddress(publicKeyToFund);
      closeModal();
      setIsLoading(false);
    } catch (error) {
      console.error("Error funding account:", error);
      toast.error("Error funding account.");
      toast.dismiss();
      setIsLoading(false);
    }
  };

  return (
    <GenericModal
      isOpen={isOpen}
      onClose={closeModal}
      animate={animate}
      className="w-[90vw] mx-auto md:h-[30rem] font-serif md:w-[45rem] justify-between justify-items-center text-white"
    >
      <div className="flex p-4 w-full items-center lg:p-0 lg:grid lg:grid-cols-5">
        <div className="basis-5/6 lg:col-span-2 lg:border-r-[1px] lg:border-solid lg:border-outline-grey lg:py-4 lg:pl-8"></div>
      </div>
      <div className="flex flex-col flex-1 lg:grid lg:grid-cols-5">
        <div className="px-8 py-8 lg:h-full lg:col-span-2 lg:border-r-[1px] lg:border-solid lg:border-outline-grey">
          <div className="flex flex-col items-center gap-4 pt-14">
            <Image
              className="border border-transparent"
              src="/diamante-logo.png"
              alt="Diamante logo"
              width={100}
              height={100}
            />
            <Button onClick={() => setCurrentScreen("create")}>
              <div className="flex justify-center gap-2">Create Wallet</div>
            </Button>
            <Button onClick={() => setCurrentScreen("import")}>
              <div className="flex justify-center gap-2">Import Wallet</div>
            </Button>
            <Button
              onClick={() => {
                connectWallet();
                closeModal();
              }}
            >
              <div className="flex justify-center gap-2">Connect Wallet</div>
            </Button>
          </div>
        </div>
        <div className="p-4 border-t-[.5px] border-solid border-red h-fit lg:h-full lg:border-none lg:col-span-3 lg:px-8 lg:py-0 lg:flex lg:flex-col">
          {currentScreen === "create" && (
            <>
              <h2 className="xl:text-center lg:mb-[3rem] lg:text-[2.125em] font-bold">
                Create a wallet
              </h2>

              <label
                className="block text-gray-600 dark:text-gray-200 text-xl font-medium mt-8 mb-2"
                htmlFor="publicKey"
              >
                Public Key
              </label>
              <div className="flex flex-row gap-2">
                <input
                  type="text"
                  id="publicKey"
                  value={keypair.publicKey}
                  onChange={(e) =>
                    handleAttributeChange("PUBLIC_KEY", e.target.value)
                  }
                  className="p-2 rounded-md border border-gray-300 w-full mb-2 text-black"
                  placeholder="Enter Public Key"
                />
                <CopyButton data={keypair.publicKey} />
              </div>
              <label
                className="block text-gray-600 dark:text-gray-200 text-xl font-medium mb-2"
                htmlFor="privateKey"
              >
                Private Key
              </label>
              <div className="flex flex-row gap-2">
                <input
                  type="text"
                  id="privateKey"
                  value={keypair.secret}
                  onChange={(e) =>
                    handleAttributeChange("PRIVATE_KEY", e.target.value)
                  }
                  className="p-2 rounded-md border border-gray-300 w-full mb-2 text-black"
                  placeholder="Enter Private Key"
                />
                <CopyButton data={keypair.secret} />
              </div>

              <div className="flex flex-row gap-2 justify-center mt-4">
                <button
                  type="button"
                  className="bg-blue-600 py-2 px-8 rounded text-white hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed"
                  onClick={generateKeypair}
                  disabled={isLoading}
                >
                  Create New Keys
                </button>

                <button
                  onClick={fundDiamTokens}
                  className="bg-blue-600 py-2 px-8 rounded text-white hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  disabled={isLoading || !keypair.publicKey || !keypair.secret}
                >
                  Login
                </button>
              </div>
            </>
          )}

          {currentScreen === "import" && (
            <>
              <h2 className="xl:text-center lg:mb-[3rem] lg:text-[2.125em] font-bold">
                Import a wallet
              </h2>

              <label
                className="block text-gray-600 dark:text-gray-200 text-xl mt-8 font-medium mb-2"
                htmlFor="privateKey"
              >
                Private Key
              </label>
              <div className="flex flex-row gap-2">
                <input
                  type="text"
                  id="privateKey"
                  value={secret}
                  onChange={(e) => setSecret(e.target.value)}
                  className="p-2 rounded-md border border-gray-300 w-full mb-2 text-black"
                  placeholder="Enter Private Key"
                />
                <CopyButton data={secret} />
              </div>
              <label
                className="block text-gray-600 dark:text-gray-200 text-xl font-medium mb-2"
                htmlFor="publicKey"
              >
                Public Key
              </label>
              <div className="flex flex-row gap-2">
                <input
                  type="text"
                  id="publicKey"
                  value={publicKey}
                  onChange={(e) =>
                    handleAttributeChange("PUBLIC_KEY", e.target.value)
                  }
                  className="p-2 rounded-md border border-gray-300 w-full mb-2 text-black"
                  placeholder="Enter Public Key"
                />
                <CopyButton data={publicKey} />
              </div>
              <div className="flex flex-row gap-2 justify-center mt-4">
                <button
                  onClick={generatePublicKey}
                  className="bg-blue-600 py-2 px-8 rounded text-white hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  disabled={isLoading || !secret}
                >
                  Generate Address
                </button>
                <button
                  type="button"
                  className="bg-blue-600 py-2 px-8 rounded text-white hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed"
                  onClick={() => {
                    setAddress(publicKey);
                    toast.success("Wallet Connected!");
                    closeModal();
                  }}
                  disabled={isLoading || !secret || !publicKey}
                >
                  Login
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </GenericModal>
  );
};

export default ConnectModal;
