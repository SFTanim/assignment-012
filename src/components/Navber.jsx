import { Link, NavLink, useNavigate } from "react-router-dom";
import "../../src/App.css";
import { AuthContext } from "../providers/AuthProvider";
import { useContext } from "react";
import { CgProfile } from "react-icons/cg";

const Navber = () => {
  const { user, userLogout, setDarkTheme, darkTheme } = useContext(AuthContext);
  const navigate = useNavigate();

  const navLinks = (
    <>
      <li id="navBarLink">
        <NavLink to="/">Home</NavLink>
      </li>
      <li id="navBarLink">
        <NavLink to="/petListing">Pet Listing</NavLink>
      </li>
      <li id="navBarLink">
        <NavLink to="/blogs">Donation Campaigns</NavLink>
      </li>
    </>
  );

  const handleLogout = () => {
    userLogout().then(() => {
      navigate("/");
    });
  };

  return (
    <div>
      <div className="navbar bg-base-100 justify-between w-full">
        <div className="navbar-start w-fit">
          <Link
            to="/"
            className="bg-transparent hover:bg-slate-200 pr-4 rounded-2xl text-xl max-h-fit flex items-center"
          >
            <div className="">
              <img
                className="h-20"
                src="https://i.ibb.co.com/d773vFR/pet3-removebg-preview.png"
                alt=""
              />
            </div>
            <h2 className="font-semibold">CozyPaws</h2>
          </Link>
        </div>

        <div className="flex lg:hidden">
          <div className="dropdown dropdown-end mx-2">
            <div tabIndex={0} role="button" className="btn m-1">
              {user?.photoURL ? (
                <img className="h-9 rounded-full" src={user?.photoURL} alt="" />
              ) : (
                <CgProfile />
              )}
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
            >
              <li>
                <Link to={"/dashboard/addAPet"} className="border flex">
                  <h2 className="w-full text-center">Dashboard</h2>
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="commonly-used-button-red"
                >
                  <h2 className="w-full text-center">Logout</h2>
                </button>
              </li>
            </ul>
          </div>

          <div className=" dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>

            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 space-y-2 shadow bg-base-100 rounded-box w-52"
            >
              {navLinks}

              {user ? (
                <button onClick={handleLogout} className="commonly-used-button">
                  Logout
                </button>
              ) : (
                <Link to="/login" className="commonly-used-button2">
                  Login
                </Link>
              )}
              <label className="cursor-pointer grid place-items-center">
                <input
                  defaultChecked={darkTheme}
                  onClick={() => setDarkTheme(!darkTheme)}
                  type="checkbox"
                  value="synthwave"
                  className="toggle theme-controller bg-base-content row-start-1 col-start-1 col-span-2"
                />
                <h2 className="">Light</h2>
                <h2 className="">Dark</h2>
              </label>
            </ul>
          </div>
        </div>
        <div className=" hidden lg:flex">
          <ul className="menu flex flex-row flex-nowrap pr-4" >{navLinks}</ul>
          {user ? (
            <div className="dropdown dropdown-end mx-2 tooltip tooltip-bottom" data-tip={user?.displayName}>
              <div tabIndex={0} role="button" className="btn m-1">
                {user?.photoURL ? (
                  <img
                    className="h-9 rounded-full"
                    src={user?.photoURL}
                    alt=""
                  />
                ) : (
                  <CgProfile />
                )}
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
              >
                <li>
                  <Link to={"/dashboard/addAPet"} className="border flex">
                    <h2 className="w-full text-center">Dashboard</h2>
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="commonly-used-button-red"
                  >
                    <h2 className="w-full text-center">Logout</h2>
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <Link to="/login" className="commonly-used-button">
              Login
            </Link>
          )}
          <label className="cursor-pointer grid place-items-center">
            <input
              defaultChecked={darkTheme}
              onClick={() => setDarkTheme(!darkTheme)}
              type="checkbox"
              value="synthwave"
              className="toggle theme-controller bg-base-content row-start-1 col-start-1 col-span-2"
            />
            <svg
              className="col-start-1 row-start-1 stroke-base-100 fill-base-100"
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="5" />
              <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
            </svg>

            <svg
              className="col-start-2 row-start-1 stroke-base-100 fill-base-100"
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          </label>
        </div>
      </div>
    </div>
  );
};

export default Navber;
