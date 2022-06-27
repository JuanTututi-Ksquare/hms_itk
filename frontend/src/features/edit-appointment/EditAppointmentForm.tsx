import axios from "axios";
import moment from "moment";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { validateDateSchedule } from "../../common/helpers/validators";
import { clearAppointments } from "../appointments/AppointmentsSlice";
import { selectLogin } from "../login/LoginSlice";
import styles from "./EditAppointmentForm.module.css";

interface FormDate {
  date: Date;
}

type Props = {
  appointmentId: string;
  onSuccess: Function;
};

function EditAppointmentForm({ appointmentId, onSuccess }: Props) {
  const [errorState, setErrorState] = useState("");
  const token = useAppSelector(selectLogin).token;

  const dispatch = useAppDispatch();

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<FormDate>();

  const onSubmit: SubmitHandler<FormDate> = (data) => {
    setErrorState("");
    const { date } = data;
    axios({
      method: "patch",
      url: `http://localhost:3001/doctor/appointments/${appointmentId}`,
      data: {
        date,
      },
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((result) => {
        onSuccess(moment(date).format('LLLL'));
        reset();
        dispatch(clearAppointments());
      })
      .catch((error) => {
        setErrorState("Ups! something went wrong :( try again later");
      });
    reset();
  };

  return (
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
        <input type="submit" value="Update" className={styles["submit"]} />
      </div>
      {errorState && (
        <div className={styles["server-error"]}>
          <p>{errorState}</p>
        </div>
      )}
    </form>
  );
}

export default EditAppointmentForm;
