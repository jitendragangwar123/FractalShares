"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import Image from "next/image";
import toast from "react-hot-toast";

import {
  Keypair,
  Horizon,
  Networks,
  TransactionBuilder,
  BASE_FEE,
  Operation,
  Asset,
} from "diamante-sdk-js";

type PropertyCardProps = {
  _id: string;
  image: string;
  price: number;
  value: number;
  yieldPercentage: number;
  availableTokens: number;
  holdingTokens: number;
  earnedYield: number;
};

const PropertyCard: React.FC<PropertyCardProps> = ({
  _id,
  image,
  price,
  value,
  availableTokens,
  yieldPercentage,
  holdingTokens,
  earnedYield,
}) => {
  const [quantity, setQuantity] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleIncrement = () => setQuantity(quantity + 1);
  const handleDecrement = () => quantity > 0 && setQuantity(quantity - 1);

  const handleInvestment = async () => {
    const issuerSecret = process.env.NEXT_PUBLIC_SECRET_KEY;
    const issuerPublicKey =
      "GAAJQUQU27YPLDOWTUTFPJK4F2HC22XREDGH5Z4WH4I5MILWDWUXXTGF";
    const amountLimit = "1000";
    const assetName = "RubyToken";

    try {
      setIsLoading(true);

      if (quantity <= 0) {
        toast.error("Amount should be greater than Zero!");
        setIsLoading(false);
        return;
      }
      // Step 2: Connect to wallet
      const ext_resp = await (window as any).diam.connect();
      if (ext_resp.status !== 200) {
        toast.error("Connect your wallet!");
        setIsLoading(false);
        return;
      }
      const receiverPublicKey = ext_resp.message[0];

      toast.loading("Wait for Transactions...");
      // Step 3: Create asset and change trust
      const server = new Horizon.Server("https://diamtestnet.diamcircle.io");
      const asset = new Asset(assetName, issuerPublicKey);
      const receiverAccount = await server.loadAccount(receiverPublicKey);

      const transaction = new TransactionBuilder(receiverAccount, {
        fee: BASE_FEE,
        networkPassphrase: "Diamante Testnet",
      })
        .addOperation(Operation.changeTrust({ asset, limit: amountLimit }))
        .setTimeout(0)
        .build();

      const xdr = (transaction as any).toXDR("base64");
      const signResp = await (window as any).diam.sign(
        xdr,
        true,
        "Diamante Testnet"
      );
      if (signResp.response.status !== 200) {
        toast.dismiss();
        toast.error("Error signing transaction");
        setIsLoading(false);
        return;
      }

      // Step 4: Issue assets
      const issueAsset = await fetch("http://localhost:8000/issueAssets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          issuerSecret,
          receiverPublicKey,
          assetName,
          amount: quantity.toString(),
        }),
      });

      const assetIssuanceResult = await issueAsset.json();
      const TxnHash = assetIssuanceResult.paymentResult.hash;

      if (!assetIssuanceResult) {
        toast.dismiss();
        toast.error("Error in Issuing Asset");
        setIsLoading(false);
        return;
      }

      // Step 5: Make payment
      const paymentTransaction = new TransactionBuilder(receiverAccount, {
        fee: BASE_FEE,
        networkPassphrase: "Diamante Testnet",
      })
        .addOperation(
          Operation.payment({
            destination: issuerPublicKey,
            asset: Asset.native(),
            amount: (quantity * price).toString(),
          })
        )
        .setTimeout(30)
        .build();

      const paymentXDR = (paymentTransaction as any).toXDR("base64");
      const paymentResp = await (window as any).diam.sign(
        paymentXDR,
        true,
        "Diamante Testnet"
      );
      if (paymentResp.response.status === 200) {
        const storedTransactionsData = await fetch(
          "http://localhost:8000/storeTransactionsData",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              txnHash: TxnHash,
              investorAddress: receiverPublicKey,
              tokenAmount: quantity,
              diamAmount: (quantity * price).toString(),
              url: `https://testnetexplorer.diamcircle.io/about-txHash/${TxnHash}`,
            }),
          }
        );

        await storedTransactionsData.json();

        const updatePropertyData = await fetch(
          `http://localhost:8000/${_id}/updateHoldingTokens`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userAddress: receiverPublicKey,
              value: quantity * price,
              holdingTokens: quantity,
              earnedYield: 0,
            }),
          }
        );
        if (!updatePropertyData.ok) {
          throw new Error("Error updating holding tokens.");
        }
        await updatePropertyData.json();

        toast.dismiss();
        toast.success("Investment successful!");
        setQuantity(0);
      } else {
        toast.dismiss();
        toast.error("Payment transaction failed");
      }
      setIsLoading(false);
    } catch (error) {
      toast.dismiss();
      toast.error("Error funding account.");
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-sm rounded-lg overflow-hidden shadow-lg border border-gray-300 transform transition duration-300 hover:scale-105 hover:shadow-xl">
      <img className="w-full h-48 object-cover" src={image} alt="Property" />
      <div className="p-6">
        <div className="flex flex-col justify-between mb-2">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span>Token Price:</span>
            <span className="text-gray-500 text-lg">${price}</span>
          </div>
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span>Total Supply:</span>
            <span className="text-gray-500 text-lg">{availableTokens}</span>
          </div>
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span>APY:</span>
            <span className="text-gray-500 text-lg">{yieldPercentage}%</span>
          </div>
          <hr className="my-4 border-gray-300" />
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span>Token Quantity:</span>
            <div className="flex items-center">
              <button
                className="px-2 py-1 bg-red-500 text-white rounded-l-lg hover:bg-red-700 transition duration-300"
                onClick={handleDecrement}
              >
                -
              </button>
              <span className="px-4 py-1 text-gray-500 text-lg">
                {quantity}
              </span>
              <button
                className="px-2 py-1 bg-green-500 text-white rounded-r-lg hover:bg-green-700 transition duration-300"
                onClick={handleIncrement}
              >
                +
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span>Total Cost:</span>
            <span className="text-gray-500 text-lg">
              {quantity * price} DIAM
            </span>
          </div>
        </div>
        <button
          className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
          onClick={handleInvestment}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Invest Now"}
        </button>
      </div>
    </div>
  );
};

