import PropertyGallery from "@/app/components/Marketplace/PropertyGallery";
import PropertyBanner from "@/app/components/Marketplace/PropertyBanner";
import DropdownRadioComponent from "@/app/components/Marketplace/DropdownRadioComponent";
import Footer from "~/Footer";
import MarketplaceHeader from "@/app/components/Marketplace/MarketplaceHeader";


export default async function Page() {
  return (
    <div className="">
      <MarketplaceHeader/>
        <PropertyBanner/>
        <DropdownRadioComponent/>
        <PropertyGallery />
      <Footer/>
    </div> 
  );
}