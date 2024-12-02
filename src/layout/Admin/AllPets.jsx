import PageTitle from "../../components/Shared/PageTitle";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../components/hooks/useAxiosSecure";
import { MdDeleteOutline } from "react-icons/md";
import Swal from "sweetalert2";
import { MdChangeCircle } from "react-icons/md";

const AllPets = () => {
  const axiosSecure = useAxiosSecure();
  const { data: allPets, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axiosSecure.get("pets");
      return res.data;
    },
  });

  const handleDelete = (pet) => {
    Swal.fire({
      title: "Are you sure, you want to delete this pet profile?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/myPets/${pet?._id}`).then((res) => {
          if (res?.data?.acknowledged) {
            Swal.fire({
              title: "Done!",
              text: "He is a admin.",
              icon: "success",
            });
            refetch();
          }
        });
      }
    });
  };

  const handleAdoptStatusChange = (pet) => {
    const adoptData = { adopt: pet?.adopt };
    if (pet?.adopt === true) {
      Swal.fire({
        title: "Are you sure, you want to change this to NOT ADOPTED?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes!",
      }).then((result) => {
        if (result.isConfirmed) {
          axiosSecure.post(`/pets/${pet?._id}`, adoptData).then((res) => {
            if (res?.data?.acknowledged) {
              Swal.fire({
                title: "Done!",
                text: "Set to NOT ADOPTED.",
                icon: "success",
              });
              refetch();
            }
          });
        }
      });
    } else {
      Swal.fire({
        title: "Are you sure, you want to change this to ADOPTED?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes!",
      }).then((result) => {
        if (result.isConfirmed) {
          axiosSecure.post(`/pets/${pet?._id}`, adoptData).then((res) => {
            if (res?.data?.acknowledged) {
              Swal.fire({
                title: "Done!",
                text: "Set to ADOPTED.",
                icon: "success",
              });
              refetch();
            }
          });
        }
      });
    }
  };
  return (
    <div>
      <PageTitle heading={"All Pets"}></PageTitle>

      <div className="overflow-x-auto">
        <table className="table mx-auto w-5/6">
          {/* head */}
          <thead>
            <tr className="text-center">
              <th></th>
              <th>Pet Image</th>
              <th>Pet Name</th>
              <th>Owners Email</th>
              <th>Delete</th>
              <th>Adopted / Not Adopted</th>
            </tr>
          </thead>
          {allPets?.map((pet, idx) => (
            <tbody key={idx}>
              <tr className="text-center">
                <td>{idx + 1}</td>
                <td>
                  <img
                    className="max-w-10 mx-auto rounded-lg"
                    src={pet?.image}
                    alt=""
                  />
                </td>
                <td>{pet?.name}</td>
                <td>{pet?.user}</td>
                <td>
                  <button
                    onClick={() => handleDelete(pet)}
                    className="tooltip tooltip-bottom"
                    data-tip="Delete"
                  >
                    <MdDeleteOutline className="mx-auto text-3xl text-red-600" />
                  </button>
                </td>
                <td>
                  {pet?.adopt === true ? (
                    <div className="">
                      <h2 className="font-bold">Adopted</h2>
                      <button
                        onClick={() => handleAdoptStatusChange(pet)}
                        className="tooltip tooltip-bottom"
                        data-tip="Change status"
                      >
                        <MdChangeCircle className="mx-auto text-3xl text-red-600" />
                      </button>
                    </div>
                  ) : (
                    <div className="">
                      <h2 className="font-bold">Not Adopted</h2>
                      <button
                        onClick={() => handleAdoptStatusChange(pet)}
                        className="tooltip tooltip-bottom"
                        data-tip="Change status"
                      >
                        <MdChangeCircle className="mx-auto text-3xl text-red-600" />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            </tbody>
          ))}
        </table>
      </div>
    </div>
  );
};

export default AllPets;
