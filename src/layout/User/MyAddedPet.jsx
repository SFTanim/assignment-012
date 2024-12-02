import PageTitle from "./../../components/Shared/PageTitle";
import { MdOutlineDelete, MdOutlinePets } from "react-icons/md";
import { GrUpdate } from "react-icons/gr";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Select from "react-select";
import { useQuery } from "@tanstack/react-query";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import useAuth from "../../components/hooks/useAuth";
import Swal from "sweetalert2";
import { useCallback, useEffect, useState } from "react";
import useAllPets from "../../components/hooks/useAllPets";
import useAxiosSecure from "../../components/hooks/useAxiosSecure";

const columnHelper = createColumnHelper();

const petCategories = [
  { value: "dog", label: "Dog" },
  { value: "cat", label: "Cat" },
  { value: "rabbit", label: "Rabbit" },
  { value: "bird", label: "Bird" },
  { value: "other", label: "Other" },
];

const imageHostingKey = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const imageHostingAPI = `https://api.imgbb.com/1/upload?key=${imageHostingKey}`;

const MyAddedPet = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [updatePetId, setUpdatePetId] = useState("");
  const [adopt, setAdopt] = useState(false);
  const { data: pet, refetch: refetchPet } = useAllPets(updatePetId);
  const [imageUrl, setImageUrl] = useState(pet?.image);

  const {
    isLoading,
    error,
    refetch,
    data: myPets,
  } = useQuery({
    queryKey: ["myPets"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/myPets/${user?.email}`);
      return res.data;
    },
  });
  const handleAdoptUpdate = useCallback(
    (id) => {
      if (pet?.adopt === true) {
        return Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "It's already adopted!",
        });
      } else {
        const petInfo = {
          adopt: true,
        };

        return Swal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Adopt!",
        }).then((result) => {
          if (result.isConfirmed) {
            axiosSecure.post(`/myPets/${id}`, petInfo).then((res) => {
              if (res?.data?.acknowledged) {
                refetch();
                Swal.fire({
                  position: "top-end",
                  icon: "success",
                  title: "Your pet has been updated",
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
          }
        });
      }
    },
    [axiosSecure, pet, refetch]
  );

  useEffect(() => {
    if (updatePetId) {
      refetchPet();
      setImageUrl(pet?.image);
      if (adopt === true) {
        handleAdoptUpdate(updatePetId);
      }
    }
  }, [updatePetId, refetchPet, pet, adopt, handleAdoptUpdate]);

  const handleImageUpload = async (file) => {
    const imageFile = { image: file };
    const res = await axiosSecure.post(imageHostingAPI, imageFile, {
      headers: {
        "content-type": "multipart/form-data",
      },
    });
    setImageUrl(res?.data?.data?.display_url);
  };

  const validate = (values) => {
    const errors = {};
    if (!values.petName) {
      errors.petName = "*Required";
    }
    if (!imageUrl) {
      errors.petName = "*Required";
    }
    if (!values.petAge) {
      errors.petAge = "*Required";
    } else if (values.petAge <= 0) {
      errors.petAge = "Age must be a positive number";
    }
    if (!values.petCategory) {
      errors.petCategory = "*Required";
    }
    if (!values.petLocation) {
      errors.petLocation = "*Required";
    }
    if (!values.shortDescription) {
      errors.shortDescription = "*Required";
    }
    if (!values.longDescription) {
      errors.longDescription = "*Required";
    }
    return errors;
  };

  const initialValues = {
    petName: pet?.name,
    breedName: pet?.breed,
    petAge: pet?.age,
    petCategory: null,
    petLocation: pet?.location,
    shortDescription: pet?.shortDescription,
    longDescription: pet?.longDescription,
  };
  const handleUpdate = () => {
    if (typeof pet === "object") {
      document.getElementById("my_modal_5").showModal();
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/myPets/${id}`).then((res) => {
          if (res.data.acknowledged) {
            Swal.fire({
              title: "Deleted!",
              text: "Your file has been deleted.",
              icon: "success",
              showConfirmButton: true,
              confirmButtonText: "Ok",
            });
            refetch();
          }
        });
      }
    });
  };

  const handleAdopt = (id) => {
    setAdopt(true);
    handleAdoptUpdate(id);
  };

  const columns = [
    columnHelper.display({
      id: "serialNumber",
      header: () => "S.No",
      cell: (info) => info.row.index + 1,
    }),
    columnHelper.accessor("name", {
      cell: (info) => info.getValue(),
      header: () => <span className="">Pets Name</span>,
      // footer: (info) => info.column.id,
    }),

    columnHelper.accessor("category", {
      cell: (info) => <i>{info.getValue()}</i>,
      header: () => <span>Pets Category</span>,
    }),

    columnHelper.accessor("image", {
      header: () => "Image",
      cell: (info) => (
        <img className="h-20 mx-auto" src={info.renderValue()} alt="" />
      ),
    }),

    columnHelper.accessor("adopt", {
      header: () => <span>Adopt</span>,
      cell: (info) => (
        <i>
          {info.getValue() === true ? (
            <h2 className="">Adopted</h2>
          ) : (
            <h2 className="">Not Adopted</h2>
          )}
        </i>
      ),
    }),

    columnHelper.accessor("updateButton", {
      id: "updateButton",
      header: () => "Update Button",
      cell: (info) => (
        <button
          onClick={() => {
            setUpdatePetId(info?.row?.original?._id);
            handleUpdate(info?.row?.original?._id);
          }}
          className="text-xl text-red-600 tooltip tooltip-bottom"
          data-tip="Update"
        >
          <GrUpdate />
        </button>
      ),
    }),

    columnHelper.accessor("adoptButton", {
      id: "adoptButton",
      header: () => "Adopt Button",
      cell: (info) => (
        <button
          onClick={() => {
            setUpdatePetId(info?.row?.original?._id);
            handleAdopt(info.row.original._id);
          }}
          className="text-3xl text-red-600 tooltip tooltip-bottom"
          data-tip="Adopt"
        >
          <MdOutlinePets />
        </button>
      ),
    }),

    columnHelper.accessor("deleteButton", {
      id: "deleteButton",
      header: () => "Delete Button",
      cell: (info) => (
        <button
          onClick={() => handleDelete(info.row.original._id)}
          className="text-3xl text-red-600 tooltip tooltip-bottom"
          data-tip="Delete"
        >
          <MdOutlineDelete />
        </button>
      ),
    }),
  ];

  const data = myPets ?? [];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return (
      <div className="flex w-3/4 mx-auto flex-col gap-4 mt-10">
        <div className="skeleton h-32 w-full"></div>
        <div className="skeleton h-4 w-28"></div>
        <div className="skeleton h-4 w-full"></div>
        <div className="skeleton h-4 w-full"></div>
      </div>
    );
  }

  if (error) {
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
  }

  //   Modal Form Submit
  const handleSubmit = (values) => {
    const petInfo = {
      name: values?.petName,
      breed: values?.breedName,
      image: imageUrl,
      shortDescription: values?.shortDescription,
      age: values?.petAge,
      category: values?.petCategory?.value,
      location: values?.petLocation,
      longDescription: values?.longDescription,
    };

    axiosSecure.post(`/myPets/${pet?._id}`, petInfo).then((res) => {
      if (res?.data?.acknowledged) {
        refetch();

        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Your work has been updated",
          showConfirmButton: false,
          timer: 2000,
        });
        const modal = document.getElementById("my_modal_5");
        modal.close();
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
      <PageTitle heading={"My Added Pets"} />
      <div className="p-2 text-center w-full md:w-3/4 mx-auto overflow-x-auto">
        {/* Modal Start */}

        {/* Update Modal */}
        <dialog
          id="my_modal_5"
          className="modal modal-bottom sm:modal-middle w-4/5 mx-auto"
        >
          <div className="modal-box min-w-full">
            {/* Form closing button */}
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                ✕
              </button>
            </form>

            <h3 className="font-bold text-lg capitalize">
              Update Your pet information
            </h3>
            <Formik
              enableReinitialize
              initialValues={initialValues}
              validate={validate}
              onSubmit={handleSubmit}
            >
              {({ setFieldValue }) => (
                <Form className="flex flex-col text-base lg:text-xl">
                  <div className="flex flex-col lg:flex-row justify-between border-0 lg:border w-4/5 mx-auto">
                    <div className="space-y-2 flex flex-col flex-1 items-start p-4 rounded-xl">
                      <div>
                        <label>Pet Name: </label>
                        <Field
                          className="input input-bordered"
                          name="petName"
                        />
                        <ErrorMessage
                          id="formStyle"
                          name="petName"
                          component="div"
                        />
                      </div>
                      <div>
                        <label>Breed Name: </label>
                        <Field
                          className="input input-bordered"
                          name="breedName"
                        />
                        <ErrorMessage
                          id="formStyle"
                          name="petName"
                          component="div"
                        />
                      </div>

                      <div>
                        <label>Pet Age: </label>
                        <Field
                          className="input input-bordered"
                          name="petAge"
                          type="number"
                        />
                        <ErrorMessage
                          id="formStyle"
                          name="petAge"
                          component="div"
                        />
                      </div>

                      <div>
                        <label>Pet Location: </label>
                        <Field
                          className="input input-bordered"
                          name="petLocation"
                        />
                        <ErrorMessage
                          id="formStyle"
                          name="petLocation"
                          component="div"
                        />
                      </div>
                      <div>
                        <label>Pet Image: </label>
                        <input
                          type="file"
                          onChange={(event) => {
                            handleImageUpload(event.currentTarget.files[0]);
                          }}
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
                      <div className="flex items-center gap-2">
                        <label>Pet Category: </label>
                        <Select
                          defaultValue={pet?.category}
                          options={petCategories}
                          name="petCategory"
                          className="max-w-36"
                          onChange={(option) =>
                            setFieldValue("petCategory", option)
                          }
                        />
                        <ErrorMessage
                          id="formStyle"
                          name="petCategory"
                          component="div"
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold">Current Image</h3>
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

        <table className="min-w-full border-collapse table-auto border border-gray-300 shadow-md rounded-md">
          <thead className="bg-gray-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-700"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-gray-50 transition-colors duration-200"
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="border border-gray-300 px-4 py-2 text-gray-600"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="h-4" />
      </div>
    </div>
  );
};

export default MyAddedPet;
