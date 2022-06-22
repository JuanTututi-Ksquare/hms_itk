import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { clearAppointments } from "../appointments/AppointmentsSlice";
import { logOut, selectLogin, selectLoginStatus } from "../login/LoginSlice";
import styles from "./DeleteAccount.module.css";

type Props = {
  title: string;
};

function DeleteAccount({ title }: Props) {
  const isLoggedIn = useAppSelector(selectLoginStatus);
  const token = useAppSelector(selectLogin).token;
  const dispatch = useDispatch();

  useEffect(() => {
    document.title = title;
  }, [title]);

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  const deleteAccount = () => {
    fetch("http://localhost:3001/auth/disable", {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
        
        dispatch(clearAppointments());
        dispatch(logOut());
    }).catch((error) => {
        console.log(error);
    })
  };

  return (
    <div className={styles["delete-form"]}>
      <h2>Warning</h2>
      <h4>Are you sure you want to delete your account?</h4>
      <button onClick={deleteAccount}>Delete Account</button>
    </div>
  );
}

export default DeleteAccount;
