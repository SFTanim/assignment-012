import SectionTItle from "../Shared/SectionTItle";

const PetCategories = () => {
  const petCategories = [
    {
      name: "Puppies",
      image:
        "https://i.ibb.co/ydSrbgD/Leonardo-Phoenix-Adorable-white-puppy-with-fluffy-fur-and-big-0.jpg",
    },
    {
      name: "Kittens",
      image:
        "https://i.ibb.co/y60v8G6/Leonardo-Phoenix-A-tiny-fluffy-kitten-with-large-bright-green-2.jpg",
    },
    {
      name: "Birds",
      image:
        "https://i.ibb.co/HCbX9tp/Leonardo-Phoenix-A-bright-and-colorful-parrot-with-vibrant-plu-2.jpg",
    },
    {
      name: "Reptiles",
      image:
        "https://i.ibb.co/w624LS7/Leonardo-Phoenix-A-highly-detailed-closeup-portrait-of-a-vibra-0.jpg",
    },
    {
      name: "Fish",
      image:
        "https://i.ibb.co/wytySkP/Leonardo-Phoenix-Vibrant-iridescent-tropical-fish-of-varying-s-0.jpg",
    },
  ];

  return (
    <div>
      <SectionTItle
        heading={"Explore Our Pets"}
        subHeading={
          "Discover our diverse range of adoptable pets, from puppies and kittens to birds and reptiles."
        }
      ></SectionTItle>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {petCategories.map((pet, idx) => (
          <div key={idx} className="rounded-xl">
            <div className="relative">
              <img src={pet?.image} className="rounded-md" alt="" />
              <h2 className="card-title absolute top-4 left-4 bg-slate-50 rounded-xl bg-opacity-50 p-2">{pet?.name}</h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PetCategories;
