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
import { useNavigate } from "react-router-dom";

function DoctorAppointments() {
  const dispatch = useAppDispatch();
  const reqStatus = useAppSelector(selectStatus);
  const token = useAppSelector(selectLogin).token;
  const role = useAppSelector(selectLogin).role;

  const [searchByDate, setSearchByDate] = useState("");
  const [searchByPatient, setSearchByPatient] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (reqStatus === "idle") {
      dispatch(getAppointments({ role, token }));
    }
  });

  const appointments = useAppSelector(selectAppointments).appointments;
  const count = useAppSelector(selectAppointments).count;
  const filters = useAppSelector(selectAppointments).filters;

  const pageSelectors = (count: number) => {
    const pages = Math.ceil(count / 5);
    const selectors = [];
    if (filters) {
      if (Object.keys(filters).includes("id_patient")) {
        for (let index = 1; index <= pages; index++) {
          selectors.push(
            <button
              key={index}
              value={index}
              onClick={() => {
                filterPatient(index);
              }}
            >
              {index}
            </button>
          );
        }
        return selectors;
      }

      if (Object.keys(filters).includes("date")) {
        for (let index = 1; index <= pages; index++) {
          selectors.push(
            <button
              key={index}
              value={index}
              onClick={() => {
                filterDate(index);
              }}
            >
              {index}
            </button>
          );
        }
        return selectors;
      }
      
      if (Object.keys(filters).includes("orderByDate")) {
        for (let index = 1; index <= pages; index++) {
          selectors.push(
            <button
              key={index}
              value={index}
              onClick={() => {
                if(filters.orderByDate)
                orderByDate(filters.orderByDate, index);
              }}
            >
              {index}
            </button>
          );
        }
        return selectors;
      }
      if (Object.keys(filters).includes("orderByPatient")) {
        for (let index = 1; index <= pages; index++) {
          selectors.push(
            <button
              key={index}
              value={index}
              onClick={() => {
                if(filters.orderByPatient)
                orderByPatient(filters.orderByPatient, index);
              }}
            >
              {index}
            </button>
          );
        }
        return selectors;
      }
    } else {
      if (pages < 1) {
        return <button></button>;
      }
      for (let index = 1; index <= pages; index++) {
        selectors.push(
          <button key={index} value={index} onClick={getAppointmentsPage}>
            {index}
          </button>
        );
      }
      return selectors;
    }
  };

  const getAppointmentsPage = (event: any) => {
    const page = event.target.value;
    dispatch(getAppointments({ role, token, page }));
  };

  const orderByPatient = (order: string, page?: number) => {
    if(page) {
      dispatch(getDoctorOrderPatient({ token, order, page }));
    } else {
      dispatch(getDoctorOrderPatient({ token, order }));
    }
  };

  const orderByDate = (order: string, page?: number) => {
    if(page) {
      dispatch(getDoctorOrderDate({ token, order, page }));
    } else {
      dispatch(getDoctorOrderDate({ token, order }));
    }
  };

  const filterDate = (page?: number) => {
    if (searchByDate) {
      const date = searchByDate;
      if (page) {
        dispatch(getDoctorFilterDate({ token, date, page }));
      } else {
        dispatch(getDoctorFilterDate({ token, date }));
      }
    } else {
      dispatch(getAppointments({ token, role }));
    }
  };

  const filterPatient = (page?: number) => {
    if (searchByPatient) {
      const id = searchByPatient;
      if (page) {
        dispatch(getAppointmentsByPatient({ role, token, id, page }));
      } else {
        dispatch(getAppointmentsByPatient({ role, token, id }));
      }
    } else {
      dispatch(getAppointments({ token, role }));
    }
  };

  const editAppointment = (event: any) => {
    event.preventDefault();
    const appointmentId = event.currentTarget.value;
    navigate(`/edit-appointment/${appointmentId}`);
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
        <>
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
        </>
        {(appointmentStatus === "Pending" ||
          appointmentStatus === "Completed") && (
          <div className={styles["appointment-option"]}>
            <button
              value={appointment.id}
              className={styles["action-button"]}
              onClick={editAppointment}
            >
              <img src="/images/edit.png" alt="edit" />
              <p>Change appointment date</p>
            </button>
          </div>
        )}
      </div>
    );
  });

  return (
    <>
      <div className={styles["filters"]}>
        <div className={styles["filter-input"]}>
          <label htmlFor="select-date">Order by Date</label>
          <select
            defaultValue={"DEFAULT"}
            name="date"
            id="select-date"
            onChange={(event: any) => orderByDate(event.target.value)}
          >
            <option value="DEFAULT" disabled>
              Select order
            </option>
            <option value="ASC">ASC</option>
            <option value="DESC">DESC</option>
          </select>
        </div>
        <div className={styles["filter-input"]}>
          <label htmlFor="select-patient">Order by Patient</label>
          <select
            defaultValue={"DEFAULT"}
            name="patient"
            id="select-patient"
            onChange={(event: any) => {
              const order = event.target.value;
              orderByPatient(order);
            }}
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
        <div className={`${styles["search"]} ${styles["filter-input"]}`}>
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
          <button onClick={() => filterDate()}>Search</button>
        </div>
        <div className={`${styles["search"]} ${styles["filter-input"]}`}>
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
          <button onClick={() => filterPatient()}>Search</button>
        </div>
      </div>
      {appointmentsList.length ? (
        <div>
          {appointmentsList}
          <div className={styles["pagination"]}>{pageSelectors(count)}</div>
        </div>
      ) : (
        <div className={styles["appointments-placeholder"]}>
          <h2>No results were found!</h2>
        </div>
      )}
    </>
  );
}

export default DoctorAppointments;
