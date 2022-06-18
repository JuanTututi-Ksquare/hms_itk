import React from "react";
import PatientOptions from "./PatientOptions";
import styles from "./Sidebar.module.css";
import SuperOptions from "./SuperOptions";

type Props = {
  className: string;
  layout: string;
};

export default function Sidebar({ className, layout }: Props) {
  return (
    <div className={`${className}`}>
      <div className={styles["menu"]}>
        {layout === "patient" && <PatientOptions />}
        {layout === "super" && <SuperOptions />}
      </div>
    </div>
  );
}
