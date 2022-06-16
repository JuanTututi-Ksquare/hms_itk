import React from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  selectLogin,
  selectLoginStatus,
} from "../../../features/login/LoginSlice";
import styles from "./NavBar.module.css";
import { showNav } from "./NavBarSlice";

export default function NavBar() {
  const isLoggedIn = useAppSelector(selectLoginStatus);
  const userInfo = useAppSelector(selectLogin);
  const name = userInfo.displayName;
  const dispatch = useAppDispatch()
  const toggleNav = () => {
    dispatch(showNav({}));
  }
  return (
    <nav className={styles.nav}>
      <Link to="/" className={styles.logo}>
        <img src="/images/logo-final.png" alt="logo" />
      </Link>
      {isLoggedIn && (
        <div className={styles["user-menu"]}>
          <p className={styles["greeting"]}>{`Hello, ${name}`}</p>{" "}
          <input
            type="image"
            src="/images/menu.png"
            alt="menu"
            className={styles["button-menu"]}
            onClick={toggleNav}
          />
        </div>
      )}
      {!isLoggedIn && (
        <div>
          <Link to="/login" className={styles["button-log-in"]}>
            <button type="button">Log In</button>
          </Link>
          <Link to="/sign-up" className={styles["button-sign-up"]}>
            <button type="button">Sign Up</button>
          </Link>
        </div>
      )}
    </nav>
  );
}
