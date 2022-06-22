import React from "react";
import Options from "./Options";
import styles from "./Sidebar.module.css";

type Props = {
  className: string;
  layout: string;
};

export default function Sidebar({ className, layout }: Props) {
  return (
    <div className={`${className}`}>
      <div className={styles["menu"]}>
        {layout === "patient" && <Options layout="patient"/>}
        {layout === "super" && <Options layout="super"/>}
        {layout === "admin" && <Options layout="admin"/>}
        {layout === "doctor" && <Options layout="doctor"/>}
      </div>
    </div>
  );
}
