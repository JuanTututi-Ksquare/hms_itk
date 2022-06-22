import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import Modal from "../../common/components/modal/Modal";
import { selectLogin, selectLoginStatus } from "../login/LoginSlice";
import UserList from "./UserList";
import styles from "./Users.module.css";

type Props = {
  title: string;
};

function Users({ title }: Props) {
  const isLoggedIn = useAppSelector(selectLoginStatus);
  let role = useAppSelector(selectLogin).role;
  const [success, setSucess] = useState(false);
  const [uidSuccess, setUidSuccess] = useState("");

  const activateSuccess = (uid: string) => {
    setSucess(true);
    setUidSuccess(uid)
  };
  
  if (role === "super") {
    role = "admin";
  }

  useEffect(() => {
    document.title = title;
  }, [title]);

  if (!isLoggedIn && role !== "admin") {
    return <Navigate to="/" replace={true} />;
  }

  return (
    <div className={styles["users"]}>
      {success && (
        <Modal
          type="success"
          title="User activation successfull"
          message={`${uidSuccess} is now active`}
          redirect="/"
        />
      )}
      <UserList onSuccess={activateSuccess}/>
    </div>
  );
}

export default Users;
