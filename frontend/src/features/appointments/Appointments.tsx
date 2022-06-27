import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { selectLogin, selectLoginStatus } from "../login/LoginSlice";
import styles from "./Appointments.module.css";
import AdminAppointments from "./AdminAppointments";
import PatientAppointments from "./PatientAppointments";
import DoctorAppointments from "./DoctorAppointments";

type Props = {
  title: string;
};

export default function Appointments({ title }: Props) {
  const isLoggedIn = useAppSelector(selectLoginStatus);
  const userInfo = useAppSelector(selectLogin);
  const role = userInfo.role;
  
  useEffect(() => {
    document.title = title;
  }, [title]);

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return (
    <div className={styles["appointments"]}>
      {role === "super" && <AdminAppointments />}
      {role === "admin" && <AdminAppointments />}
      {role === "patient" && <PatientAppointments />}
      {role === "doctor" && <DoctorAppointments />}
    </div>
  );
}
