import React, { useEffect, useState } from "react";
import SignUpForm from "./SignUpForm";
import styles from "./SignUp.module.css";
import { Page } from "../../CustomTypes";
import Modal from "../../common/components/modal/Modal";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { selectLoginStatus } from "../login/LoginSlice";

export default function SignUp({ title }: Page) {
  const [success, setSucess] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState("");

  const signUpSuccess = (email: string) => {
    setSucess(true);
    setEmailSuccess(email)
  };

  useEffect(() => {
    document.title = title;
  });

  const isLoggedIn = useAppSelector(selectLoginStatus);

  if(isLoggedIn) {
    return <Navigate to="/" replace={true} />
  }

  return (
    <div className={styles["sign-up"]}>
      {success && (
        <Modal
          type="success"
          title="Sign up completed"
          message={`${emailSuccess} is now registered`}
          redirect="/login"
        />
      )}
      <SignUpForm onSuccess={signUpSuccess} />
    </div>
  );
}
