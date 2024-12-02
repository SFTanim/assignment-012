import { useNavigate, useParams } from "react-router-dom";

import useAllPets from "../hooks/useAllPets";
import useAuth from "../hooks/useAuth";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useAxiosSecure from "../hooks/useAxiosSecure";

const PetDetails = () => {
  const { user } = useAuth();
  const petsId = useParams();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const data = useAllPets(petsId.id);
  const pet = data?.data;
  const id = petsId.id;
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    const requestedUser = {
      requesterName: user?.displayName,
      requesterEmail: user?.email,
      requesterPhone: data?.phone,
      requesterLocation: data?.address,
    };
    axiosSecure.post(`/pets/${id}`, requestedUser).then((res) => {
      if (res?.data?.acknowledged) {
        const modal = document.getElementById("my_modal_1");
        modal.close();
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Adoption Request Sended",
          showConfirmButton: false,
          timer: 2000,
        });
        navigate("/petListing");
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
      }
    });
  };

  return (
    <div>
      <div className="card lg:card-side bg-base-100 shadow-xl">
        <figure className="flex-1">
          <img src={pet?.image} alt="Album" />
        </figure>
        <div className="card-body flex-1">
          <h2 className="card-title text-3xl">Pet Name: {pet?.name}</h2>
          <h4 className="text-xl">
            {" "}
            <span className="font-bold">Age: </span> {pet?.age}
          </h4>
          <h4 className="text-xl">
            {" "}
            <span className="font-bold">Color: </span> {pet?.color}
          </h4>
          <h4 className="text-xl">
            {" "}
            <span className="font-bold">Breed: </span> {pet?.breed}
          </h4>
          <h4 className="text-xl">
            {" "}
            <span className="font-bold">Weight: </span> {pet?.weight}
          </h4>
          <h4 className="text-xl">
            {" "}
            <span className="font-bold">Location: </span> {pet?.location}
          </h4>
          <div className="card-actions justify-end">
            {/* -----------------------------------------MODAL--------------------------- */}
            {pet?.adopt ? (
              <button
                disabled
                className="font-bold text-red-600"
                onClick={() =>
                  document.getElementById("my_modal_1").showModal()
                }
              >
                Adopted
              </button>
            ) : pet?.adoptUser?.requesterName ? (
              <button
                disabled
                className="font-bold text-red-600"
                onClick={() =>
                  document.getElementById("my_modal_1").showModal()
                }
              >
                Adoption request sended
              </button>
            ) : (
              <button
                className="commonly-used-button3"
                onClick={() =>
                  document.getElementById("my_modal_1").showModal()
                }
              >
                Adopt
              </button>
            )}
            <dialog id="my_modal_1" className="modal">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="modal-box w-fit max-w-5xl">
                  <div className="flex flex-col lg:flex-row items-center gap-5 border-2 p-3 rounded-t-lg">
                    <div className="flex-1 min-w-0 lg:min-w-96">
                      <h2 className="card-title text-3xl">
                        Pet Name: {pet?.name}
                      </h2>
                      <h4 className="text-lg">
                        <span className="font-bold">Pet Id: </span> {pet?._id}
                      </h4>
                    </div>
                    <div className="flex-1">
                      <img
                        className="w-32 mx-auto rounded-xl"
                        src={pet?.image}
                        alt=""
                      />
                    </div>
                  </div>
                  <div className="space-y-2 border-2 p-3 rounded-b-lg">
                    <h2 className="font-bold text-2xl">Your Information </h2>
                    <h2 className="capitalize">
                      <span className="font-bold">Name:</span>{" "}
                      {user?.displayName}
                    </h2>
                    <h2 className="">
                      <span className="font-bold">Email:</span> {user?.email}
                    </h2>
                    <h2 className="">
                      <span className="font-bold">Phone Number:</span>
                      <input
                        type="tel"
                        placeholder="number"
                        className="border ml-1 p-1 px-2 rounded-lg"
                        {...register("phone", { required: true })}
                      />
                    </h2>
                    <h2 className="">
                      <span className="font-bold">Address:</span>
                      <input
                        type="text"
                        placeholder="address"
                        className="border ml-1 p-1 px-2 rounded-lg"
                        {...register("address", { required: true })}
                      />
                    </h2>
                  </div>
                  <div className="w-full commonly-used-button3 mt-2 text-center">
                    <input type="submit" />
                  </div>
                  <div className="modal-action">
                    <form method="dialog" className="w-full text-center">
                      {/* if there is a button in form, it will close the modal */}
                      <button className="btn">Close</button>
                    </form>
                  </div>
                </div>
              </form>
            </dialog>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetDetails;
