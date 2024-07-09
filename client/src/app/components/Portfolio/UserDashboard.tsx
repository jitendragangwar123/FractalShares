"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import InvestmentDetails from "~/Portfolio/InvestmentDetails";


function PortfolioOverview() {
   const [tokenBalance, setTokenBalance] = useState(0);
   const [totalValue,setTotalValue] =useState(0);
   const [yieldAmount,setYieldAmount]=useState(0);


   const handleInvestmentData = async () => {
       const ext_resp = await (window as any).diam.connect();
       if (ext_resp.status !== 200) {
           toast.error("Connect your wallet!");
           return;
       }
       const receiverPublicKey = ext_resp.message[0];


       const resTokenBalance = await fetch(
           `https://diamtestnet.diamcircle.io/accounts/${receiverPublicKey}`
       );
       if (!resTokenBalance.ok) {
           throw new Error("Network response was not ok");
       }
       const tokenBal = await resTokenBalance.json();
       const tokenBalance = parseFloat(tokenBal.balances[0].balance);
       setTokenBalance(tokenBalance);
       //fetch from DB
       const yieldAmount=10;
       setYieldAmount(yieldAmount);
       const totalValueAmount= yieldAmount + tokenBalance;
       setTotalValue(totalValueAmount);
   };


   useEffect(() => {
       handleInvestmentData();
   }, []);


   return (
       <div className="flex min-h-screen flex-col font-serif items-center justify-center bg-gradient-to-b from-blue-100 to-blue-300 dark:from-gray-800 dark:to-gray-900 mt-14 pt-8">
           <div className="flex justify-start w-full max-w-6xl mt-4">
               <h1 className="text-3xl md:text-4xl lg:text-2xl font-bold text-gray-800 dark:text-gray-200">
                   Overview
               </h1>
           </div>
           <div className="flex flex-col lg:flex-row gap-14 w-full max-w-6xl bg-white dark:bg-gray-800 shadow-lg rounded-lg mt-4 pl-14 pr-14 pt-5 pb-5 mb-10">
               <div className="flex w-full flex-col gap-10">
                   <div className="flex flex-col w-full lg:w-2/3">
                       <h1 className="text-3xl md:text-4xl lg:text-xl font-bold text-gray-800 dark:text-gray-200 animate-fadeIn transition duration-700 ease-in-out transform hover:scale-105">
                           Value
                       </h1>
                       <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-blue-600 dark:text-blue-400 animate-fadeIn transition duration-700 ease-in-out transform hover:scale-105">
                           ${totalValue}
                       </h2>
                   </div>


                   <div className="flex flex-col md:flex-row gap-16">
                       <div>
                           <h2 className="text-3xl md:text-4xl lg:text-xl font-bold text-gray-800 dark:text-gray-200 animate-fadeIn transition duration-700 ease-in-out transform hover:scale-105">
                               Yield Earned
                           </h2>
                           <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-green-600 dark:text-green-400 animate-fadeIn transition duration-700 ease-in-out transform hover:scale-105">
                               ${yieldAmount}
                           </h2>
                       </div>
                       <div>
                           <h2 className="text-3xl md:text-4xl lg:text-xl font-bold text-gray-800 dark:text-gray-200 animate-fadeIn transition duration-700 ease-in-out transform hover:scale-105">
                               Total Invested
                           </h2>
                           <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 dark:text-gray-200 animate-fadeIn transition duration-700 ease-in-out transform hover:scale-105">
                           ${tokenBalance}
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


           <div className="flex justify-start w-full max-w-6xl mt-4">
               <h1 className="text-3xl md:text-4xl lg:text-2xl font-bold text-gray-800 dark:text-gray-200">
                   My Assets
               </h1>
           </div>
           <div className="flex justify-start w-full max-w-6xl mt-1">
               <InvestmentDetails />
           </div>
       </div>
   );
}


export default PortfolioOverview;





