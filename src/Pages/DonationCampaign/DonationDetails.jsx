import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import SectionTItle from "../../components/Shared/SectionTItle";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckOutForm from "./Payments/CheckOutForm";
import { useState } from "react";
import useAxiosSecure from "../../components/hooks/useAxiosSecure";

const stripePromice = loadStripe(import.meta.env.VITE_PAYMENT_GATEWAY_PK);

const DonationDetails = () => {
  const id = useParams().id;
  const axiosSecure = useAxiosSecure();
  const [givenDonation, setDonation] = useState(0);
  const [greaterValue, setGreaterValue] = useState(false);

  const {
    isLoading,
    error,
    refetch,
    data: donation,
  } = useQuery({
    queryKey: ["donation"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/don/${id}`);
      return res.data;
    },
  });

  if (isLoading)
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

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    if (inputValue > donation?.maxDonation - donation?.donatedMoney) {
      setGreaterValue(true);
    } else {
      setGreaterValue(false);
      setDonation(inputValue);
    }
  };

  return (
    <div>
      <div className="card lg:card-side bg-base-100 shadow-xl">
        <figure className="flex-1">
          <img src={donation?.image} alt="Album" />
        </figure>
        <div className="card-body flex-1">
          <h2 className="card-title text-3xl">Pet Name: {donation?.name}</h2>
          <h4 className="text-xl">
            {" "}
            <span className="font-bold">Age: </span> {donation?._id}
          </h4>
          <h4 className="text-xl">
            {" "}
            <span className="font-bold">Last Date for Donate: </span>{" "}
            {donation?.lastDate}
          </h4>
          <h4 className="text-xl">
            {" "}
            <span className="font-bold">Description: </span>{" "}
            {donation?.shortDescription}
          </h4>
          <h4 className="text-xl">
            {" "}
            <span className="font-bold">Donation Needs: </span>{" "}
            {donation?.maxDonation}
          </h4>
          <h4 className="text-xl">
            {" "}
            <span className="font-bold">Donated Amount: </span>{" "}
            {donation?.donatedMoney}
          </h4>
          <div className="card-actions justify-end">
            {/* -----------------------------------------MODAL--------------------------- */}
            {donation?.maxDonation === donation.donatedMoney ? (
              <button
                disabled
                className="font-bold text-red-600"
                onClick={() =>
                  document.getElementById("my_modal_3").showModal()
                }
              >
                Donation Complete
              </button>
            ) : donation?.canDonate ? (
              <button
                className="commonly-used-button3"
                onClick={() =>
                  document.getElementById("my_modal_3").showModal()
                }
              >
                Donate
              </button>
            ) : donation?.adoptUser?.requesterName ? (
              <button
                disabled
                className="font-bold text-red-600"
                onClick={() =>
                  document.getElementById("my_modal_3").showModal()
                }
              >
                Adoption request sended
              </button>
            ) : (
              <button
                disabled
                className="font-bold text-red-600"
                onClick={() =>
                  document.getElementById("my_modal_3").showModal()
                }
              >
                Donation Complete
              </button>
            )}

            <dialog id="my_modal_3" className="modal">
              <div className="modal-box">
                <form method="dialog">
                  <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                    ✕
                  </button>
                </form>
                <SectionTItle heading={"donate"}></SectionTItle>
                <form>
                  <div className="">
                    <h2 className="font-bold">Donation Amount:</h2>
                    <input
                      className="input input-bordered input-secondary w-full mb-5"
                      type="number"
                      name="donation"
                      id="donation"
                      placeholder={`Max Amount: ${
                        donation?.maxDonation - donation?.donatedMoney
                      }`}
                      onChange={handleInputChange}
                    />
                  </div>
                </form>
                {greaterValue && (
                  <p className="text-red-700 font-bold text-right mb-3">
                    *Please dont send more then what we needed!
                  </p>
                )}

                <Elements stripe={stripePromice}>
                  <h2 className="mb-2 font-bold">Your bank information: </h2>
                  <CheckOutForm
                    greaterValue={greaterValue}
                    donation={donation}
                    refetch={refetch}
                    maxDonation={donation?.maxDonation}
                    givenDonation={givenDonation}
                  ></CheckOutForm>
                </Elements>
              </div>
            </dialog>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationDetails;
