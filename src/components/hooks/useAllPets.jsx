import { useQuery } from "@tanstack/react-query";
import PropTypes from "prop-types"; // ES6
import useAxiosSecure from "./useAxiosSecure";
import useAxiosPublic from "./useAxiosPublic";

const useAllPets = (id) => {
  const axiosSecure = useAxiosSecure();
  const axiosPublic = useAxiosPublic();
  const {
    isPending,
    loading,
    refetch,
    data = [],
  } = useQuery({
    queryKey: ["pets"],
    queryFn: async () => {
      if (id) {
        const res = await axiosSecure.get(`/pets/${id}`);
        return res.data;
      } else {
        const res = await axiosPublic.get("pets");
        return res.data;
      }
    },
  });
  return { isPending, loading, refetch, data };
};
useAllPets.proptypes = {
  id: PropTypes.string,
};
export default useAllPets;
