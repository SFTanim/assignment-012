import PageTitle from "../../components/Shared/PageTitle";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../components/hooks/useAxiosSecure";
import { MdDeleteOutline } from "react-icons/md";
import Swal from "sweetalert2";
import { MdChangeCircle } from "react-icons/md";

const AllDonations = () => {
  const axiosSecure = useAxiosSecure();
  const { data: donations, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axiosSecure.get("donations");
      return res.data;
    },
  });


  const handleDelete = (donation) => {
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
        axiosSecure.delete(`/donation/${donation?._id}`).then((res) => {
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

  const handleStatusChange = (donation) => {
    const data = { status: donation?.canDonate };
    if (donation?.canDonate === true) {
      Swal.fire({
        title: "Are you sure, you want to change this to PAUSE?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes!",
      }).then((result) => {
        if (result.isConfirmed) {
          axiosSecure.post(`/donations/${donation?._id}`, data).then((res) => {
            if (res?.data?.acknowledged) {
              Swal.fire({
                title: "Done!",
                text: "Set to PAUSE.",
                icon: "success",
              });
              refetch();
            }
          });
        }
      });
    } else {
      Swal.fire({
        title: "Are you sure, you want to change this to UNPAUSE?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes!",
      }).then((result) => {
        if (result.isConfirmed) {
          axiosSecure
            .post(`/donationStatus/${donation?._id}`, data)
            .then((res) => {
              if (res?.data?.acknowledged) {
                Swal.fire({
                  title: "Done!",
                  text: "Set to UNPAUSE.",
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
      <PageTitle heading={"All Donation Campaigns"}></PageTitle>

      <div className="overflow-x-auto">
        <table className="table mx-auto w-5/6">
          {/* head */}
          <thead>
            <tr className="text-center">
              <th></th>
              <th>Pet Image</th>
              <th>Pet Name</th>
              <th>User Email</th>
              <th>Delete</th>
              <th>Pause / Unpause</th>
            </tr>
          </thead>
          {donations?.map((donation, idx) => (
            <tbody key={idx}>
              <tr className="text-center">
                <td>{idx + 1}</td>
                <td>
                  <img
                    className="max-w-10 mx-auto rounded-lg"
                    src={donation?.image}
                    alt=""
                  />
                </td>
                <td>{donation?.name}</td>
                <td>{donation?.user}</td>
                <td>
                  <button
                    onClick={() => handleDelete(donation)}
                    className="tooltip tooltip-bottom"
                    data-tip="Delete"
                  >
                    <MdDeleteOutline className="mx-auto text-3xl text-red-600" />
                  </button>
                </td>
                <td>
                  {donation?.canDonate === true ? (
                    <div className="">
                      <h2 className="font-bold">Unpaused</h2>
                      <button
                        onClick={() => handleStatusChange(donation)}
                        className="tooltip tooltip-bottom"
                        data-tip="Change status"
                      >
                        <MdChangeCircle className="mx-auto text-3xl text-red-600" />
                      </button>
                    </div>
                  ) : (
                    <div className="">
                      <h2 className="font-bold">Paused</h2>
                      <button
                        onClick={() => handleStatusChange(donation)}
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

export default AllDonations;
