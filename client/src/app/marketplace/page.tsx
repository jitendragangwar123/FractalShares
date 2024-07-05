import PropertyGallery from "@/app/components/Marketplace/PropertyGallery";
import PropertyBanner from "@/app/components/Marketplace/PropertyBanner";
import DropdownRadioComponent from "@/app/components/Marketplace/DropdownRadioComponent";
import Footer from "~/Footer";
import Header from "~/Header";


export default async function Page() {
  return (
    <div className="">
      <Header/>
        <PropertyBanner/>
        <DropdownRadioComponent/>
        <PropertyGallery />
      <Footer/>
    </div> 
  );
}