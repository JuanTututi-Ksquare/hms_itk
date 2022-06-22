import React from 'react'
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks'
import { selectLogin, selectLoginStatus } from '../login/LoginSlice'
import UserList from './UserList';
import styles from "./Users.module.css"

function Users() {
  const isLoggedIn = useAppSelector(selectLoginStatus);
  let role = useAppSelector(selectLogin).role;
  if(role === "super") {
    role="admin";
  }

  if(!isLoggedIn && role !== "admin"){
    return <Navigate to="/" replace={true} />;
  }

  return (
    <div className={styles["users"]}>
    <UserList />
    </div>
  )
}

export default Users