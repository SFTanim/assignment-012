// import { Link, NavLink, Outlet } from "react-router-dom";

import { Link, NavLink, Outlet } from "react-router-dom";
import useAdmin from "../../components/hooks/useAdmin";

const Dashboard = () => {
  const [isAdmin, isPending] = useAdmin();
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
  return (
    <div>
      <div className="drawer drawer-end lg:drawer-open">
        <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />

        <div className="drawer-content flex flex-col items-center justify-center">
          {/* Page content here */}
          <div className="w-full h-full">
            <div className="flex justify-between bg-base-100">
              <div className="flex-1">
                <Link
                  to="/"
                  className="bg-transparent hover:bg-slate-200 pr-4 w-fit rounded-2xl text-xl max-h-fit flex items-center"
                >
                  <div className="">
                    <img
                      className="h-16"
                      src="https://i.ibb.co.com/d773vFR/pet3-removebg-preview.png"
                      alt=""
                    />
                  </div>
                  <h2 className="font-semibold">CozyPaws</h2>
                </Link>
              </div>
              <div className="flex-none flex items-center">
                <label
                  htmlFor="my-drawer-4"
                  className="commonly-used-button3 drawer-button lg:hidden"
                >
                  Menu
                </label>
              </div>
            </div>
            <Outlet></Outlet>
          </div>
        </div>

        <div className="drawer-side p-0 lg:p-4 border-l-2 ">
          <label
            htmlFor="my-drawer-4"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <div className="bg-white">
            
          {/* Only Admins Dashboard */}
          <div className="">
            {isAdmin ? (
              <div className="">
                <h2 className="text-center my-2 text-[#adca29]">
                  Admins Dashboard
                </h2>
                <ul className="menu gap-1 mx-2 border-2 bg-white text-base-content rounded-xl w-80 p-4">
                  <li id="navBarLink2">
                    <NavLink to={"/dashboard/allUsers"}>
                      {" "}
                      <h2 className="capitalize">All Users</h2>
                    </NavLink>
                  </li>
                  <li id="navBarLink2">
                    <NavLink to={"/dashboard/allPets"}>
                      {" "}
                      <h2 className="capitalize"> All Pets</h2>
                    </NavLink>
                  </li>
                  <li id="navBarLink2">
                    <NavLink to={"/dashboard/allDonations"}>
                      {" "}
                      <h2 className="capitalize"> all donations</h2>
                    </NavLink>
                  </li>
                </ul>
              </div>
            ) : (
              <div className=""></div>
            )}
          </div>

          {/* Users and Admins Common Dashboard */}
          <div className="">
            <h2 className="text-center my-2 text-[#adca29]">
              Your User Dashboard
            </h2>

            <ul className="menu gap-1 mx-2 border-2 bg-white text-base-content rounded-xl w-80 p-4">
              <li id="navBarLink2">
                <NavLink to={"/dashboard/addAPet"}>
                  {" "}
                  <h2 className="capitalize"> Add A Pet</h2>
                </NavLink>
              </li>
              <li id="navBarLink2">
                <NavLink to={"/dashboard/myAddedPet"}>
                  {" "}
                  <h2 className="capitalize"> My Added Pet</h2>
                </NavLink>
              </li>
              <li id="navBarLink2">
                <NavLink to={"/dashboard/adoptionReq"}>
                  {" "}
                  <h2 className="capitalize"> adoption request</h2>
                </NavLink>
              </li>
              <li id="navBarLink2">
                <NavLink to={"/dashboard/createDonation"}>
                  {" "}
                  <h2 className="capitalize"> create donation campaign</h2>
                </NavLink>
              </li>
              <li id="navBarLink2">
                <NavLink to={"/dashboard/myDonationCam"}>
                  {" "}
                  <h2 className="capitalize"> My Donation campaign</h2>
                </NavLink>
              </li>
              <li id="navBarLink2">
                <NavLink to={"/dashboard/myDonation"}>
                  {" "}
                  <h2 className="capitalize"> My donation</h2>
                </NavLink>
              </li>
            </ul>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
