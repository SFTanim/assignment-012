import { useQuery } from "@tanstack/react-query";
import PageTitle from "./../../components/Shared/PageTitle";
import useAxiosSecure from "../../components/hooks/useAxiosSecure";
import { GrUserAdmin } from "react-icons/gr";
import { IoWarningOutline } from "react-icons/io5";
import Swal from "sweetalert2";

const AllUsers = () => {
  const axiosSecure = useAxiosSecure();
  const { data: allUser, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axiosSecure.get("users");
      return res.data;
    },
  });

  const handleMakeAdmin = (user) => {
    Swal.fire({
      title: "Are you sure, you want to make him Admin?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.post(`/makeAdmin/${user?._id}`).then((res) => {
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
  const handleBanHim = (user) => {
    Swal.fire({
      title: "Are you sure, you want to ban him?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.post(`/userBan/${user?._id}`).then((res) => {
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

  return (
    <div>
      <PageTitle heading={"All Users"}></PageTitle>
      <div className="overflow-x-auto">
        <table className="table mx-auto w-5/6">
          {/* head */}
          <thead>
            <tr className="text-center">
              <th></th>
              <th>Profile Image</th>
              <th>Email</th>
              <th>Name</th>
              <th>Make Admin</th>
              <th>Ban</th>
            </tr>
          </thead>
          {allUser?.map((user, idx) => (
            <tbody key={idx}>
              <tr className="text-center">
                <td>{idx + 1}</td>
                <td>
                  <img
                    className="max-w-10 mx-auto rounded-lg"
                    src={user?.photo}
                    alt=""
                  />
                </td>
                <td>{user?.email}</td>
                <td>{user?.name}</td>
                <td>
                  {user?.role === "admin" ? (
                    <h2 className="text-lg text-red-600">Admin</h2>
                  ) : (
                    <button
                      onClick={() => handleMakeAdmin(user)}
                      className="tooltip tooltip-bottom"
                      data-tip="Make Admin"
                    >
                      <GrUserAdmin className="mx-auto text-2xl text-red-600" />
                    </button>
                  )}
                </td>
                <td>
                  {user?.ban ? (
                    <h2 className="text-lg text-red-600">Banned</h2>
                  ) : (
                    <button
                      onClick={() => handleBanHim(user)}
                      className="tooltip tooltip-bottom"
                      data-tip="Ban Him"
                    >
                      <IoWarningOutline className="mx-auto text-2xl text-red-600" />
                    </button>
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

export default AllUsers;
