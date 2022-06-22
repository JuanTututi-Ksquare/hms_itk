import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import Modal from '../../common/components/modal/Modal';
import { selectLogin, selectLoginStatus } from '../login/LoginSlice';
import styles from "./NewAppointment.module.css"
import NewAppointmentForm from './NewAppointmentForm';

type Props = {
  title: string
}

const NewAppointment = ({title}: Props) => {
  const [success, setSucess] = useState(false);
  const [dateSuccess, setDateSuccess] = useState("");
  const isLoggedIn = useAppSelector(selectLoginStatus);
  const role = useAppSelector(selectLogin).role;

  const appointmentSuccess = (date: string) => {
    setSucess(true);
    const dateFormatted = moment(date).format("LLLL");
    setDateSuccess(dateFormatted)
  };

  useEffect(() => {
    document.title = title;
  });
  
  
  if(!isLoggedIn || role !== "patient") {
    return <Navigate to="/" /> 
  }

  return (
    <div className={styles["new"]}>
      {success && (
        <Modal
          type="success"
          title="Appointment has been scheduled!"
          message={`Appointment for ${dateSuccess} has been registered`}
          redirect="/appointments"
        />
      )}
      <NewAppointmentForm onSuccess={appointmentSuccess} />
    </div>
  )
}

export default NewAppointment