import {
  GithubAuthProvider,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import auth from "../firebase/firebase.config";
import useLocalStorage from "use-local-storage";
import useAxiosPublic from "../components/hooks/useAxiosPublic";
import Swal from "sweetalert2";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(false);
  const axiosPublic = useAxiosPublic();
  const [darkTheme, setDarkTheme] = useLocalStorage("darkTheme", false);
  const providerOfGoogle = new GoogleAuthProvider();
  const providerOfGitHub = new GithubAuthProvider();

  const warningToast = (text) => {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: text,
    });
  };

  const successToast = (text) => {
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: text,
      showConfirmButton: false,
      timer: 1500,
    });
  };

  const newUserRegistration = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const userLogin = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const userLogout = () => {
    setLoading(true);
    return signOut(auth);
  };

  const loginWithGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, providerOfGoogle);
  };

  const loginWithGithub = () => {
    setLoading(true);
    return signInWithPopup(auth, providerOfGitHub);
  };

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userInfo = { email: currentUser?.email };
        axiosPublic.post("/jwt", userInfo).then((res) => {
          if (res?.data?.token) {
            localStorage.setItem("access_token", res?.data?.token);
            setLoading(false);
          }
        });
      } else {
        localStorage.removeItem("access_token");
        setLoading(false);
      }
      setLoading(false);
    });

    return () => {
      unSubscribe();
    };
  }, [user, axiosPublic]);

  
  const allValue = {
    loginWithGithub,
    loginWithGoogle,
    userLogin,
    userLogout,
    warningToast,
    successToast,
    newUserRegistration,
    darkTheme,
    setDarkTheme,
    loading,
    user,
  };
  return (
    <AuthContext.Provider value={allValue}>{children}</AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.object,
};
export default AuthProvider;
