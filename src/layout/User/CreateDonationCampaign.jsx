import { useState } from "react";
import PageTitle from "../../components/Shared/PageTitle";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Swal from "sweetalert2";
import useAuth from "../../components/hooks/useAuth";
import useAxiosSecure from "../../components/hooks/useAxiosSecure";

const imageHostingKey = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const imageHostingApi = `https://api.imgbb.com/1/upload?key=${imageHostingKey}`;

const CreateDonationCampaign = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [imageUrl, setImageUrl] = useState(null);

  const todaysDate = new Date();
  const date =
    todaysDate.getFullYear() +
    "-" +
    todaysDate.getMonth() +
    "-" +
    todaysDate.getDate();

  const handleImbbImageUpload = async (file) => {
    const imageFile = { image: file };
    const res = await axiosSecure.post(imageHostingApi, imageFile, {
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

  const initialValues = {
    petName: "",
    shortDescription: "",
    longDescription: "",
    lastDate: "",
  };

  const handleSubmit = (values, { resetForm }) => {
    if (imageUrl) {
      const donationInfo = {
        name: values?.petName,
        image: imageUrl,
        shortDescription: values?.shortDescription,
        longDescription: values?.longDescription,
        maxDonation: values?.maxDonation,
        lastDate: values?.lastDate,
        creationDate: date,
        user: user?.email,
        donatedMoney: 0,
        canDonate: true,
      };
      axiosSecure.post("/donations", donationInfo).then((res) => {
        if (res?.data?.insertedId) {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Your work has been saved",
            showConfirmButton: false,
            timer: 2000,
          });
          resetForm();
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
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please insert a photo of your pet!",
      });
    }
  };

  return (
    <div>
      <PageTitle heading={"Create Donation Campaign"}></PageTitle>

      <div className="p-0 lg:p-10 text-xl">
        <Formik
          initialValues={initialValues}
          validate={validate}
          onSubmit={handleSubmit}
        >
          <Form className="flex flex-col text-base lg:text-xl">
            <div className="space-y-2 border-0 lg:border w-fit mx-auto p-4 rounded-xl">
              <div>
                <label>Pet Name: </label>
                <Field className="input input-bordered" name="petName" />
                <ErrorMessage id="formStyle" name="petName" component="div" />
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

            <button
              className="commonly-used-button3 w-fit mx-auto mt-5"
              type="submit"
            >
              Submit
            </button>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default CreateDonationCampaign;
