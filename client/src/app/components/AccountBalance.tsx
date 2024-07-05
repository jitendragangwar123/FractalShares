import { useEffect, useState } from "react";

type Props = {
  publicKey: string;
};

function AccountBalance({ publicKey }: Props) {
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    if (!publicKey) {
      return;
    }
    const fetchTokenBalance = async () => {
      try {
        const response = await fetch(
          `https://diamtestnet.diamcircle.io/accounts/${publicKey}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        const lastBalance = parseFloat(
          data.balances[data.balances.length - 1].balance
        );
        setBalance(lastBalance);
      } catch (error) {
        console.error("Failed to fetch token balance:", error);
      }
    };

    fetchTokenBalance();
  }, [publicKey]);

  return (
    <div className="flex flex-col gap-y-4 text-left">
      <h3 className="text-lg font-semibold">
        DIAM Balance:{" "}
        <span className="font-normal">{balance.toFixed(2)} DIAM</span>
      </h3>
    </div>
  );
}

export default AccountBalance;