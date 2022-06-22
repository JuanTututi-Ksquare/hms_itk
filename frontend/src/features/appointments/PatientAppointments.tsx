import moment from "moment";
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectLogin } from "../login/LoginSlice";
import {
  clearAppointments,
  getAppointments,
  selectAppointments,
  selectStatus,
} from "./AppointmentsSlice";
import styles from "./Appointments.module.css";

function PatientAppointments() {
  const dispatch = useAppDispatch();
  const reqStatus = useAppSelector(selectStatus);
  const token = useAppSelector(selectLogin).token;
  const role = useAppSelector(selectLogin).role;

  useEffect(() => {
    if (reqStatus === "idle") {
      dispatch(getAppointments({ role, token }));
    }
  });

  const appointments = useAppSelector(selectAppointments);

  const deleteAppointment = (event: any) => {
    const id = event.target.value;
    fetch("http://localhost:3001/patient/appointments/" + id, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      response.json().then((data) => {
        dispatch(clearAppointments());
      });
    });
  };

  const appointmentsList = appointments.map((appointment) => {
    const date = moment(appointment.date).format("LLLL");
    let appointmentStatus = appointment.status ? "Pending" : "Cancelled";
    const today = new Date();
    const appointmentDate = new Date(appointment.date);
    if (appointmentDate < today) {
      appointmentStatus = "Completed";
    }
    return (
      <div key={appointment.id} className={styles["appointment"]}>
        <div>
          <p>Doctor</p>
          <h4>{appointment.doctorName}</h4>
        </div>
        <div>
          <p>Date</p>
          <h4>{date}</h4>
        </div>
        {appointmentStatus === "Pending" && (
          <div className={styles["status"]}>
            <img src="/images/pending.png" alt="pending" />
            <h4>Pending</h4>
          </div>
        )}
        {appointmentStatus === "Cancelled" && (
          <div className={styles["status"]}>
            <img src="/images/cancelled.png" alt="cancelled" />
            <h4>Cancelled</h4>
          </div>
        )}
        {appointmentStatus === "Completed" && (
          <div className={styles["status"]}>
            <img src="/images/completed.png" alt="completed" />
            <h4>Completed</h4>
          </div>
        )}
        {!["Cancelled", "Completed"].includes(appointmentStatus) && (
          <div>
            <button
              value={appointment.id}
              className={styles["delete"]}
              onClick={deleteAppointment}
            >
              <img src="/images/delete.png" alt="delete" />
              <p>Cancel appointment</p>
            </button>
          </div>
        )}
      </div>
    );
  });

  return (
    <>
      {appointmentsList.length ? (
        appointmentsList
      ) : (
        <div className={styles["appointments-placeholder"]}>
          <h2>No results were found!</h2>
        </div>
      )}
    </>
  );
}

export default PatientAppointments;
