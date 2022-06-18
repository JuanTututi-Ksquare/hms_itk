import React from 'react'
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { selectLogin, selectLoginStatus } from '../login/LoginSlice';

type Props = {}

const NewAppointment = (props: Props) => {
  const isLoggedIn = useAppSelector(selectLoginStatus);
  const role = useAppSelector(selectLogin).role;
  
  if(!isLoggedIn || role !== "patient") {
    return <Navigate to="/login" /> 
  }

  return (
    <div>NewAppointment</div>
  )
}

export default NewAppointment