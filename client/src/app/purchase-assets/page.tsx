import PurchaseAssets from "~/PurchaseAssets/PurchaseAssets";
import TransactionsTable from "~/PurchaseAssets/TransactionsTable";
import MarketplaceHeader from "~/Marketplace/MarketplaceHeader";
import Footer from "~/Footer";


export default async function Page() {
  return (
    <div className="">
      <MarketplaceHeader/>
      <PurchaseAssets />
      <TransactionsTable/>
      <Footer/>
    </div> 
  );
}