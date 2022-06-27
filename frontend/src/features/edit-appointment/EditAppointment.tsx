import React, { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import Modal from "../../common/components/modal/Modal";
import { selectLogin, selectLoginStatus } from "../login/LoginSlice";
import styles from "./EditAppointment.module.css";
import EditAppointmentForm from "./EditAppointmentForm";

type Props = {
  title: string;
};

function EditAppointment({ title }: Props) {
  const { id } = useParams();
  const isLoggedIn = useAppSelector(selectLoginStatus);
  const role = useAppSelector(selectLogin).role;
  const [success, setSucess] = useState(false);
  const [dateSuccess, setDateSuccess] = useState("");

  const dateChangeSuccess = (date: string) => {
    setSucess(true);
    setDateSuccess(date);
  };

  useEffect(() => {
    document.title = title;
  });

  if (!isLoggedIn && role !== "doctor") {
    <Navigate to={"/login"} />;
  }

  return (
    <div className={styles["edit-appointment"]}>
      {success && (
        <Modal
          type="success"
          title="Date changed successfully!"
          message={`${dateSuccess} is the new date for the appointment`}
          redirect="/appointments"
        />
      )}
      <h2>Choose a new date</h2>
      <EditAppointmentForm appointmentId={id!} onSuccess={dateChangeSuccess}/>
    </div>
  );
}

export default EditAppointment;
