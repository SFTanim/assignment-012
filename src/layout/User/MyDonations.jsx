import { useQuery } from "@tanstack/react-query";
import useAuth from "../../components/hooks/useAuth";
import PageTitle from "./../../components/Shared/PageTitle";
import { RiRefund2Line } from "react-icons/ri";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import useAxiosSecure from "../../components/hooks/useAxiosSecure";

const MyDonations = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const {
    isPending,
    error,
    refetch,
    data: myDonations,
  } = useQuery({
    queryKey: ["donations"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/myDonation/${user.email}`);
      return res.data;
    },
  });

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

  const handleRefund = (donation) => {
    const donationId = donation?._id;

    Swal.fire({
      title: "Are you sure you want a refund?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, refund it!",
    }).then((result) => {
      if (result.isConfirmed) {
        donation?.donatedPersons.map(async (person) => {
          const newValueForDonation = donation?.donatedMoney - person?.amount;
          const paymentId = person?.paymentIntentId;
          if (!paymentId) {
            return Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "No payment ID provided!",
            });
          }
          if (person?.paymentIntentId) {
            const response = await axiosSecure.post("/paymentRefund", {
              paymentId,
              amount: person?.amount * 100,
              donationId,
              newValueForDonation,
            });
            if (response?.data?.acknowledged) {
              Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Refund Successful",
                showConfirmButton: false,
                timer: 1500,
              });
              refetch();
            } else {
              Swal.fire({
                position: "top-end",
                icon: "error",
                title: "Refund Unsuccessful",
                showConfirmButton: false,
                timer: 1500,
              });
            }
          }
        });
      }
    });
  };

  return (
    <div>
      <PageTitle heading={" my donations"}></PageTitle>
      <div className="overflow-x-auto">
        <table className="table mx-auto w-5/6">
          {/* head */}
          {myDonations?.length > 0 ? (
            <thead>
              <tr className="text-center">
                <th></th>
                <th>Pet Image</th>
                <th>Pet name</th>
                <th>Donated Amount</th>
                <th>Refund</th>
              </tr>
            </thead>
          ) : (
            <div className=""></div>
          )}

          {/* rows */}
          {myDonations?.length > 0 ? (
            <tbody>
              {myDonations?.map((donations, index) => (
                <tr key={index} className="text-center">
                  <th></th>
                  <th>
                    <img
                      className="h-20 mx-auto rounded-md"
                      src={donations?.image}
                      alt=""
                    />
                  </th>
                  <th>
                    {donations?.name}..{donations?._id}
                  </th>
                  <th>
                    {donations?.donatedPersons?.map((don, index) => (
                      <div key={index} className="flex justify-center">
                        {/* {setTotalAmount(totalAmount + don?.amount)} */}
                        <h2 className="">
                          {index + 1}st payment: {don?.amount}
                        </h2>
                      </div>
                    ))}
                  </th>
                  <th>
                    <button
                      onClick={() => handleRefund(donations)}
                      className="text-4xl text-red-700 tooltip tooltip-bottom"
                      data-tip="Refund all money
                    "
                    >
                      <RiRefund2Line />
                    </button>
                  </th>
                </tr>
              ))}
            </tbody>
          ) : (
            <div className="w-full mt-10">
              <h2 className="text-center text-xl md:text-2xl ">
                It seems that you have not had the opportunity to make a
                donation yet. If you are able, this would be a great time to
                contribute.
                <Link to="/blogs">
                  <h2 className="text-[#8FAF00] mt-2">Donate Now</h2>
                </Link>
              </h2>
            </div>
          )}
        </table>
      </div>
    </div>
  );
};

export default MyDonations;
