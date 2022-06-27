import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { selectLogin, selectLoginStatus } from "../login/LoginSlice";
import MessageList from "./MessageList";
import styles from "./Messages.module.css";

type Props = {
  title: string;
};

function Messages({ title }: Props) {
  const isLoggedIn = useAppSelector(selectLoginStatus);
  let role = useAppSelector(selectLogin).role;

  useEffect(() => {
    document.title = title;
  }, [title]);

  if (role === "super") {
    role = "admin";
  }

  if (!isLoggedIn && role !== "admin") {
    return <Navigate to={"/"} />;
  }

  return (
    <div className={styles["messages"]}>
      <MessageList />
    </div>
  );
}

export default Messages;
