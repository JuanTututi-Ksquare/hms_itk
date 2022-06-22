import React, { useEffect } from "react";
import styles from "./Home.module.css";
import { Page } from "../../CustomTypes";
import { useAppSelector } from "../../app/hooks";
import { selectLoginStatus } from "../login/LoginSlice";
import { Link } from "react-router-dom";

export default function Home({ title }: Page) {
  useEffect(() => {
    document.title = title;
  }, [title]);

  const isLoggedIn = useAppSelector(selectLoginStatus);
  let createAppointment = isLoggedIn ? "/appointments/new" : "/login";

  return (
    <header className={styles["header"]}>
      <div className={styles["header-title"]}>
        <h1>Arkham Hospital</h1>
        <h2>Professional care for your health</h2>
        <div>
          <Link to={createAppointment} className={styles["header-button"]}>
            <button type="button">Book an appointment</button>
          </Link>
        </div>
      </div>
    </header>
  );
}
