import moment from "moment";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectLogin } from "../login/LoginSlice";
import {
  getAppointments,
  getAppointmentsByPatient,
  getDoctorFilterDate,
  getDoctorOrderDate,
  getDoctorOrderPatient,
  selectAppointments,
  selectStatus,
} from "./AppointmentsSlice";
import styles from "./Appointments.module.css";

function DoctorAppointments() {
  const dispatch = useAppDispatch();
  const reqStatus = useAppSelector(selectStatus);
  const token = useAppSelector(selectLogin).token;
  const role = useAppSelector(selectLogin).role;

  const [searchByDate, setSearchByDate] = useState("");
  const [searchByPatient, setSearchByPatient] = useState("");

  useEffect(() => {
    if (reqStatus === "idle") {
      dispatch(getAppointments({ role, token }));
    }
  });

  const appointments = useAppSelector(selectAppointments);

  const orderByPatient = (event: any) => {
    const order = event.target.value;
    dispatch(getDoctorOrderPatient({token, order}))
  }

  const orderByDate = (event: any) => {
    const order = event.target.value;
    dispatch(getDoctorOrderDate({token, order}))
  }

  const filterDate = () => {
    if (searchByDate) {
      const date = searchByDate;
      dispatch(getDoctorFilterDate({ token, date }));
      setSearchByDate("");
    } else {
      dispatch(getAppointments({ token, role }));
    }
  };

  const filterPatient = () => {
    if (searchByPatient) {
      const id = searchByPatient;
      setSearchByPatient("");
      dispatch(getAppointmentsByPatient({role, token, id }));
    } else {
      dispatch(getAppointments({ token, role }));
    }
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
          <p>Patient</p>
          <h4>{appointment.patientName}</h4>
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
      </div>
    );
  });

  return (
    <>
      <div className={styles["filters"]}>
        <div>
          <label htmlFor="select-date">Order by Date</label>
          <select
            defaultValue={"DEFAULT"}
            name="date"
            id="select-date"
            onChange={orderByDate}
          >
            <option value="DEFAULT" disabled>
              Select order
            </option>
            <option value="ASC">ASC</option>
            <option value="DESC">DESC</option>
          </select>
        </div>
        <div>
          <label htmlFor="select-patient">Order by Patient</label>
          <select
            defaultValue={"DEFAULT"}
            name="patient"
            id="select-patient"
            onChange={orderByPatient}
          >
            <option value="DEFAULT" disabled>
              Select order
            </option>
            <option value="ASC">ASC</option>
            <option value="DESC">DESC</option>
          </select>
        </div>
      </div>
      <div className={styles["filter-values"]}>
        <div className={styles["search"]}>
          <label htmlFor="search-date">Search by Date</label>
          <input
            type="date"
            name="search-date"
            id="search-date"
            onChange={(event: any) => {
              setSearchByDate(event.target.value);
            }}
            value={searchByDate}
          />
          <button onClick={filterDate}>Search</button>
        </div>
        <div className={styles["search"]}>
          <label htmlFor="search-patient">Search by Patient ID</label>
          <input
            type="number"
            name="search-patient"
            id="search-patient"
            onChange={(event: any) => {
              setSearchByPatient(event.target.value);
            }}
            value={searchByPatient}
          />
          <button onClick={filterPatient}>Search</button>
        </div>
      </div>
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

export default DoctorAppointments;