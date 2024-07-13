"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiCopy } from "react-icons/fi";
import { toast } from "react-hot-toast";

interface Transaction {
  txnHash: string;
  investorAddress: string;
  tokenAmount: number;
  diamAmount: number;
  action: string;
  url: string;
}

function TransactionsTable() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const router = useRouter();

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://fractal-shares-back-end.vercel.app/getTransactionsData",
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setTransactions(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error("Failed to fetch investments details. Please try again.");
      console.error("Error fetching investments details:", error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const truncateTxHash = (txhash: string) => {
    return `${txhash.slice(0, 8)}...${txhash.slice(-8)}`;
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(transactions.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success("Copied to clipboard!");
      })
      .catch(() => {
        toast.error("Failed to copy!");
      });
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSchemas = transactions.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="flex flex-col items-center font-serif justify-center w-full sm-h-screen bg-gradient-to-b from-blue-100 to-blue-300 dark:from-gray-800 dark:to-gray-900">
      <div className="flex flex-col w-full max-w-7xl bg-white dark:bg-gray-800 shadow-lg rounded-lg mt-8 p-6">
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-col justify-between items-left mb-1">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200">
              Investments
            </h1>
            <p className="text-lg text-gray-800 dark:text-gray-200 mb-3">
              Showing the most recent Investments
            </p>
          </div>
          <button
            type="button"
            className="bg-blue-600 py-3 px-8 rounded text-white hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed"
            onClick={() => router.push("/portfolio")}
          >
            View Investments
          </button>
        </div>
      </div>
      <div className="flex flex-col w-full justify-center max-w-7xl bg-white dark:bg-gray-800 shadow-lg rounded-lg mt-6 mb-6 p-8">
        {loading ? (
          <p className="text-gray-800 dark:text-gray-200">Loading...</p>
        ) : (
          <>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="border-b p-4 text-gray-800 dark:text-gray-200">
                    Transaction Hash
                  </th>
                  <th className="border-b p-4 text-gray-800 dark:text-gray-200">
                    Investor Address
                  </th>
                  <th className="border-b p-4 text-gray-800 dark:text-gray-200">
                    Token Amount
                  </th>
                  <th className="border-b p-4 text-gray-800 dark:text-gray-200">
                    DIAM Amount
                  </th>
                  <th className="border-b p-4 text-gray-800 dark:text-gray-200">
                    Action
                  </th>
                  <th className="border-b p-4 text-gray-800 dark:text-gray-200">
                    Transaction URL
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="border-b p-4 text-gray-800 dark:text-gray-200 text-center"
                    >
                      No transactions found.
                    </td>
                  </tr>
                ) : (
                  currentSchemas.map((txn) => (
                    <tr key={txn.txnHash}>
                      <td className="border-b p-4 text-gray-800 dark:text-gray-200 flex items-center">
                        {truncateTxHash(txn.txnHash)}
                        <FiCopy
                          className="ml-2 cursor-pointer text-blue-600 hover:text-blue-800"
                          onClick={() => handleCopy(txn.txnHash)}
                        />
                      </td>
                      <td className="border-b p-4 text-gray-800 dark:text-gray-200">
                        {truncateTxHash(txn.investorAddress)}
                      </td>
                      <td className="border-b p-4 text-gray-800 dark:text-gray-200">
                        {txn.tokenAmount}
                      </td>
                      <td className="border-b p-4 text-gray-800 dark:text-gray-200">
                        {txn.diamAmount}
                      </td>
                      <td className="border-b p-4 text-gray-800 dark:text-gray-200">
                        {txn.action}
                      </td>
                      <td className="border-b p-4 text-gray-800 dark:text-gray-200">
                        <Link href={txn.url} legacyBehavior>
                          <a className="text-blue-600 hover:underline">
                            View Transaction
                          </a>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <div className="flex justify-between mt-4">
              <button
                type="button"
                className="bg-blue-600 py-2 px-4 rounded text-white hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed"
                onClick={handlePrevPage}
                disabled={currentPage === 1 || transactions.length === 0}
              >
                Back
              </button>
              <button
                type="button"
                className="bg-blue-600 py-2 px-4 rounded text-white hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed"
                onClick={handleNextPage}
                disabled={
                  currentPage ===
                    Math.ceil(transactions.length / itemsPerPage) ||
                  transactions.length === 0
                }
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default TransactionsTable;
