import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "./../../components/hooks/useAuth";
import auth from "../../firebase/firebase.config";
import { updateProfile } from "firebase/auth";
import useAxiosPublic from "../../components/hooks/useAxiosPublic";
import Swal from "sweetalert2";

const Register = () => {
  const { newUserRegistration, warningToast } = useAuth();
  const { register, handleSubmit } = useForm();
  const axiosPublic = useAxiosPublic();
  const location = useLocation();
  const navigate = useNavigate();

  const onSubmit = (data) => {
    const name = data?.fullName;
    const email = data?.email;
    const password = data?.password;
    const photoUrl = data?.photoURL;
    const upperCaseCheck = /(?=.*[A-Z])/;
    const lowerCaseCheck = /(?=.*[a-z])/;

    if (!name) {
      return warningToast("Enter your Name");
    } else if (!email) {
      return warningToast("Enter your Email");
    } else if (!password) {
      return warningToast("Enter your Password");
    } else if (!lowerCaseCheck.test(password)) {
      return warningToast("Must have an Lowercase letter in the password");
    } else if (!upperCaseCheck.test(password)) {
      return warningToast("Must have an Uppercase letter in the password");
    } else if (password.length < 6) {
      return warningToast("You Must have at least 6 letters in your password");
    } else if (!photoUrl) {
      return warningToast("Enter your PhotoUrl Correctly");
    }

    const userInfo = {
      name: data?.fullName,
      email: data?.email,
      photo: data?.photoURL,
      role: "user",
    };
    axiosPublic.post("/users", userInfo).then((res) => {
      if (res.data.insertedId) {
        newUserRegistration(data?.email, data?.password).then(() => {
          updateProfile(auth?.currentUser, {
            displayName: data?.fullName,
            photoURL: data?.photoURL,
          });
        });
        navigate(location?.state ? location?.state : "/");
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Welcome",
          showConfirmButton: false,
          timer: 2500,
        });
      } else {
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: res.data.message,
          showConfirmButton: false,
          timer: 2500,
        });
      }
    });
  };

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4 lg:gap-0 min-h-screen text-black">
      <div className="flex-1">
        <img
          className="h-4/5 rounded-3xl mx-auto"
          src="https://i.ibb.co.com/Vj4TRw6/regi.jpg"
          alt=""
        />
      </div>

      <div className="flex-1">
        <form
          className="h-full lg:h-4/5 border rounded-3xl flex flex-col justify-center p-4 bg-[#ffebcd]"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex justify-evenly flex-wrap mx-auto gap-5 lg:gap-2 p-5">
            <div className="">
              <label className="label">
                <span className="label-text text-black">Full Name</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                {...register("fullName")}
              />
            </div>

            <div className="">
              <label className="label">
                <span className="label-text text-black">Email</span>
              </label>
              <input
                type="email"
                className="input input-bordered"
                {...register("email", { required: true })}
              />
            </div>

            <div className="">
              <label className="label">
                <span className="label-text text-black">Password</span>
              </label>
              <input
                type="password"
                className="input input-bordered"
                {...register("password", { required: true })}
              />
            </div>

            <div className="">
              <label className="label">
                <span className="label-text text-black">PhotoURL</span>
              </label>
              <input
                type="url"
                className="input input-bordered"
                {...register("photoURL", { required: true })}
              />
            </div>
          </div>

          <div className="w-1/2 mx-auto mt-2">
            <input
              className="btn w-full border border-gray-400 bg-slate-50"
              type="submit"
            />
          </div>
          <h2 className="mx-auto mt-3">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600">
              Login Now
            </Link>
          </h2>
        </form>
      </div>
    </div>
  );
};

export default Register;
