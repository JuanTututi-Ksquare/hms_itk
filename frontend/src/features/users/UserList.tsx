import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectLogin } from "../login/LoginSlice";
import { clearUsers, getUsers, selectStatus, selectUsers } from "./UsersSlice";
import styles from "./Users.module.css";

type Props = {
  onSuccess: Function;
};

function UserList({ onSuccess }: Props) {
  const dispatch = useAppDispatch();
  const reqStatus = useAppSelector(selectStatus);
  const token = useAppSelector(selectLogin).token;

  useEffect(() => {
    if (reqStatus === "idle") {
      dispatch(getUsers({ token }));
    }
  });

  const users = useAppSelector(selectUsers).users;
  const count = useAppSelector(selectUsers).count;

  const pageSelectors = (count: number) => {
    const pages = Math.ceil(count / 5);
    const selectors = [];
    if (pages < 1) {
      return <button>1</button>;
    }
    for (let index = 1; index <= pages; index++) {
      selectors.push(
        <button key={index} value={index} onClick={getUsersPage}>
          {index}
        </button>
      );
    }
    return selectors;
  };

  const getUsersPage = (event: any) => {
    const page = event.target.value;
    dispatch(getUsers({ token, page }));
  };

  const activateUser = async (event: any) => {
    const id_user = event.target.value;
    fetch("http://localhost:3001/admin/users", {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id_user,
      }),
    })
      .then((response) => {
        response.json().then((data) => {
          dispatch(clearUsers);
          onSuccess(data.id);
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

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
          <div className={styles["activate-user"]}>
            <button value={user.id} onClick={activateUser}>
              Activate User
            </button>
          </div>
        )}
      </div>
    );
  });
  return (
    <div>
      {userList}
      <div className={styles["pagination"]}>{pageSelectors(count)}</div>
    </div>
  );
}

export default UserList;
