import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import styles from "./NewAppointmentForm.module.css";
import { validateDateSchedule } from "../../common/helpers/validators";
import { useAppSelector } from "../../app/hooks";
import { selectLogin } from "../login/LoginSlice";
import axios from "axios";
import { useDispatch } from "react-redux";
import { clearAppointments } from "../appointments/AppointmentsSlice";

interface Props {
  onSuccess: Function;
}

interface Appointment {
  date: Date;
  area: number;
  id_doctor: number;
}

function NewAppointmentForm({ onSuccess }: Props) {
  const [errorState, setErrorState] = useState("");
  const [availableDoctors, setAvailableDoctors] = useState([]);
  const [selectableDoctors, setSelectableDoctors] = useState([]);
  const [, setSelectedDoctor] = useState("");
  const token = useAppSelector(selectLogin).token;
  const dispatch = useDispatch()
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<Appointment>();

  useEffect(() => {
    async function getDoctors() {
      const response = await fetch("http://localhost:3001/patient/doctors", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setAvailableDoctors(data);
    }
    getDoctors();
  }, [token]);

  const onSubmit: SubmitHandler<Appointment> = (data) => {
    const { id_doctor, date } = data;
    axios({
      method: 'post',
      url: 'http://localhost:3001/patient/appointments/',
      data: {
        id_doctor,
        date
      },
      headers: { Authorization: `Bearer ${token}` }     
    }).then(
      (result) => {
        onSuccess(result.data.date)
        reset();
        dispatch(clearAppointments());
      }
    ).catch((error) => {
      setErrorState("Ups! something went wrong :( try again later");
    });
  };

  // Add Area field for each user to an array to avoid duplicates
  let checkArray: any[] = [];
  const areasList = availableDoctors.map((doctor: any) => {
    const areaName = doctor.areaName;
    const areaId = doctor.areaId;
    if(!checkArray.includes(areaName)){
      checkArray.push(areaName);
      return (
        <option value={areaId} key={areaId}>
          {areaName}
        </option>
      );
    }
    return <></>
  });
  
  const displayAvailableDoctors = (event: any) => {
    const area = Number(event.target.value);
    const selectableOptions = availableDoctors.filter((doctor: any) => {
      return area === doctor.areaId;
    });
    setSelectableDoctors(selectableOptions);
  };

  const changeSelection = (event: any) => {
    setSelectedDoctor(event.target.value);
  };

  const doctorsList = selectableDoctors.map((doctor: any) => {
    const id = doctor.id;
    const name = doctor.doctorName;
    return (
      <div key={`${id}-${name}`} className={styles["radio"]}>
        <input
          {...register("id_doctor", { required: "Please choose a doctor" })}
          type="radio"
          id={id}
          value={id}
          onClick={changeSelection}
          key={id}
        />
        <label key={id} htmlFor={id}>{name}</label>
      </div>
    );
  });

  return (
    <>
      <h2>Schedule new appointment</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles["form-fields"]}>
          <div className={styles["date"]}>
            <label htmlFor="input-date">Date</label>
            <input
              {...register("date", {
                required: "Date is required",
                validate: validateDateSchedule,
              })}
              type="datetime-local"
              id="input-date"
            />
            {errors.date && (
              <p className="missing-field">{`${errors.date.message}`}</p>
            )}
          </div>
          <div className={styles["area"]}>
            <div>
              <label htmlFor="area">Area</label>
              <select
                defaultValue={"DEFAULT"}
                id="area"
                {...register("area", {
                  required: "Area is missing",
                })}
                onChange={displayAvailableDoctors}
              >
                <option value="DEFAULT" disabled>
                  Select area
                </option>
                {areasList}
              </select>
              {errors.area && (
                <p className="missing-field">{errors.area.message}</p>
              )}
            </div>
          </div>
          <div>
            <p>Select your doctor</p>
            {doctorsList}
            {errors.id_doctor && (
            <p className="missing-field">{errors.id_doctor.message}</p>
          )}
          </div>
          <div className={styles["doctor-list"]}></div>
          <input
            type="submit"
            value="Create appointment"
            className={styles["submit"]}
          />
        </div>
        {errorState && (
          <div className={styles["server-error"]}>
            <p>{errorState}</p>
          </div>
        )}
      </form>
    </>
  );
}

export default NewAppointmentForm;
