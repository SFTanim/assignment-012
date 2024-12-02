import axios from "axios";
import useAuth from "./useAuth";
import { useNavigate } from "react-router-dom";

const axiosSecure = axios.create({
  baseURL: "http://localhost:5000",
});

const useAxiosSecure = () => {
  const { userLogout } = useAuth();
  const navigate = useNavigate();

  // REQUEST
  axiosSecure.interceptors.request.use(
    function (config) {
      const token = localStorage.getItem("access_token");
      config.headers.authorization = `Bearar ${token}`;
      return config;
    },
    function (error) {
      return Promise.reject(error);
    }
  );

  // RESPONSE
  axiosSecure.interceptors.response.use(
    function (response) {
      return response;
    },
    async (error) => {
      const status = error?.response?.status;
      if (status === 401 || status === 403) {
        await userLogout();
        navigate("/login");
      }
      return Promise.reject(error);
    }
  );
  return axiosSecure;
};

export default useAxiosSecure;
