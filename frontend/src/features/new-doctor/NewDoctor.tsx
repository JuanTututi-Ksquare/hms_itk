import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import Modal from "../../common/components/modal/Modal";
import { selectLoginStatus } from "../login/LoginSlice";
import styles from "./NewDoctor.module.css"
import NewDoctorForm from "./NewDoctorForm";

type Props = {
  title: string;
};

function NewDoctor({ title }: Props) {
  const [success, setSuccess] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState("");

  const signUpSuccess = (email: string) => {
    setSuccess(true);
    setEmailSuccess(email);
  };

  useEffect(() => {
    document.title = title;
  });

  const isLoggedIn = useAppSelector(selectLoginStatus);

  if (!isLoggedIn) {
    return <Navigate to="/dashboard" replace={true} />;
  }

  return (
    <div className={styles["sign-up"]}>
      {success && (
        <Modal
          type="success"
          title="New doctor added"
          message={`${emailSuccess} is now registered`}
          redirect="/login"
        />
      )}
      <NewDoctorForm onSuccess={signUpSuccess} />
    </div>
  );
}

export default NewDoctor;
