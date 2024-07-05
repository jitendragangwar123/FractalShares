import PurchaseAssets from "~/PurchaseAssets/PurchaseAssets";
import TransactionsTable from "~/PurchaseAssets/TransactionsTable";
import Header from "~/Header";
import Footer from "~/Footer";


export default async function Page() {
  return (
    <div className="">
      <Header/>
      <PurchaseAssets />
      <TransactionsTable/>
      <Footer/>
    </div> 
  );
}