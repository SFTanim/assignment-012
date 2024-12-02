import { useQuery } from "@tanstack/react-query";
import PageTitle from "../../components/Shared/PageTitle";
import useAxiosPublic from "../../components/hooks/useAxiosPublic";
import { Link } from "react-router-dom";
import { MdOutlinePets } from "react-icons/md";
import { GrMoney } from "react-icons/gr";
import { FaRegCreditCard } from "react-icons/fa6";
import InfiniteScroll from 'react-infinite-scroll-component';
import { useState } from "react";

const DonationCampaign = () => {
  const axiosPublic = useAxiosPublic();
  const [visibleDonations, setVisibleDonations] = useState(10); // Number of items to display initially

  // Fetching user inserted data
  const {
    isLoading,
    error,
    data: allDonation,
  } = useQuery({
    queryKey: ["pets"],
    queryFn: async () => {
      const res = await axiosPublic.get(`/donationsBySorting`);
      return res.data;
    },
  });

  const allDonationArray = Array.isArray(allDonation) ? allDonation : [];

  // Fetch more data when scrolling down (this loads more from the already fetched data)
  const fetchMoreData = () => {
    setVisibleDonations((prevVisible) => prevVisible + 10); // Show 10 more items on each scroll
  };

  if (isLoading)
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
    <div id="donationCampaign">
      <PageTitle
        heading={"Donation Campaign"}
        subHeading={
          "Join our mission to support animals in need. Every donation makes a meaningful difference!"
        }
      ></PageTitle>

      <InfiniteScroll
        dataLength={visibleDonations} // This is important field to render the next set of data
        next={fetchMoreData} // Load more data when scrolling
        hasMore={visibleDonations < allDonationArray.length} // Whether there's more data to load
        loader={<h4>Loading more donations...</h4>}
        endMessage={
          <p style={{ textAlign: "center", marginTop: "100px" }}>
            <b>You have seen it all. Thank you.</b>
          </p>
        }
      >
        <div className="grid grid-cols-1 mg:grid-cols-2 lg:grid-cols-3 gap-10 px-3 md:px-0 lg:px-0">
        {allDonationArray?.slice(0, visibleDonations)?.map((donation, idx) => (
          <div key={idx} className="card bg-base-100 shadow-xl">
            <div className="card bg-base-100 shadow-xl" key={donation?._id}>
              <figure>
                <div className="w-full relative">
                  <img className="h-60 w-full" src={donation?.image} alt="Shoes" />
                </div>
              </figure>
              <div className="card-body">
                <div className="card-title flex justify-center mb-2">
                  <MdOutlinePets className="text-3xl" />
                  <h2 className="text-3xl"> {donation?.name}</h2>
                </div>
                <div className="flex justify-center space-x-1">
                  <GrMoney className="text-2xl" />
                  <span className="">Maximum Donation:</span>
                  <h2 className="font-bold">{donation?.maxDonation} $</h2>
                </div>
                <div className="flex justify-center space-x-1 mb-5">
                  <FaRegCreditCard className="text-2xl" />
                  <span className="">Total Donated Amount:</span>
                  <h2 className="font-bold">{donation?.donatedMoney} $</h2>
                </div>
                <Link
                  to={`/blog/${donation?._id}`}
                  className="absolute font-bold card-used-button left-0 bottom-0 w-full text-center"
                >
                  View More
                </Link>
              </div>
            </div>
          </div>
        ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default DonationCampaign;
