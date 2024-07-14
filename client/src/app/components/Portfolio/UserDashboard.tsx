"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { FaMapMarkerAlt } from "react-icons/fa";

type InvestmentBanner = {
  earnedYield: number;
  value: number;
};

type UserData = {
  userAddress: string;
  value: number;
  earnedYield: number;
  holdingTokens: number;
};

type PropertyCardProps = {
  value: number;
  holdingTokens: number;
  earnedYield: number;
  userAddress: string;
  _id: string;
  image: string;
  name: string;
  address: string;
  price: number;
  yieldPercentage: number;
  userData: UserData[];
};

const PropertyCard: React.FC<
  Omit<PropertyCardProps, "userData"> & UserData
> = ({
  _id,
  image,
  name,
  address,
  value,
  price,
  yieldPercentage,
  holdingTokens,
  earnedYield,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [yieldAmount, setYieldAmount] = useState("");

  const handleClaimYield = async () => {
    const days = 3000;
    const issuerSecret = process.env.NEXT_PUBLIC_SECRET_KEY;

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

      // Step 2: Calculate yield
      const calculateYield = await fetch(
        "https://fractal-shares-back-end.vercel.app/calculateYield",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            principal: holdingTokens,
            annualRate: yieldPercentage,
            days: days,
          }),
        }
      );
      if (!calculateYield.ok) {
        throw new Error("Error calculating yield.");
      }
      const calculatedYieldAmount = await calculateYield.json();
      const yieldAmounts = calculatedYieldAmount.yieldAmount;
      console.log("Calculated Yields Amount:", yieldAmounts);
      setYieldAmount(yieldAmounts);

      // Step 3: update Yield Amount
      const updateYieldsAmount = await fetch(
        `https://fractal-shares-back-end.vercel.app/${_id}/updateEarnedYields`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userAddress: investorPublicKey,
            earnedYield: Number(yieldAmounts),
            value: Number(yieldAmounts),
          }),
        }
      );
      if (!updateYieldsAmount.ok) {
        toast.error("Error updating Yields amounts.");
      }
      await updateYieldsAmount.json();

      // Step 4: Transfer DIAM tokens
      const diamTransfer = await fetch(
        "https://fractal-shares-back-end.vercel.app/transferDiamTokens",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            senderSecret: issuerSecret,
            receiverPublicKey: investorPublicKey,
            amount: yieldAmounts.toString(),
          }),
        }
      );
      if (!diamTransfer.ok) {
        throw new Error("Error transferring DIAM tokens.");
      }

      const diamTransferResponse = await diamTransfer.json();
      console.log("diamTransferResponse: ", diamTransferResponse);
      const txnHash = diamTransferResponse.result.hash;

      const storedTransactionsData = await fetch(
        "https://fractal-shares-back-end.vercel.app/storeTransactionsData",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            txnHash: txnHash,
            investorAddress: investorPublicKey,
            tokenAmount: holdingTokens,
            diamAmount: yieldAmounts.toString(),
            action: "Yield Claimed",
            url: `https://testnetexplorer.diamcircle.io/about-txHash/${txnHash}`,
          }),
        }
      );

      await storedTransactionsData.json();
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

  return (
    <div className="max-w-sm rounded-lg ml-20 overflow-hidden shadow-lg border border-gray-300 transform transition duration-300 hover:scale-105 hover:shadow-xl">
      <img className="w-full h-48 object-cover" src={image} alt="Property" />
      <div className="p-4">
        <div className="flex items-center mb-2">
          <span className="font-bold text-2xl">{name}</span>
        </div>
        <div className="flex items-center mb-4 text-gray-400">
          <FaMapMarkerAlt className="mr-2" />
          <span>{address}</span>
        </div>
        <div className="flex flex-col justify-between mb-2">
          <div className="flex items-center justify-between text-gray-400 mb-1">
            <span>Value:</span>
            <span className="text-gray-500 text-lg">${value}</span>
          </div>
          <div className="flex items-center justify-between text-gray-400 mb-1">
            <span>Earned Yield:</span>
            <span className="text-gray-500 text-lg">${earnedYield}</span>
          </div>
          <div className="flex items-center justify-between text-gray-400 mb-1">
            <span>Yield Percentage:</span>
            <span className="text-gray-500 text-lg">{yieldPercentage}%</span>
          </div>
          <div className="flex items-center justify-between text-gray-400 mb-1">
            <span>Holding Tokens:</span>
            <span className="text-gray-500 text-lg">{holdingTokens}</span>
          </div>
          <hr className="my-1 border-gray-300" />
        </div>

        <button
          className="w-full bg-blue-500 text-white font-bold py-2 px-2 rounded hover:bg-blue-700 transition duration-300"
          onClick={handleClaimYield}
          disabled={isLoading}
        >
          {isLoading ? "Claiming..." : "Claim Yield"}
        </button>
      </div>
    </div>
  );
};

