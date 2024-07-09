import Link from "next/link";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { FaMapMarkerAlt, FaDollarSign } from "react-icons/fa";

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
  name: string;
  address: string;
  value: number;
  price: number;
  earnedYield: number;
  holdingTokens: number;
  tokenQuantity: number;
  totalCost: number;
};

const PropertyCard: React.FC<PropertyCardProps> = ({
  name,
  address,
  value,
  price,
  holdingTokens,
  earnedYield,
  tokenQuantity,
  totalCost,
}) => {
  const [quantity, setQuantity] = useState(tokenQuantity);
  const [isLoading, setIsLoading] = useState(false);
  const [yieldAmount, setYieldAmount] = useState("");

  const handleIncrement = () => setQuantity(quantity + 1);
  const handleDecrement = () => quantity > 0 && setQuantity(quantity - 1);

  const handleClaimYield = async () => {
    const principalAmount = 10000;
    const yieldPercentage = 12;
    const days = 5;
    const issuerSecret =
      "SABO6PBN6PAVXVZRHAQMGNAGXLK742AZXB7CNR6WZQPPIBXAEYLZ3VFX";

    try {
      setIsLoading(true);
      toast.loading("Wait for Transactions...");

      // Step 1: Connect to wallet
      const ext_resp = await (window as any).diam.connect();
      if (ext_resp.status !== 200) {
        toast.error("Connect your wallet!");
        setIsLoading(false);
        return;
      }
      const investorPublicKey = ext_resp.message[0];
      console.log("receiverPublicKey:", investorPublicKey);

      // Step 2: Calculate yield
      const calculateYield = await fetch(
        "https://fractal-shares.vercel.app/calculateYield",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            principal: principalAmount,
            annualRate: yieldPercentage,
            days: days,
          }),
        }
      );
      if (!calculateYield.ok) {
        throw new Error("Error calculating yield.");
      }
      const calculatedYieldAmount = await calculateYield.json();
      const yieldAmountResponse = calculatedYieldAmount.yieldAmount;
      setYieldAmount(yieldAmountResponse);
      console.log("Calculated Yield Amount:", yieldAmountResponse);

      // Step 3: Transfer DIAM tokens
      const diamTransfer = await fetch(
        "https://fractal-shares.vercel.app/transferDiamTokens",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            senderSecret: issuerSecret,
            receiverPublicKey: investorPublicKey,
            amount: yieldAmountResponse.toString(),
          }),
        }
      );
      if (!diamTransfer.ok) {
        throw new Error("Error transferring DIAM tokens.");
      }
      const claimedDiamAmount = await diamTransfer.json();
      console.log("Claimed DIAM Amount:", claimedDiamAmount);

      toast.dismiss();
      toast.success("Yield claimed successfully!");
      setIsLoading(false);
    } catch (error) {
      console.error("Error in handleClaimYield:", error);
      toast.dismiss();
      toast.error("Error claiming yield.");
      setIsLoading(false);
    }
  };

  // const handleTransferAssets = async () => {

  // }

  return (
    <div className="max-w-sm rounded-lg overflow-hidden shadow-lg border border-gray-300 transform transition duration-300 hover:scale-105 hover:shadow-xl">
      <div className="p-6">
        <div className="flex items-center mb-4">
          <span className="font-bold text-2xl">{name}</span>
        </div>
        <div className="flex items-center mb-4 text-gray-400">
          <FaMapMarkerAlt className="mr-2" />
          <span>{address}</span>
        </div>

        <div className="flex flex-col justify-between mb-2">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span>Value:</span>
            <span className="text-gray-500 text-lg">${value}</span>
          </div>
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span>Earned Yield:</span>
            <span className="text-gray-500 text-lg">${earnedYield}</span>
          </div>
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span>Token Price:</span>
            <span className="text-gray-500 text-lg">${price}</span>
          </div>
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span>Holding Tokens:</span>
            <span className="text-gray-500 text-lg">{holdingTokens}</span>
          </div>

          <hr className="my-4 border-gray-300" />
          {/* <div className="flex items-center justify-between text-gray-400 mb-2">
                       <span>Token Quantity:</span>
                       <div className="flex items-center">
                           <button
                               className="px-2 py-1 bg-red-500 text-white rounded-l-lg hover:bg-red-700 transition duration-300"
                               onClick={handleDecrement}
                           >
                               -
                           </button>
                           <span className="px-4 py-1 text-gray-500 text-lg">{quantity}</span>
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
                       <span className="text-gray-500 text-lg">{(quantity * price).toFixed(0)} DIAM</span>
                   </div> */}
        </div>
        <div className="flex flex-row gap-2">
          <button
            className="w-full bg-blue-500 text-white font-bold py-2 px-2 rounded hover:bg-blue-700 transition duration-300"
            onClick={handleClaimYield}
          >
            Claim Yield
          </button>
          {/* <button className="w-full bg-blue-500 text-white font-bold py-2 px-2 rounded hover:bg-blue-700 transition duration-300"
                   onClick={handleTransferAssets}>
                   Sell Assets
               </button> */}
        </div>
      </div>
    </div>
  );
};

const properties: PropertyCardProps[] = [
  {
    name: "Prestige Park Tower",
    address: "456 Oak St, Sometown, USA",
    value: 10350,
    earnedYield: 350,
    holdingTokens: 10000,
    price: 2,
    tokenQuantity: 0,
    totalCost: 0,
  },
  {
    name: "Central Park Tower",
    address: "453 Oak St, New York, USA",
    value: 10050,
    earnedYield: 50,
    holdingTokens: 10000,
    price: 3,
    tokenQuantity: 0,
    totalCost: 0,
  },
];

const EarnYieldAmount: React.FC = () => {
  return (
    <div className="flex flex-wrap gap-4 p-4">
      {properties.map((property, index) => (
        <PropertyCard
          key={index}
          name={property.name}
          address={property.address}
          value={property.value}
          price={property.price}
          holdingTokens={property.holdingTokens}
          earnedYield={property.earnedYield}
          tokenQuantity={property.tokenQuantity}
          totalCost={property.totalCost}
        />
      ))}
    </div>
  );
};

export default EarnYieldAmount;