const ImageList: React.FC = () => {
  const images = [
    { src: "/gallery4.jpg", alt: "Property 1" },
    { src: "/gallery2.jpg", alt: "Property 2" },
    { src: "/gallery3.jpg", alt: "Property 3" },
  ];

  return (
    <div className="flex flex-col gap-4">
      {images.map((image, index) => (
        <img
          key={index}
          src={image.src}
          alt={image.alt}
          className="w-full h-40 object-cover rounded-lg shadow-md"
        />
      ))}
    </div>
  );
};

const PurchaseAssets: React.FC = () => {
  const [properties, setProperties] = useState<PropertyCardProps[]>([]);
  const [balance, setBalance] = useState(0);

  const fetchProperties = async () => {
    try {
      const name = "Prestige Polygon";
      const response = await fetch(
        `http://localhost:8000/getPropertyDatailsByName?name=${encodeURIComponent(
          name
        )}`
      );
      const data = await response.json();
      setProperties(data);
    } catch (error) {
      console.error("Failed to fetch properties:", error);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);
  return (
    <div className="flex flex-col font-serif mt-10 pl-14 ml-12 pt-8 pb-8">
      <div className="pt-14 pl-5 justify-start">
        <h1 className="text-3xl font-bold mb-4">
          Beautiful 3-bedroom house with a large backyard
        </h1>
        <div className="flex items-center mb-4 text-gray-500">
          <FaMapMarkerAlt className="mr-2" />
          <span>123 Main St, Anytown, USA</span>
        </div>
      </div>

      <div className="flex pl-5 flex-row gap-4">
        <div className="flex w-full lg:w-1/1.1 justify-center lg:justify-end">
          <Image
            className="rounded-lg shadow-md "
            src="/gallery5.jpg"
            alt="Home Image"
            width={690}
            height={150}
            priority
          />
        </div>
        <div className="w-1/2">
          <ImageList />
        </div>
        <div className="flex flex-wrap gap-4 w-3/4">
          {properties.map((property, index) => (
            <PropertyCard
              key={property._id}
              _id={property._id}
              image={property.image}
              price={property.price}
              value={property.value}
              availableTokens={property.availableTokens}
              yieldPercentage={property.yieldPercentage}
              holdingTokens={property.holdingTokens}
              earnedYield={property.earnedYield}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PurchaseAssets;
