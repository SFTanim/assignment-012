import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../components/hooks/useAuth";
import Swal from "sweetalert2";
import useAxiosPublic from "../../components/hooks/useAxiosPublic";
import { FcGoogle } from "react-icons/fc";
import { FaSquareGithub } from "react-icons/fa6";

const Login = () => {
  const {
    userLogin,
    warningToast,
    loginWithGoogle,
    successToast,
    loginWithGithub,
  } = useAuth();
  const { register, handleSubmit } = useForm();
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();
  const location = useLocation();

  const onSubmit = (data) => {
    axiosPublic.get(`/users/${data?.email}`).then((res) => {
      if (res?.data?.ban) {
        return Swal.fire({
          position: "top-end",
          icon: "error",
          title: "You are banned",
          showConfirmButton: false,
          timer: 2500,
        });
      } else {
        userLogin(data?.email, data?.password)
          .then(() => {
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Welcome",
              showConfirmButton: false,
              timer: 2500,
            });
            navigate(location?.state ? location?.state : "/");
          })
          .catch((error) => {
            if (error?.code == "auth/invalid-email") {
              warningToast("Please provide a valid email");
            }
            if (error?.code == "auth/invalid-credential") {
              warningToast("Please provide a valid Password");
            }
          });
      }
    });
  };

  // Google Login
  const handleGoogleLogin = () => {
    loginWithGoogle()
      .then((res) => {
        const userInfo = {
          name: res?.user?.displayName,
          email: res?.user?.email,
          photo: res?.user?.photoURL,
          role: "user"
        };
        axiosPublic.post("/users", userInfo);

        successToast("Successfull Google login");
        {
          navigate(location?.state ? location.state : "/");
        }
      })
      .catch(() => {
        warningToast("Unsuccessful Google login");
      });
  };

  // GitHub Login
  const handleGitHubLogin = () => {
    loginWithGithub()
      .then((res) => {
        const userInfo = {
          name: res?.user?.displayName,
          email: res?.user?.email,
          photo: res?.user?.photoURL,
          role: "user"
        };
        axiosPublic.post("/users", userInfo);
        successToast("Successfull Google login");
        {
          navigate(location?.state ? location.state : "/");
        }
      })
      .catch(() => {
        warningToast("Unsuccessful Google login");
      });
  };

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4 lg:gap-0 min-h-screen">
      <div className="flex-1">
        <img
          className="h-4/5 rounded-3xl mx-auto"
          src="https://i.ibb.co.com/fqmZ7CH/Leonardo-Phoenix-A-whimsical-digital-illustration-featuring-a-0-removebg-preview.png"
          alt=""
        />
      </div>

      <div className="flex-1">
        <form
          className="h-full lg:h-4/5 flex flex-col justify-center p-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex flex-col w-full items-center gap-2 p-5">
            <div className="w-full flex flex-col items-center">
              <label className="label">
                <span className="label-text text-xl font-bold">Email</span>
              </label>
              <input
                type="email"
                placeholder="Your Email"
                className="input input-bordered w-3/4"
                {...register("email", { required: true })}
              />
            </div>

            <div className="w-full flex flex-col items-center">
              <label className="label">
                <span className="label-text text-xl font-bold">Password</span>
              </label>
              <input
                type="password"
                placeholder="Your Password"
                className="input input-bordered w-3/4"
                {...register("password", { required: true })}
              />
            </div>
          </div>

          <div className="w-1/2 mx-auto mt-2">
            <input
              className="btn w-full border border-gray-400"
              type="submit"
            />
          </div>
          <h2 className="mx-auto mt-3">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="text-blue-600">
              Register Now
            </Link>
          </h2>
          <div className=" text-center w-fit rounded-xl mt-4 p-5 mx-auto">
            <h3 className="font-bold mb-2">Login With</h3>
            <div className="text-5xl flex gap-5 mx-auto w-fit">
              <button onClick={handleGoogleLogin}>
                <FcGoogle />
              </button>
              <button onClick={handleGitHubLogin}>
                <FaSquareGithub />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
