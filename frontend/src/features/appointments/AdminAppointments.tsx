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

  const appointments = useAppSelector(selectAppointments).appointments;
  const count = useAppSelector(selectAppointments).count;
  const filters = useAppSelector(selectAppointments).filters;

  // Function to generate page selectors
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

      if (Object.keys(filters).includes("id_doctor")) {
        for (let index = 1; index <= pages; index++) {
          selectors.push(
            <button
              key={index}
              value={index}
              onClick={() => filterDoctor(index)}
            >
              {index}
            </button>
          );
        }
        return selectors;
      }

      if (Object.keys(filters).includes("status")) {
        for (let index = 1; index <= pages; index++) {
          selectors.push(
            <button
              key={index}
              value={index}
              onClick={() => filterStatus(`${filters.status}`, index)}
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
              onClick={() => orderByPatient(`${filters.orderByPatient}`, index)}
            >
              {index}
            </button>
          );
        }
        return selectors;
      }

      if (Object.keys(filters).includes("orderByDoctor")) {
        for (let index = 1; index <= pages; index++) {
          selectors.push(
            <button
              key={index}
              value={index}
              onClick={() => orderByDoctor(`${filters.orderByDoctor}`, index)}
            >
              {index}
            </button>
          );
        }
        return selectors;
      }
    } else {
      // En caso de no haber filtros
      if (pages < 1) {
        return <button>1</button>;
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

  const appointmentsList = appointments.map((appointment) => {
    const date = moment(appointment.date).format("LLLL");
    let appointmentStatus = appointment.status ? "Pending" : "Cancelled";
    const today = new Date();
    const appointmentDate = new Date(appointment.date);

    if (appointmentDate < today && appointmentStatus === "Pending") {
      appointmentStatus = "Completed";
    }

    return (
      <div key={appointment.id} className={styles["appointment"]}>
        <div>
          <p>Doctor</p>
          <h4>{appointment.doctorName}</h4>
        </div>
        <div>
          <p>Doctor ID</p>
          <h4>{appointment.id_doctor}</h4>
        </div>
        <div>
          <p>Patient</p>
          <h4>{appointment.patientName}</h4>
        </div>
        <div>
          <p>Patient ID</p>
          <h4>{appointment.id_patient}</h4>
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

  const orderByPatient = (value: string, page?: number) => {
    if (page) {
      dispatch(
        getAppointmentsOrderPatient({ role, token, order: value, page })
      );
    } else {
      dispatch(getAppointmentsOrderPatient({ role, token, order: value }));
    }
  };

  const orderByDoctor = (value: string, page?: number) => {
    if (page) {
      dispatch(getAppointmentsOrderDoctor({ role, token, order: value, page }));
    } else {
      dispatch(getAppointmentsOrderDoctor({ role, token, order: value }));
    }
  };

  const filterStatus = (status: string, page?: number) => {
    if (status) {
      if (page) {
        dispatch(getAppointmentsByStatus({ role, token, status, page }));
      } else {
        dispatch(getAppointmentsByStatus({ role, token, status }));
      }
    } else {
      dispatch(getAppointments({ token, role }));
    }
  };

  const filterDoctor = (page?: number) => {
    if (searchByDoctor) {
      const id = searchByDoctor;
      if (page) {
        dispatch(getAppointmentsByDoctor({ role, token, id, page }));
      } else {
        dispatch(getAppointmentsByDoctor({ role, token, id }));
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

  return (
    <>
      <div className={styles["filters"]}>
        <div className={styles["filter-input"]}>
          <label htmlFor="select-patient">Order by Patient</label>
          <select
            defaultValue={"DEFAULT"}
            name="patient"
            id="select-patient"
            onChange={(event: any) => {
              const value = event?.target.value;
              orderByPatient(value);
            }}
          >
            <option value="DEFAULT" disabled>
              Select order
            </option>
            <option value="ASC">ASC</option>
            <option value="DESC">DESC</option>
          </select>
        </div>
        <div className={styles["filter-input"]}>
          <label htmlFor="select-doctor">Order by Doctor</label>
          <select
            defaultValue={"DEFAULT"}
            name="doctor"
            id="select-doctor"
            onChange={(event: any) => {
              const value = event?.target.value;
              orderByDoctor(value);
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
        <div className={styles["filter-input"]}>
          <label htmlFor="select-status">Status</label>
          <select
            defaultValue={"DEFAULT"}
            name="status"
            id="select-status"
            onChange={(event: any) => {
              let option = event.target.value;
              if (option === "none") {
                option = "";
              }
              filterStatus(option);
            }}
          >
            <option value="DEFAULT" disabled>
              Select status
            </option>
            <option value="none">Default</option>
            <option value="true">Pending or Completed</option>
            <option value="false">Cancelled</option>
          </select>
        </div>
        <div className={`${styles["search"]} ${styles["filter-input"]}`}>
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
          <button onClick={() => filterDoctor()}>Search</button>
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

export default AdminAppointments;
