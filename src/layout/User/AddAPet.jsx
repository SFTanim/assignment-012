import PageTitle from "../../components/Shared/PageTitle";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Select from "react-select";
import { useState } from "react";
import Swal from "sweetalert2";
import useAuth from "../../components/hooks/useAuth";
import useAxiosSecure from "../../components/hooks/useAxiosSecure";

const petCategories = [
  { value: "dog", label: "Dog" },
  { value: "cat", label: "Cat" },
  { value: "rabbit", label: "Rabbit" },
  { value: "bird", label: "Bird" },
  { value: "other", label: "Other" },
];

const imageHostingKey = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const imageHostingAPI = `https://api.imgbb.com/1/upload?key=${imageHostingKey}`;

const AddAPet = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [imageUrl, setImageUrl] = useState(null);
  const timeAndDate = new Date();
  // const date =
  //   timeAndDate.getDate() +
  //   "-" +
  //   timeAndDate.getMonth() +
  //   "-" +
  //   timeAndDate.getFullYear();

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
    petName: "",
    breedName: "",
    petAge: "",
    petCategory: null,
    petLocation: "",
    shortDescription: "",
    longDescription: "",
  };

  const handleSubmit = (values, { resetForm }) => {
    if (imageUrl) {
      const petInfo = {
        name: values?.petName,
        breed: values?.breedName,
        image: imageUrl,
        shortDescription: values?.shortDescription,
        age: values?.petAge,
        category: values?.petCategory?.value,
        location: values?.petLocation,
        longDescription: values?.longDescription,
        adopt: false,
        date: timeAndDate,
        user: user?.email,
      };

      axiosSecure.post("/pets", petInfo).then((res) => {
        if (res?.data?.insertedId) {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Your work has been saved",
            showConfirmButton: false,
            timer: 2000,
          });
          resetForm();
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
          });
        }
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please insert a photo of your pet!",
      });
    }
  };

  return (
    <div className="min-h-screen">
      <PageTitle heading={"Add A pet"}></PageTitle>

      <div className="p-0 lg:p-10 text-xl">
        <Formik
          initialValues={initialValues}
          validate={validate}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue }) => (
            <Form className="flex flex-col text-base lg:text-xl">
              <div className="space-y-2 border-0 lg:border w-fit mx-auto p-4 rounded-xl">
                <div>
                  <label>Pet Name: </label>
                  <Field className="input input-bordered" name="petName" />
                  <ErrorMessage id="formStyle" name="petName" component="div" />
                </div>
                <div>
                  <label>Breed Name: </label>
                  <Field className="input input-bordered" name="breedName" />
                  <ErrorMessage id="formStyle" name="petName" component="div" />
                </div>

                <div>
                  <label>Pet Age: </label>
                  <Field
                    className="input input-bordered"
                    name="petAge"
                    type="number"
                  />
                  <ErrorMessage id="formStyle" name="petAge" component="div" />
                </div>

                <div className="flex items-center gap-2">
                  <label>Pet Category: </label>
                  <Select
                    options={petCategories}
                    name="petCategory"
                    className="max-w-36"
                    onChange={(option) => setFieldValue("petCategory", option)}
                  />
                  <ErrorMessage
                    id="formStyle"
                    name="petCategory"
                    component="div"
                  />
                </div>

                <div>
                  <label>Pet Location: </label>
                  <Field className="input input-bordered" name="petLocation" />
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
    </div>
  );
};

export default AddAPet;
