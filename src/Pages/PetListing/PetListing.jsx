import { Link } from "react-router-dom";
import PageTitle from "./../../components/Shared/PageTitle";
import useAllPets from "../../components/hooks/useAllPets";
import { MdOutlinePets } from "react-icons/md";
import { TbClockEdit } from "react-icons/tb";
import { TiLocationOutline } from "react-icons/ti";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../components/hooks/useAxiosPublic";
import { CiSearch } from "react-icons/ci";
import Swal from "sweetalert2";

const PetListing = () => {
  const axiosPublic = useAxiosPublic();
  const { isPending, error, data: pets } = useAllPets();
  const [petName, setPetName] = useState("");
  const [categorizedPet, setCategorizedPet] = useState([]);
  const [searchedPet, setSearchedPet] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");

  // For searched pet
  const {
    isPending: petDataPending,
    error: petError,
    refetch,
  } = useQuery({
    queryKey: ["pet", petName],
    queryFn: async () => {
      if (petName.length > 0) {
        const data = petName;
        const res = await axiosPublic.get(`/petsName/${data}`);
        const newData = res?.data;
        if (newData) {
          setCategorizedPet([]);
          setSearchedPet(newData);
        }
        if (newData?.message) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "There is no pet in this name!",
          });
          setSearchedPet(null);
        }
        return res?.data;
      } else {
        return null;
      }
    },
  });

  // Pet Name Input
  const handleInput = (e) => {
    e.preventDefault();
    const name = e?.target?.name?.value;
    setPetName(name);
    e.target.reset();
    refetch();
  };

  // For All Pets Button
  const handleAllPets = () => {
    setSearchedPet(null);
    setCategorizedPet([]);
    setSelectedCategory("");
  };

  // For Categorized Pets
  const handleSelect = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    setSearchedPet(null);
    if (category) {
      axiosPublic.get(`/petsCategorized/${category}`).then((res) => {
        if (res.data.length === 0) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "No pets are available in this category!",
            confirmButtonText: "ok",
          }).then((result) => {
            if (result.isConfirmed) {
              setSearchedPet(null);
              setSelectedCategory("");
            }
          });
        }
        setCategorizedPet(res.data);
      });
    }
  };

  if (isPending)
    return (
      <>
        <div className="flex w-3/4 mx-auto flex-col gap-4 mt-10">
          <div className="skeleton h-32 w-full"></div>
          <div className="skeleton h-4 w-28"></div>
          <div className="skeleton h-4 w-full"></div>
          <div className="skeleton h-4 w-full"></div>
        </div>
      </>
    );
  if (petDataPending)
    return (
      <>
        <div className="flex w-3/4 mx-auto flex-col gap-4 mt-10">
          <div className="skeleton h-32 w-full"></div>
          <div className="skeleton h-4 w-28"></div>
          <div className="skeleton h-4 w-full"></div>
          <div className="skeleton h-4 w-full"></div>
        </div>
      </>
    );

  if (error)
    return (
      <div role="alert" className="alert alert-warning mt-10 w-3/4 mx-auto">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 shrink-0 stroke-current"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>An error has occurred: {error.message}</span>
      </div>
    );

  if (petError)
    return (
      <div role="alert" className="alert alert-warning mt-10 w-3/4 mx-auto">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 shrink-0 stroke-current"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>An error has occurred: {petError.message}</span>
      </div>
    );

  return (
    <div>
      <PageTitle
        heading={"Adoptable Pets"}
        subHeading={
          "Discover a variety of pets waiting for a home. Search by name or category and explore detailed profiles."
        }
      ></PageTitle>

      {/* Search Options */}
      <div className="mb-3 flex flex-col lg:flex-row justify-between px-2 items-center space-y-2">
        <form
          className="w-fit flex gap-2"
          onSubmit={(e) => {
            handleInput(e);
          }}
        >
          <input
            className="input input-bordered w-full max-w-xs"
            placeholder="Type here"
            type="text"
            name="name"
            id="name"
          />
          <button className="commonly-used-button2 min-h-full" type="submit">
            <CiSearch className="text-black" />
          </button>
        </form>
        <button
          className="commonly-used-button2 max-w-fit"
          onClick={handleAllPets}
        >
          <h2 className="text-black">All Pets</h2>
        </button>
        <select
          onChange={handleSelect}
          className="select select-secondary w-full max-w-xs"
          value={selectedCategory}
        >
          <option disabled selected value="">
            Pick your favorite language
          </option>
          <option value="dog">Dog</option>
          <option value="cat">Cat</option>
          <option value="rabbit">Rabbit</option>
          <option value="bird">Bird</option>
          <option value="other">Others</option>
        </select>
      </div>

      {/* Searched Pet */}
      {searchedPet  ? (
        <div className=" p-4 mb-10 rounded">
          <h2 className="text-center font-bold">Searched Pet</h2>
          <div className="card bg-base-100 shadow-xl max-w-96 mx-auto">
            <figure>
              <div className="w-full relative">
                <img
                  className="h-60 w-full"
                  src={searchedPet?.image}
                  alt="Shoes"
                />
              </div>
            </figure>
            <div className="card-body">
              <div className="card-title flex justify-center mb-2">
                {" "}
                <MdOutlinePets className="text-3xl" />{" "}
                <h2 className="text-3xl"> {searchedPet?.name}</h2>
              </div>
              <div className="flex justify-center space-x-1">
                <TbClockEdit className="text-2xl" />
                <span className="">Age:</span>
                <h2 className="font-bold">{searchedPet?.age} old</h2>
              </div>
              <div className="flex justify-center space-x-1 mb-5">
                <TiLocationOutline className="text-2xl" />
                <span className=" ">Location:</span>
                <h2 className="font-bold">{searchedPet?.location}</h2>
              </div>
              <Link
                to={`/petDetails/${searchedPet?._id}`}
                className="absolute card-used-button left-0 bottom-0 w-full text-center"
              >
                More About{" "}
                <span className="font-bold uppercase">{searchedPet?.name}</span>
              </Link>
            </div>
          </div>
        </div>
      ) : categorizedPet?.length > 0 ? (
        <div className=" p-4 mb-10 rounded">
          <h2 className="text-center font-bold">Categorized Pet</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full gap-10 px-2">
            {Array.isArray(categorizedPet) ? (
              categorizedPet.map((pet) => (
                <div className="card bg-base-100 shadow-xl" key={pet?._id}>
                  <figure>
                    <div className="w-full relative">
                      <img
                        className="h-60 w-full"
                        src={pet?.image}
                        alt="Shoes"
                      />
                    </div>
                  </figure>
                  <div className="card-body">
                    <div className="card-title flex justify-center mb-2">
                      {" "}
                      <MdOutlinePets className="text-3xl" />{" "}
                      <h2 className="text-3xl"> {pet?.name}</h2>
                    </div>
                    <div className="flex justify-center space-x-1">
                      <TbClockEdit className="text-2xl" />
                      <span className="">Age:</span>
                      <h2 className="font-bold">{pet?.age} old</h2>
                    </div>
                    <div className="flex justify-center space-x-1 mb-5">
                      <TiLocationOutline className="text-2xl" />
                      <span className=" ">Location:</span>
                      <h2 className="font-bold">{pet?.location}</h2>
                    </div>
                    <Link
                      to={`/petDetails/${pet?._id}`}
                      className="absolute card-used-button left-0 bottom-0 w-full text-center"
                    >
                      More About{" "}
                      <span className="font-bold uppercase">{pet?.name}</span>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div>No pets available</div>
            )}
          </div>
        </div>
      ) : (
        <div className=" p-4 mb-10 rounded">
          <h2 className="text-center font-bold">All Pets</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full gap-10 px-2">
            {Array.isArray(pets) ? (
              pets.map((pet) => (
                <div className="card bg-base-100 shadow-xl" key={pet?._id}>
                  <figure>
                    <div className="w-full relative">
                      <img
                        className="h-60 w-full"
                        src={pet?.image}
                        alt="Shoes"
                      />
                    </div>
                  </figure>
                  <div className="card-body">
                    <div className="card-title flex justify-center mb-2">
                      {" "}
                      <MdOutlinePets className="text-3xl" />{" "}
                      <h2 className="text-3xl"> {pet?.name}</h2>
                    </div>
                    <div className="flex justify-center space-x-1">
                      <TbClockEdit className="text-2xl" />
                      <span className="">Age:</span>
                      <h2 className="font-bold">{pet?.age} old</h2>
                    </div>
                    <div className="flex justify-center space-x-1 mb-5">
                      <TiLocationOutline className="text-2xl" />
                      <span className=" ">Location:</span>
                      <h2 className="font-bold">{pet?.location}</h2>
                    </div>
                    <Link
                      to={`/petDetails/${pet?._id}`}
                      className="absolute card-used-button left-0 bottom-0 w-full text-center"
                    >
                      More About{" "}
                      <span className="font-bold uppercase">{pet?.name}</span>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div>No pets available</div>
            )}
          </div>
        </div>
      )}

      {/* All Pet Cards */}
    </div>
  );
};

export default PetListing;
