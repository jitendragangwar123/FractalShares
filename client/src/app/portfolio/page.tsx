import UserDashboard from "@/app/components/Portfolio/UserDashboard";
import Header from "~/Header";
import Footer from "~/Footer";


export default async function Page() {
  return (
    <div className="">
      <Header/>
      <UserDashboard />
      <Footer/>
    </div> 
  );
}