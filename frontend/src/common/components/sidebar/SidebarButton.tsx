import React from "react";
import { Link } from "react-router-dom";
import { useAppDispatch } from "../../../app/hooks";
import { clearAppointments } from "../../../features/appointments/AppointmentsSlice";
import { logOut } from "../../../features/login/LoginSlice";
import { clearUsers } from "../../../features/users/UsersSlice";
import styles from "./SidebarButton.module.css";

type Props = {
  image: string;
  text: string;
  url: string;
};

function SidebarButton({ image, text, url }: Props) {
  const dispatch = useAppDispatch();
  return (
    <div className={styles["menu-button"]}>
      <Link to={`${url}`}>
        <button
          type="button"
          onClick={() => {
            url === "/" && dispatch(logOut());
            dispatch(clearAppointments());
            dispatch(clearUsers());
          }}
        >
          <img src={`/images/${image}.png`} alt={`${image}`} />
          <p>{text}</p>
        </button>
      </Link>
    </div>
  );
}

export default SidebarButton;
