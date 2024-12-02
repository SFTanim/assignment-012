import { useQuery } from "@tanstack/react-query";
import PageTitle from "../../components/Shared/PageTitle";
import useAuth from "../../components/hooks/useAuth";
import { CiCircleList } from "react-icons/ci";
import { CiEdit } from "react-icons/ci";
import { MdOutlineMotionPhotosPaused } from "react-icons/md";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useEffect, useState } from "react";
import Select from "react-select";
import Swal from "sweetalert2";
import useAxiosSecure from "../../components/hooks/useAxiosSecure";

const imageHostingKey = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const imageHostingApi = `https://api.imgbb.com/1/upload?key=${imageHostingKey}`;

const donateTrueOrFalse = [
  { value: true, label: "true" },
  { value: false, label: "false" },
];

const MyDonationCampaigns = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [donationId, setDonationId] = useState("");

  // useQuary for all donation under my email
  const {
    isPending,
    error,
    refetch,
    data: myDonation,
  } = useQuery({
    queryKey: ["donations"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/donations/${user.email}`);
      return res.data;
    },
  });

  // useQuary for donation Info
  const { data: donationInfo, refetch: refetchInfo } = useQuery({
    queryKey: ["donationInfo", donationId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/don/${donationId}`);
      return res.data;
    },
    enabled: !!donationId,
  });

  const [imageUrl, setImageUrl] = useState(donationInfo?.image);
  // Image Handler
  const handleImbbImageUpload = async (file) => {
    const imageFile = { image: file };
    const res = await axiosSecure.post(imageHostingApi, imageFile, {
      headers: {
        "content-type": "multipart/form-data",
      },
    });
    setImageUrl(res?.data?.data?.display_url);
  };

  useEffect(() => {
    if (donationId) {
      refetchInfo();
      setImageUrl(donationInfo?.image);
    }
  }, [donationInfo, donationId, refetchInfo]);


  const handleEdit = () => {
    if (typeof donationInfo === "object") {
      document.getElementById("my_modal_5").showModal();
    }
    // setDonationId(id);
  };

  const initialValues = {
    petName: donationInfo?.name || "",
    shortDescription: donationInfo?.shortDescription || "",
    longDescription: donationInfo?.longDescription || "",
    lastDate: donationInfo?.lastDate || "",
    maxDonation: donationInfo?.maxDonation,
    canDonate: donationInfo?.canDonate?.value,
  };

  const validate = (values) => {
    const errors = {};
    if (!values.petName) {
      errors.petName = "*Required";
    }
    if (!values.lastDate) {
      errors.lastDate = "*Required";
    }
    if (!values.maxDonation) {
      errors.maxDonation = "*Required";
    }
    if (!values.shortDescription) {
      errors.shortDescription = "*Required";
    }
    if (!values.longDescription) {
      errors.longDescription = "*Required";
    }
    return errors;
  };

  const handleEditSubmit = (values) => {
    if (imageUrl) {
      const donationData = {
        name: values?.petName,
        image: imageUrl,
        shortDescription: values?.shortDescription,
        longDescription: values?.longDescription,
        maxDonation: values?.maxDonation,
        lastDate: values?.lastDate,
        canDonate: values?.canDonate?.value,
      };
      axiosSecure.post(`/donations/${donationId}`, donationData).then((res) => {
        if (res?.data?.acknowledged) {
          const modal = document.getElementById("my_modal_5");
          modal.close();
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Your work has been saved",
            showConfirmButton: false,
            timer: 2000,
          });
          refetch();
          setImageUrl("");
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
          });
        }
      });
    } else {
      const modal = document.getElementById("my_modal_5");
      modal.close();
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please insert a photo of your pet!",
      });
    }
  };
  const handlePause = (id) => {
    const donationData = {
      canDonate: false,
    };
    axiosSecure.post(`/donations/${id}`, donationData).then((res) => {
      if (res?.data?.acknowledged) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Donation is paused",
          showConfirmButton: false,
          timer: 2000,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
      }
    });
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

  return (
    <div>
      <PageTitle heading={"My Donation Campaigns"}></PageTitle>

      {/* Main content */}
      <div className="">
        <div className="overflow-x-auto">
          <table className="table mx-auto w-5/6">
            {/* head */}
            <thead>
              <tr className="text-center">
                <th></th>
                <th>Pet Name</th>
                <th>Maximum Donation</th>
                <th>Donation Progress</th>
                <th>Edit</th>
                <th>Pause</th>
                <th>Donation</th>
              </tr>
            </thead>
            <tbody>
              {/* rows */}
              {myDonation?.map((don, index) => (
                <tr key={index} className="text-center">
                  <th>{index + 1}</th>
                  <td>{don?.name}</td>
                  <td>{don?.maxDonation}</td>
                  <td>
                    <progress
                      className="progress progress-error "
                      value={don?.donatedMoney}
                      max={don?.maxDonation}
                    ></progress>
                  </td>
                  <td>
                    <button
                      onClick={() => {
                        setDonationId(don?._id);
                        handleEdit(don?._id);
                      }}
                      className="text-2xl text-red-500"
                    >
                      <CiEdit />
                    </button>
                  </td>
                  <td>
                    <button
                      onClick={() => handlePause(don?._id)}
                      className="text-2xl text-red-500"
                    >
                      <MdOutlineMotionPhotosPaused />
                    </button>
                  </td>
                  <td>
                    <button
                      onClick={() =>
                        document.getElementById("my_modal_4").showModal()
                      }
                      className="text-2xl text-red-500"
                    >
                      <CiCircleList />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL for showing donatory list */}
      <dialog id="my_modal_4" className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          {myDonation?.map((don, index) => (
            <table key={index} className="table mx-auto w-5/6">
              <thead>
                {don?.donatedPersons.length > 0 ? (
                  <tr className="text-center">
                    <th>Serial</th>
                    <th>Donators Name</th>
                    <th>Donated Amount</th>
                  </tr>
                ) : (
                  <div className=""></div>
                )}
              </thead>
              <tbody>
                {don?.donatedPersons.length > 0 ? (
                  don?.donatedPersons?.map((don, idx) => (
                    <tr key={idx} className="text-center">
                      <td>{idx + 1}</td>
                      <td>{don?.name ? don?.name : don?.email}</td>
                      <td>{don?.amount}</td>
                    </tr>
                  ))
                ) : (
                  <div className="w-full mt-10">
                    <h2 className="text-center text-xl md:text-2xl ">
                      It seems that you have not had the opportunity
                    </h2>
                  </div>
                )}
              </tbody>
            </table>
          ))}
        </div>
      </dialog>

      {/* MODAL for Editing donation data */}
      <dialog
        id="my_modal_5"
        className="modal modal-bottom sm:modal-middle w-4/5 mx-auto"
      >
        <div className="modal-box min-w-full">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <Formik
            enableReinitialize={true}
            initialValues={initialValues}
            validate={validate}
            onSubmit={handleEditSubmit}
          >
            {({ setFieldValue }) => (
              <Form className="flex flex-col text-base lg:text-xl">
                <div className="flex flex-col lg:flex-row justify-between  w-4/5 mx-auto">
                  <div className="space-y-2 flex flex-col flex-1 items-start p-4 rounded-xl">
                    <div>
                      <label>Pet Name: </label>
                      <Field className="input input-bordered" name="petName" />
                      <ErrorMessage
                        id="formStyle"
                        name="petName"
                        component="div"
                      />
                    </div>

                    <div>
                      <label>Pet Image: </label>
                      <input
                        type="file"
                        onChange={(event) => {
                          handleImbbImageUpload(event.currentTarget.files[0]);
                        }}
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <label>Pet Category: </label>
                      <Select
                        options={donateTrueOrFalse}
                        name="canDonate"
                        className="max-w-36"
                        onChange={(option) =>
                          setFieldValue("canDonate", option)
                        }
                      />
                      <ErrorMessage
                        id="formStyle"
                        name="canDonate"
                        component="div"
                      />
                    </div>

                    <div>
                      <label>Maximum Donation Amount: </label>
                      <Field
                        type="number"
                        className="input input-bordered"
                        name="maxDonation"
                      />
                      <ErrorMessage
                        id="formStyle"
                        name="maxDonation"
                        component="div"
                      />
                    </div>

                    <div className="">
                      <label>Last Date of Donation: </label>
                      <Field
                        type="date"
                        name="lastDate"
                        className="input input-bordered"
                      />
                    </div>

                    <div>
                      <label>Short Description: </label>
                      <Field
                        className="input input-bordered"
                        name="shortDescription"
                      />
                      <ErrorMessage
                        id="formStyle"
                        name="shortDescription"
                        component="div"
                      />
                    </div>

                    <div className="flex items-center">
                      <label>Long Description: </label>
                      <Field
                        className="input input-bordered"
                        name="longDescription"
                        as="textarea"
                      />
                      <ErrorMessage
                        id="formStyle"
                        name="longDescription"
                        component="div"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-center">
                      Current Image
                    </h3>
                    <img className="rounded-2xl p-3" src={imageUrl} alt="" />
                  </div>
                </div>

                <button
                  className="commonly-used-button3 w-fit mx-auto mt-5"
                  type="submit"
                >
                  Submit
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </dialog>
    </div>
  );
};

export default MyDonationCampaigns;
