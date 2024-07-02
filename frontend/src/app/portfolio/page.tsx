import UserDashboard from "@/app/components/Portfolio/UserDashboard";
//import PropertyOwnerPortfolio from "~/PropertyOwner/PropertyOwnerPortfolio";
import MarketplaceHeader from "~/Marketplace/MarketplaceHeader";
import Footer from "~/Footer";


export default async function Page() {
  return (
    <div className="">
      <MarketplaceHeader/>
      <UserDashboard />
      <Footer/>
    </div> 
  );
}