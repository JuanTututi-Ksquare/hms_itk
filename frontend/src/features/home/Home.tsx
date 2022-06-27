import React, { useEffect } from "react";
import styles from "./Home.module.css";
import { Page } from "../../CustomTypes";
import { useAppSelector } from "../../app/hooks";
import { selectLogin, selectLoginStatus } from "../login/LoginSlice";
import { Link } from "react-router-dom";

export default function Home({ title }: Page) {
  useEffect(() => {
    document.title = title;
  }, [title]);

  const isLoggedIn = useAppSelector(selectLoginStatus);
  let role = useAppSelector(selectLogin).role;

  if (role === "super") {
    role = "admin";
  }

  let createAppointment = isLoggedIn ? "/appointments/new" : "/login";

  return (
    <header className={`${styles["header"]} ${styles[role]}`}>
      <div className={styles["header-title"]}>
        <h1>Arkham Hospital</h1>
        <h2>Professional care for your health</h2>
        <div>
          {(role === "doctor" || role === "admin") && (
            <Link to="/appointments" className={styles["header-button"]}>
              <button type="button">Check appointments</button>
            </Link>
          )}
          {(role === "patient" || !role) && (
            <Link to={createAppointment} className={styles["header-button"]}>
              <button type="button">Book an appointment</button>
            </Link>
          )}
          {!role && (
            <Link to="/message" className={styles["message-button"]}>
              <button type="button">Contact</button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
