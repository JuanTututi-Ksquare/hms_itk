import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectLogin } from "../login/LoginSlice";
import { getUsers, selectStatus, selectUsers } from "./UsersSlice";
import styles from "./Users.module.css";

function UserList() {
  const dispatch = useAppDispatch();
  const reqStatus = useAppSelector(selectStatus);
  const token = useAppSelector(selectLogin).token;

  useEffect(() => {
    if (reqStatus === "idle") {
      dispatch(getUsers(token));
    }
  });

  const users = useAppSelector(selectUsers);

  const userList = users.map((user) => {
    const userName = `${user.first_name} ${user.last_name}`;
    const role = user.Doctor ? "Doctor" : "Patient";
    const status = user.is_deleted ? "Deleted" : "Active";
    return (
      <div key={user.id} className={styles["user"]}>
        <div>
          <p>Name</p>
          <h4>{userName}</h4>
        </div>
        <div>
          <p>Role</p>
          <h4>{role}</h4>
        </div>
        <div>
          <p>Status</p>
          <h4>{status}</h4>
        </div>
        {status === "Deleted" && (
          <div>
            <button>Activate User</button>
          </div>
        )}
      </div>
    );
  });
  return <div>{userList}</div>;
}

export default UserList;
