import React, { useEffect } from 'react'
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { Page } from '../../CustomTypes';
import { selectLogin, selectLoginStatus } from '../login/LoginSlice';

export default function Dashboard({ title }: Page) {
  useEffect(() => {
    document.title = title;
  }, [title]);

  const isLoggedIn = useAppSelector(selectLoginStatus);
  const userInfo = useAppSelector(selectLogin);
  const role = userInfo.role;

  if(!isLoggedIn) {
    return <Navigate to="/login" /> 
  }
  
  return (
    <div>
      {role === "patient" && <div>Pending Dates</div>}
      {role === "doctor" && <div>Pending Dates</div>}
      {role === "admin" && <div>Admin Dashboard</div>}
      {role === "super" && <div>Super Dashboard</div>}
    </div>
  )
}