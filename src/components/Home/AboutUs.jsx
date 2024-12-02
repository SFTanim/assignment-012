import SectionTItle from "../Shared/SectionTItle";

const AboutUs = () => {
  return (
    <div className="" id="aboutUs">
      <SectionTItle
        heading={"About us"}
        subHeading={
          "Building a tech-driven platform to connect pets with loving, forever homes."
        }
      ></SectionTItle>

      <div className="flex flex-col lg:flex-row border-2 items-center rounded-2xl p-3 lg:p-10 bg-[#e0ded8]">
        <div className="flex-1">
          <h2 className="text-xl lg:text-3xl font-bold">
            We are passionate about using technology to make a positive impact
            on animals lives. Our mission is to build a user-friendly platform
            for pet adoption, helping connect pets in need with loving homes.
            Join us in making a difference!
          </h2>
        </div>
        <div className="flex justify-center flex-1 relative">
          <div className="">
            <img
              className="max-w-72 lg:max-w-96 mt-5 md:mt-0 lg:mt-0 rounded-full border border-black"
              src="https://i.ibb.co.com/rmbc9cS/sxa-min.jpg"
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
