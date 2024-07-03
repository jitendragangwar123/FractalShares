"use client";
import Link from "next/link";
import React, { useState } from "react";
import { FaMapMarkerAlt, FaDollarSign } from "react-icons/fa";
import Image from "next/image";
import toast from "react-hot-toast";

type PropertyCardProps = {
    image: string;
    tokenQuantity: number;
    totalCost: number;
    price: number;
    yieldPercentage: number;
    availableTokens: number;
};

const PropertyCard: React.FC<PropertyCardProps> = ({
    image,
    tokenQuantity,
    totalCost,
    price,
    availableTokens,
    yieldPercentage,
}) => {
    const [quantity, setQuantity] = useState(tokenQuantity);
    const [isLoading, setIsLoading] = useState(false);

    const handleIncrement = () => setQuantity(quantity + 1);
    const handleDecrement = () => quantity > 0 && setQuantity(quantity - 1);

    const handleInvestment = async () => {
        const receiverSecret =
            "SCXQIKV26BUIU7HSMFSKZFBFL5G3ZMGF777ZTW7DE2UFJFCYBZSY2F22";
        const issuerSecret =
            "SABO6PBN6PAVXVZRHAQMGNAGXLK742AZXB7CNR6WZQPPIBXAEYLZ3VFX";
        const amountLimit = "100000";
        const assetName = "RubyToken";
        try {
            setIsLoading(true);
            toast.loading("Wait for Transactions.....");
            const getPublicKey = await fetch(
                `https://fractal-shares.vercel.app/generatePublicKey`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ senderSecret: issuerSecret }),
                }
            );
            const res: any = await getPublicKey.json();
            const recieverpublicKey = res.publicKey;
            console.log("recieverpublicKey: ", recieverpublicKey);

            const diamTransfer = await fetch("https://fractal-shares.vercel.app/transferDiamTokens", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    senderSecret: receiverSecret,
                    receiverPublicKey: recieverpublicKey,
                    amount: (quantity*price).toString(),
                }),
            });
            const resDiamTransfer = await diamTransfer.json();
            console.log("resDiamTransfer", resDiamTransfer);

            const issueAsset = await fetch("http://localhost:8000/issueAssets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    issuerSecret: issuerSecret,
                    receiverSecret: receiverSecret,
                    amountLimit: amountLimit,
                    assetName: assetName,
                    amount: quantity.toString(),
                }),
            });
            const resIssueAsset = await issueAsset.json();
            console.log("resIssueAsset", resIssueAsset);

            toast.dismiss();
            toast.success("Investement successful!");
            setIsLoading(false);
        } catch (error) {
            console.error("Error funding account:", error);
            toast.error("Error funding account.");
            toast.dismiss();
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
                        <span>Available Tokens:</span>
                        <span className="text-gray-500 text-lg">{availableTokens}</span>
                    </div>
                    <div className="flex items-center justify-between text-gray-400 mb-2">
                        <span>APY:</span>
                        <span className="text-gray-500 text-lg">{yieldPercentage}%</span>
                    </div>
                    {/* Divider Line */}
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
                >
                    Invest Now
                </button>
            </div>
        </div>
    );
};

const properties: PropertyCardProps[] = [
    {
        image: "/gallery5.jpg",
        price: 2,
        availableTokens: 10000,
        yieldPercentage: 10,
        tokenQuantity: 0,
        totalCost: 0,
    },
];

const ImageList: React.FC = () => {
    const images = [
        { src: "/gallery1.jpg", alt: "Property 1" },
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
                            key={index}
                            image={property.image}
                            price={property.price}
                            availableTokens={property.availableTokens}
                            yieldPercentage={property.yieldPercentage}
                            tokenQuantity={property.tokenQuantity}
                            totalCost={property.totalCost}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PurchaseAssets;
