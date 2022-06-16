import LoginForm from "./LoginForm";
import styles from "./Login.module.css";
import { Page } from "../../CustomTypes";
import { useEffect } from "react";
import { useAppSelector } from "../../app/hooks";
import { selectLoginStatus } from "./LoginSlice";
import { Navigate } from "react-router-dom";

export default function Login({ title }: Page) {
  useEffect(() => {
    document.title = title;
  }, [title]);

  const isLoggedIn = useAppSelector(selectLoginStatus);

  if (isLoggedIn) {
    return <Navigate to="/dashboard" replace={true} />
  }

  return (
    <div className={styles.login}>
      <LoginForm />
    </div>
  );
}
