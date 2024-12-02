import { Outlet } from "react-router-dom";
import Navber from "./Navber";
import { AuthContext } from "../providers/AuthProvider";
import { useContext } from "react";
import Footer from "./Home/Footer";


const Root = () => {
    const { darkTheme } = useContext(AuthContext);

    return (
        <div className="font-montserrat" data-theme={darkTheme ? "dark" : "light"}>
            <Navber></Navber>
            <div className="container p-2 mx-auto">
                <Outlet></Outlet>
            </div>
            <Footer></Footer>

        </div>
    );
};

export default Root;