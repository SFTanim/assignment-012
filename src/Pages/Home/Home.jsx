import AboutUs from "../../components/Home/AboutUs";
import Banner from "../../components/Home/Banner";
import CallToAction from "../../components/Home/CallToAction";
import OtherServices from "../../components/Home/OtherServices";
import PetCategories from "../../components/Home/PetCategories";

const Home = () => {
  return (
    <div className="space-y-16 px-3 md:px-0 lg:px-0">
      <Banner></Banner>
      <PetCategories></PetCategories>
      <CallToAction></CallToAction>
      <AboutUs></AboutUs>
      <OtherServices></OtherServices>
    </div>
  );
};

export default Home;
