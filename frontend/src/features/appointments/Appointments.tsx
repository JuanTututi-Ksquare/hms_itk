import React from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { selectLogin, selectLoginStatus } from "../login/LoginSlice";
import styles from "./Appointments.module.css";
import AdminAppointments from "./AdminAppointments";
import PatientAppointments from "./PatientAppointments";
import DoctorAppointments from "./DoctorAppointments";

export default function Appointments() {
  const isLoggedIn = useAppSelector(selectLoginStatus);
  const userInfo = useAppSelector(selectLogin);
  const role = userInfo.role;

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
