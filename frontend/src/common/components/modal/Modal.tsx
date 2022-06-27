import React from "react";
import styles from "./Modal.module.css";
import { Link } from "react-router-dom";

type Props = {
  type: string;
  title: string;
  message: string;
  redirect: string;
};

export default function Modal(props: Props) {
  return (
    <div className={styles["modal-container"]}>
      <div className={styles["modal"]}>
        {props.type === "success" && (
          <svg className={styles[`success`]} viewBox="0 0 24 24">
            <path d="M4.1 12.7L9 17.6 20.3 6.3" fill="none" />{" "}
          </svg>
        )}
        <h3>{props.title}</h3>
        <p>{props.message}</p>
        {props.type === "success" && (
          <Link to={props.redirect}>
            <button className={styles["dismiss"]}> OK </button>
          </Link>
        )}
      </div>
    </div>
  );
}
