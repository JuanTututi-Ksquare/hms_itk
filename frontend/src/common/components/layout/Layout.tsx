import React from "react";
import { Outlet } from "react-router-dom";
import { useAppSelector } from "../../../app/hooks";
import { selectLogin, selectLoginStatus } from "../../../features/login/LoginSlice";
import Navbar from "../navbar/NavBar";
import { selectNavStatus } from "../navbar/NavBarSlice";
import Sidebar from "../sidebar/Sidebar";
import styles from "./Layout.module.css";

function Layout() {
  const showNav = useAppSelector(selectNavStatus);
  const isLoggedIn = useAppSelector(selectLoginStatus)
  const userInfo = useAppSelector(selectLogin);
  const role = userInfo.role;

  return (
    <div className={styles["layout"]}>
      <Navbar />
      <div className={styles["main-content"]}>
        <main className={styles["main"]}>
          <Outlet />
        </main>
        {isLoggedIn && <Sidebar className={`${styles["sidebar"]} ${showNav && styles["hidden"]}`} layout={role}/>}
      </div>
    </div>
  );
}

export default Layout;
