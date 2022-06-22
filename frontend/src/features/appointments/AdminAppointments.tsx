import moment from "moment";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectLogin } from "../login/LoginSlice";
import {
  getAppointments,
  getAppointmentsByDoctor,
  getAppointmentsByPatient,
  getAppointmentsByStatus,
  getAppointmentsOrderDoctor,
  getAppointmentsOrderPatient,
  selectAppointments,
  selectStatus,
} from "./AppointmentsSlice";
import styles from "./Appointments.module.css";

function AdminAppointments() {
  const dispatch = useAppDispatch();
  const reqStatus = useAppSelector(selectStatus);
  const token = useAppSelector(selectLogin).token;
  const role = useAppSelector(selectLogin).role;

  const [searchByDoctor, setSearchByDoctor] = useState("");
  const [searchByPatient, setSearchByPatient] = useState("");

  useEffect(() => {
    if (reqStatus === "idle") {
      dispatch(getAppointments({ token, role }));
    }
  }, [reqStatus, dispatch, token, role]);

  const appointments = useAppSelector(selectAppointments);

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

  const orderByPatient = (event: any) => {
    const order = event.target.value;
    dispatch(getAppointmentsOrderPatient({ role, token, order }));
  };

  const orderByDoctor = (event: any) => {
    const order = event.target.value;
    dispatch(getAppointmentsOrderDoctor({ role, token, order }));
  };

  const filterStatus = (event: any) => {
    const status = event.target.value;
    if (status === "none") {
      dispatch(getAppointments({ token, role }));
    } else {
      dispatch(getAppointmentsByStatus({ role, token, status }));
    }
  };

  const filterDoctor = () => {
    if (searchByDoctor) {
      const id = searchByDoctor;
      setSearchByDoctor("");
      dispatch(getAppointmentsByDoctor({ role, token, id }));
    } else {
      dispatch(getAppointments({ token, role }));
    }
  };

  const filterPatient = () => {
    if (searchByPatient) {
      const id = searchByPatient;
      setSearchByPatient("");
      dispatch(getAppointmentsByPatient({ role, token, id }));
    } else {
      dispatch(getAppointments({ token, role }));
    }
  };

  return (
    <>
      <div className={styles["filters"]}>
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
        <div>
          <label htmlFor="select-doctor">Order by Doctor</label>
          <select
            defaultValue={"DEFAULT"}
            name="doctor"
            id="select-doctor"
            onChange={orderByDoctor}
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
        <div>
          <label htmlFor="select-status">Status</label>
          <select
            defaultValue={"DEFAULT"}
            name="status"
            id="select-status"
            onChange={filterStatus}
          >
            <option value="DEFAULT" disabled>
              Select status
            </option>
            <option value="none">Default</option>
            <option value="true">Pending or Completed</option>
            <option value="false">Cancelled</option>
          </select>
        </div>
        <div className={styles["search"]}>
          <label htmlFor="search-doctor">Search by Doctor ID</label>
          <input
            type="number"
            name="search-doctor"
            id="search-doctor"
            onChange={(event: any) => {
              setSearchByDoctor(event.target.value);
            }}
            value={searchByDoctor}
          />
          <button onClick={filterDoctor}>Search</button>
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

export default AdminAppointments;
