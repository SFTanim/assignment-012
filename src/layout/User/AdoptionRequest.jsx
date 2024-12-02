import { useQuery } from "@tanstack/react-query";
import PageTitle from "../../components/Shared/PageTitle";
import { CiCircleCheck, CiCircleRemove } from "react-icons/ci";
import useAuth from "../../components/hooks/useAuth";
import Swal from "sweetalert2";
import useAxiosSecure from "../../components/hooks/useAxiosSecure";

const AdoptionRequest = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  //   Fetching user inserted data
  const {
    isLoading,
    error,
    refetch,
    data: allPets,
  } = useQuery({
    queryKey: ["pets"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/myPets/${user?.email}`);
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

  const handleAccept = (id) => {
    const data = {
      adopt: true,
    };
    axiosSecure.post(`/myPets/${id}`, data).then((res) => {
      if (res?.data?.acknowledged) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Your work has been saved",
          showConfirmButton: false,
          timer: 2000,
        });
        refetch();
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
      }
    });
  };
  const handleReject = (id) => {
    axiosSecure.delete(`/pets/${id}`).then((res) => {
      if (res?.data?.acknowledged) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Your work has been saved",
          showConfirmButton: false,
          timer: 2000,
        });
        refetch();
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
      <PageTitle heading={"Adoption Request"}></PageTitle>

      <div className="p-2 text-center w-full md:w-3/4 mx-auto overflow-x-auto">
        <table className="table min-w-full border-collapse table-auto border border-gray-300 shadow-md rounded-md">
          {/* head */}
          <thead>
            <tr className="text-center">
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Location</th>
              <th>Accept Adoption</th>
              <th>Reject Adoption</th>
            </tr>
          </thead>
          <tbody>
            {/* row 2 */}

            {allPets?.map((pet, idx) =>
              pet?.adoptUser?.requesterName && !pet?.adopt ? (
                <tr className="hover text-center" key={idx}>
                  <td>{pet?.adoptUser?.requesterName}</td>
                  <td>{pet?.adoptUser?.requesterEmail}</td>
                  <td>{pet?.adoptUser?.requesterPhone}</td>
                  <td>{pet?.adoptUser?.requesterLocation}</td>
                  <td>
                    <button
                      onClick={() => handleAccept(pet?._id)}
                      className="mx-auto text-3xl"
                    >
                      <CiCircleCheck />{" "}
                    </button>
                  </td>
                  <td>
                    <button
                      onClick={() => handleReject(pet?._id)}
                      className="mx-auto text-3xl"
                    >
                      <CiCircleRemove />{" "}
                    </button>
                  </td>
                </tr>
              ) : (
                ""
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdoptionRequest;
