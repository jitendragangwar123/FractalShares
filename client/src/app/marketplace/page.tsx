import PropertyGallery from "@/app/components/Marketplace/PropertyGallery";
import PropertyBanner from "@/app/components/Marketplace/PropertyBanner";
import Footer from "~/Footer";
import Header from "~/Header";


export default async function Page() {
  return (
    <div className="">
      <Header/>
        <PropertyBanner/>
        <PropertyGallery />
      <Footer/>
    </div> 
  );
}