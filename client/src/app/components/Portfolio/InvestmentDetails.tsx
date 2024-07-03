'use client'
import Link from 'next/link';
import React, { useState } from 'react';
import { FaMapMarkerAlt, FaDollarSign } from 'react-icons/fa';

type PropertyCardProps = {
    name: string;
    address: string;
    value: number;
    price: number;
    earnedYield: number;
    holdingTokens: number;
    tokenQuantity: number;
    totalCost: number
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
    const tokenPrice = price;

    const handleIncrement = () => setQuantity(quantity + 1);
    const handleDecrement = () => quantity > 0 && setQuantity(quantity - 1);

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
                    <div className="flex items-center justify-between text-gray-400 mb-2">
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
                        <span className="text-gray-500 text-lg">{(quantity * tokenPrice).toFixed(0)} DIAM</span>
                    </div>
                </div>

                <button className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-300">
                    Sell Tokens
                </button>
            </div>
        </div>
    );
};

const properties: PropertyCardProps[] = [
    {
        name: 'Prestige Polygon',
        address: '456 Oak St, Sometown, USA',
        value: 10350,
        earnedYield: 350,
        holdingTokens: 10000,
        price: 50,
        tokenQuantity: 0,
        totalCost: 0,
    },
    {
        name: 'Central Park Tower',
        address: '453 Oak St, New York, USA',
        value: 10050,
        earnedYield: 50,
        holdingTokens: 10000,
        price: 40,
        tokenQuantity: 0,
        totalCost: 0,
    },
    {
        name: 'Willis Tower †',
        address: '545 Oak St, Chicago, USA',
        value: 1000,
        earnedYield: 0,
        holdingTokens: 10000,
        price: 60,
        tokenQuantity: 0,
        totalCost: 0,
    },
];

const PurchaseAssets: React.FC = () => {
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
                    totalCost={property.totalCost} />
            ))}
        </div>
    );
};

export default PurchaseAssets;
