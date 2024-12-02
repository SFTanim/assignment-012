import { createBrowserRouter } from "react-router-dom";
import Root from "../components/Root";
import Home from "../Pages/Home/Home";
import Login from "../Pages/LoginOrRegi/Login";
import Register from "../Pages/LoginOrRegi/Register";
import PetListing from "../Pages/PetListing/PetListing";
import PetDetails from "../components/Shared/PetDetails";
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "../layout/Dashboard/Dashboard";
import AddAPet from "./../layout/User/AddAPet";
import MyAddedPet from "./../layout/User/MyAddedPet";
import CreateDonationCampaign from "./../layout/User/CreateDonationCampaign";
import MyDonationCampaigns from "./../layout/User/MyDonationCampaigns";
import AdoptionRequest from "./../layout/User/AdoptionRequest";
import MyDonations from "./../layout/User/MyDonations";
import AllPets from "./../layout/Admin/AllPets";
import AllUsers from "./../layout/Admin/AllUsers";
import AllDonations from "./../layout/Admin/AllDonations";
import DonationCampaign from "../Pages/DonationCampaign/DonationCampaign";
import DonationDetails from "../Pages/DonationCampaign/DonationDetails";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root></Root>,
    children: [
      {
        path: "/",
        element: <Home></Home>,
      },
      {
        path: "/login",
        element: <Login></Login>,
      },
      {
        path: "/register",
        element: <Register></Register>,
      },
      {
        path: "/petListing",
        element: <PetListing></PetListing>,
      },
      {
        path: "/petDetails/:id",
        element: (
          <ProtectedRoute>
            <PetDetails></PetDetails>
          </ProtectedRoute>
        ),
      },
      {
        path: "/blogs",
        element: <DonationCampaign></DonationCampaign>,
      },
      {
        path: "/blog/:id",
        element: (
          <ProtectedRoute>
            <DonationDetails></DonationDetails>
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/dashboard",
    element: <Dashboard></Dashboard>,
    children: [
      //-------------------For Admin:
      {
        path: "/dashboard/allUsers",
        element: <AllUsers></AllUsers>,
      },
      {
        path: "/dashboard/allPets",
        element: <AllPets></AllPets>,
      },
      {
        path: "/dashboard/allDonations",
        element: <AllDonations></AllDonations>,
      },

      //------------------For Users:
      {
        path: "/dashboard/addAPet",
        element: (
          <ProtectedRoute>
            <AddAPet></AddAPet>
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/myAddedPet",
        element: (
          <ProtectedRoute>
            <MyAddedPet></MyAddedPet>
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/createDonation",
        element: (
          <ProtectedRoute>
            <CreateDonationCampaign></CreateDonationCampaign>
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/myDonationCam",
        element: (
          <ProtectedRoute>
            <MyDonationCampaigns></MyDonationCampaigns>
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/myDonation",
        element: (
          <ProtectedRoute>
            <MyDonations></MyDonations>
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/adoptionReq",
        element: (
          <ProtectedRoute>
            <AdoptionRequest></AdoptionRequest>
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default router;
