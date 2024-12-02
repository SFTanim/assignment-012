import SectionTItle from "./../Shared/SectionTItle";
import { MdOutlinePets } from "react-icons/md";
import { TbVaccine } from "react-icons/tb";
import { FaHotel } from "react-icons/fa";
import { MdOutlineSports } from "react-icons/md";
import { LuShowerHead } from "react-icons/lu";
import { MdDryCleaning } from "react-icons/md";

const OtherServices = () => {
  const petServices = [
    {
      title: "GROOMING",
      description:
        "Professional grooming ensures your pet's coat stays healthy, shiny, and free of mats and tangles.",
      icon: <MdOutlinePets className="text-4xl mx-auto text-[#8FAF00]" />,
    },
    {
      title: "VACCINES",
      description:
        "Keep your pet healthy with timely vaccines, protecting them from serious diseases and infections year-round.",
      icon: <TbVaccine className="text-4xl mx-auto text-[#8FAF00]" />,
    },
    {
      title: "PET HOTEL",
      description:
        "Enjoy peace of mind knowing your pet stays safe and comfortable at our trusted hotel.",
      icon: <FaHotel className="text-4xl mx-auto text-[#8FAF00]" />,
    },
    {
      title: "TRAINING",
      description:
        "Boost your pet’s confidence and behavior with expert training for obedience, tricks, and socialization skills.",
      icon: <MdOutlineSports className="text-4xl mx-auto text-[#8FAF00]" />,
    },
    {
      title: "BATH & DRY",
      description:
        "Pamper your pet with a refreshing bath and professional drying, leaving them clean and happy.",
      icon: <LuShowerHead className="text-4xl mx-auto text-[#8FAF00]" />,
    },
    {
      title: "STYLING",
      description:
        "Enhance your pet’s charm with tailored styling that matches their personality and keeps them fabulous.",
      icon: <MdDryCleaning className="text-4xl mx-auto text-[#8FAF00]" />,
    },
  ];

  return (
    <div className="" id="otherServices">
      <SectionTItle
        heading={"other services"}
        subHeading={
          "Discover additional services like spa treatments, pet transport, and nutrition advice for your pet's well-being."
        }
      ></SectionTItle>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {petServices?.map((pet, idx) => (
          <div
            key={idx}
            className="flex flex-col justify-center text-center space-y-2 border p-4 rounded-lg"
          >
            {pet?.icon}
            <h2 className="font-bold text-[#8FAF00]">Grooming</h2>
            <p className="">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Doloribus error, eveniet reprehenderit maxime architecto itaque.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OtherServices;
