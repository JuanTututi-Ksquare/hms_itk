import React from "react";
import { Link } from "react-router-dom";
import styles from "./SidebarButton.module.css"

type Props = {
    image: string,
    text: string,
    url: string
};

function SidebarButton({image, text, url}: Props) {
  return (
    <div className={styles["menu-button"]}>
      <Link to={`${url}`}>
        <button type="button">
          <img src={`/images/${image}.png`} alt={`${image}`} />
          <p>{text}</p>
        </button>
      </Link>
    </div>
  );
}

export default SidebarButton;
