import React, { useEffect } from "react";
import { Page } from "../../CustomTypes";
import styles from "./NotFound.module.css";

export default function NotFound({title}: Page) {
  useEffect(() => {
    document.title = title;
  }, [title]);
  return (
    <div className={styles["error-message"]}>
      <img src="/images/404.jpg" alt="not found" />
      <h1>404 - Page not found</h1>
    </div>
  );
}
