import UpRightArrowIcon from "@/app/svg/UpRightArrowIcon";

const Transactions = () => {
  return (
    <div className="flex flex-col md:flex-row-reverse md:items-center gap-8 feature">
      <div className="px-2 md:px-8">
        <h2 className="flex font-serif items-center gap-2 text-2xl font-semibold">
          <span>Transparency</span>
          <span>
            <UpRightArrowIcon />
          </span>
        </h2>
        <p className="text-lg font-serif opacity-75">
        By recording every transaction on an immutable, decentralized ledger, 
        we ensure that all activities are fully traceable and auditable. 
        This transparency builds trust among investors, as they can verify 
        the authenticity and history of their transactions in real time. 
        Smart contracts automate and enforce agreements, reducing the risk of fraud and eliminating the need for intermediaries.
        </p>
      </div>
      <div className="grid grid-cols-1 grid-rows-1 feat-img-left" aria-hidden>
        <div className="relative col-start-1 row-start-1 w-90 rounded-[8px] shadow-lg overflow-hidden">
          <img
            src="/transactions.png"
            alt="marketplace"
            className="w-full h-full object-cover dark-img"
          />
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/50 to-transparent"></div>
        </div>
      </div>

    </div>
  );
};

export default Transactions;
