import Slider from "./Slider";
import SectionTItle from "./../Shared/SectionTItle";

const CallToAction = () => {
  return (
    <div>
      <SectionTItle
        heading={"Find Your Perfect Furry Companion"}
        subHeading={
          "Every pet deserves a loving family. By adopting, you can change a pets life forever and find a loyal companion."
        }
      ></SectionTItle>

      <div className="carosel">
        <Slider></Slider>
      </div>
    </div>
  );
};

export default CallToAction;
