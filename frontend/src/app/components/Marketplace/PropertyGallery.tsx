import Link from 'next/link';
import React from 'react';
import { FaMapMarkerAlt, FaDollarSign } from 'react-icons/fa';

type PropertyCardProps = {
    image: string;
    name: string;
    price: number;
    yieldPercentage: number;
    availableTokens: number;
    address: string;
    description: string;
};

const PropertyCard: React.FC<PropertyCardProps> = ({ image, name, price, availableTokens, yieldPercentage, address, description }) => {
    return (
        <div className="max-w-sm rounded-lg mt-5 mb-10 ml-5 font-serif overflow-hidden shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-xl border-2 border-gray-300">
            <img className="w-full h-48 object-cover" src={image} alt="Property" />
            <div className="p-6">
                <div className="flex items-center mb-4">
                    <span className="font-bold text-3xl">{name}</span>
                </div>
                <div className="flex items-center mb-4 text-gray-400">
                    <FaMapMarkerAlt className="mr-2" />
                    <span>{address}</span>
                </div>
                <p className="text-gray-500 text-base mb-4">{description}</p>
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <span className="text-gray-400">Token Price</span>
                    </div>
                    <div>
                        <span className="text-gray-400">Available Tokens</span>
                    </div>
                    <div>
                        <span className="text-gray-400">APY</span>
                    </div>
                </div>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                        <FaDollarSign className="text-green-600" />
                        <span className="font-bold text-xl">{price}</span>
                    </div>
                    <div className="flex items-center">
                        <span className="font-bold text-xl">{availableTokens}</span>
                    </div>
                    <div className="flex items-center">
                        <span className="font-bold text-xl">{yieldPercentage}%</span>
                    </div>
                </div>
                <Link href="/purchase-assets" legacyBehavior>
                    <button className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-300">
                        View Details
                    </button>
                </Link>
            </div>
        </div>
    );
};

const properties: PropertyCardProps[] = [
    {
        image: '/gallery1.jpg',
        name: 'Prestige Polygon',
        address: '123 Main St, Anytown, USA',
        description: 'Beautiful 3-bedroom house with a large backyard',
        price: 50,
        availableTokens: 10000,
        yieldPercentage: 10,
    },
    {
        image: '/gallery2.jpg',
        name: 'Ananta Society',
        address: '456 Oak St, Sometown, USA',
        description: 'Spacious 4-bedroom house with modern amenities',
        price: 75,
        availableTokens: 20000,
        yieldPercentage: 12,
    },
];

const PropertyGallery: React.FC = () => {
    return (
        <div className="flex flex-wrap gap-4 p-4">
            {properties.map((property, index) => (
                <PropertyCard
                    key={index}
                    image={property.image}
                    name={property.name}
                    address={property.address}
                    description={property.description}
                    price={property.price}
                    availableTokens={property.availableTokens}
                    yieldPercentage={property.yieldPercentage}
                />
            ))}
        </div>
    );
};

export default PropertyGallery;

