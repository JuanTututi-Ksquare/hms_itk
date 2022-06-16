import React from 'react'
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { selectLogin, selectLoginStatus } from '../login/LoginSlice';

type Props = {}

export default function Appointments({}: Props) {
  const isLoggedIn = useAppSelector(selectLoginStatus);
  const userInfo = useAppSelector(selectLogin);
  const role = userInfo.role;

  if(!isLoggedIn) {
    return <Navigate to="/login" /> 
  }


  return (
    <div>
      {role === "patient" && <div>Patient Appointments</div>}
      {role === "doctor" && <div>Doctor Appointments</div>}
      {role === "admin" && <div>Admin Appointments</div>}
      {!role && <div>Super User Appointments</div>}
    </div>
  )
}