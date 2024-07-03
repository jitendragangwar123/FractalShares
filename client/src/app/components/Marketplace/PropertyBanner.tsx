'use client'
import { useState } from 'react'

type TokenizationBannerProps = {
    backgroundImage: string;
    heading: string;
    subheading: string;
};

const TokenizationBanner: React.FC<TokenizationBannerProps> = ({ backgroundImage, heading, subheading }) => {
    return (
        <div
            className="relative h-96 bg-cover bg-center mt-14"
            style={{ backgroundImage: `url(${backgroundImage})` }}
        >
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="absolute inset-0 font-serif flex items-center justify-center text-center text-white">
                <div className="relative z-0">
                    <h1 className="text-4xl font-bold mb-4">{heading}</h1>
                    <p className="text-xl">{subheading}</p>
                </div>
            </div>
        </div>
    );
};

const PropertyBanner: React.FC = () => {
    return (
        <div>
            <TokenizationBanner
                backgroundImage="/backgroundImage.jpg"
                heading="Tokenizing Real Estate Assets"
                subheading="Unlocking liquidity and new investment opportunities in Real Estate"
            />
        </div>
    );
};

export default PropertyBanner;