function PortfolioOverview() {
  const [aggregatedData, setAggregatedData] = useState<InvestmentBanner | null>(
    null
  );
  const [properties, setProperties] = useState<PropertyCardProps[]>([]);
  const [userAddress, setUserAddress] = useState("");

  const fetchPropertiesByAddress = async () => {
    try {
      const ext_resp = await (window as any).diam.connect();
      if (ext_resp.status !== 200) {
        toast.error("Connect your wallet!");
        return;
      }
      const userAddress = ext_resp.message[0];
      setUserAddress(userAddress);

      const response = await fetch(
        `https://fractal-shares-back-end.vercel.app/getPropertiesByUserAddress?userAddress=${userAddress}`
      );
      if (!response.ok) {
        toast.error("Investor don't have any asset");
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      const transformedData = data.map((property: PropertyCardProps) => {
        const userData = property.userData.find(
          (user) => user.userAddress === userAddress
        );

        return {
          ...property,
          value: userData?.value || 0,
          earnedYield: userData?.earnedYield || 0,
          holdingTokens: userData?.holdingTokens || 0,
        };
      });

      console.log("Transformed data:", transformedData);
      setProperties(transformedData);

      const aggregated = transformedData.reduce(
        (
          acc: { earnedYield: any; value: any },
          property: { earnedYield: any; value: any }
        ) => {
          acc.earnedYield += property.earnedYield;
          acc.value += property.value;
          return acc;
        },
        { value: 0, earnedYield: 0 } as InvestmentBanner
      );

      setAggregatedData(aggregated);
    } catch (error) {
      console.error("Error fetching properties:", error);
      toast.error("Failed to fetch investment data");
    }
  };

  useEffect(() => {
    fetchPropertiesByAddress();
  }, []);

  return (
    <div className="flex min-h-screen flex-col font-serif items-center justify-center bg-gradient-to-b from-blue-100 to-blue-300 dark:from-gray-800 dark:to-gray-900 mt-14 pt-8">
      <div className="flex justify-start w-full max-w-6xl mt-4">
        <h1 className="text-3xl md:text-4xl lg:text-2xl font-bold text-gray-800 dark:text-gray-200">
          Overview
        </h1>
      </div>
      {aggregatedData && (
        <div className="flex flex-col lg:flex-row gap-14 w-full max-w-6xl bg-white dark:bg-gray-800 shadow-lg rounded-lg mt-4 pl-14 pr-14 pt-5 pb-5 mb-10">
          <div className="flex w-full flex-col gap-10">
            <div className="flex flex-col w-full lg:w-2/3">
              <h1 className="text-3xl md:text-4xl lg:text-xl font-bold text-gray-800 dark:text-gray-200 animate-fadeIn transition duration-700 ease-in-out transform hover:scale-105">
                Value
              </h1>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-blue-600 dark:text-blue-400 animate-fadeIn transition duration-700 ease-in-out transform hover:scale-105">
                ${aggregatedData.value}
              </h2>
            </div>

            <div className="flex flex-col md:flex-row gap-16">
              <div>
                <h2 className="text-3xl md:text-4xl lg:text-xl font-bold text-gray-800 dark:text-gray-200 animate-fadeIn transition duration-700 ease-in-out transform hover:scale-105">
                  Yield Earned
                </h2>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-green-600 dark:text-green-400 animate-fadeIn transition duration-700 ease-in-out transform hover:scale-105">
                  ${aggregatedData.earnedYield}
                </h2>
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl lg:text-xl font-bold text-gray-800 dark:text-gray-200 animate-fadeIn transition duration-700 ease-in-out transform hover:scale-105">
                  Total Invested
                </h2>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 dark:text-gray-200 animate-fadeIn transition duration-700 ease-in-out transform hover:scale-105">
                  ${aggregatedData.value - aggregatedData.earnedYield}
                </h2>
              </div>
            </div>
          </div>
          <div className="flex w-full lg:w-1/4 lg:justify-end">
            <Image
              className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] transition duration-700 ease-in-out transform hover:scale-105"
              src="/portfolio.svg"
              alt="Portfolio Image"
              width={600}
              height={150}
              priority
            />
          </div>
        </div>
      )}

      <div className="flex justify-start w-full max-w-6xl mr-10 mt-4">
        <h1 className="text-3xl md:text-4xl lg:text-2xl font-bold text-gray-800 dark:text-gray-200">
          My Assets
        </h1>
      </div>
      <div className="flex justify-start w-full mt-5 ml-20">
        {properties.map((property) => (
          <PropertyCard
            key={property._id}
            _id={property._id}
            image={property.image}
            name={property.name}
            address={property.address}
            value={property.value}
            price={property.price}
            yieldPercentage={property.yieldPercentage}
            holdingTokens={property.holdingTokens}
            earnedYield={property.earnedYield}
            userAddress={property.userAddress}
          />
        ))}
      </div>
    </div>
  );
}

export default PortfolioOverview;
