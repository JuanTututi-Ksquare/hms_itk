import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectLogin } from "../login/LoginSlice";
import { getMessages, selectMessages, selectStatus } from "./MessagesSlice";
import styles from "./Messages.module.css";
import moment from "moment";

function MessageList() {
  const dispatch = useAppDispatch();
  const reqStatus = useAppSelector(selectStatus);
  const token = useAppSelector(selectLogin).token;
  useEffect(() => {
    if (reqStatus === "idle") {
      dispatch(getMessages({ token }));
    }
  }, [dispatch, reqStatus, token]);

  const messages = useAppSelector(selectMessages).messages;
  const count = useAppSelector(selectMessages).count;

  const pageSelectors = (count: number) => {
    const pages = Math.ceil(count / 5);
    const selectors = [];
    // En caso de no haber filtros
    if (pages < 1) {
      return <button>1</button>;
    }
    for (let index = 1; index <= pages; index++) {
      selectors.push(
        <button key={index} value={index} onClick={getMessagesPage}>
          {index}
        </button>
      );
    }
    return selectors;
  };

  const getMessagesPage = (event: any) => {
    const page = event.target.value;
    dispatch(getMessages({ token, page }));
  };

  const messageList = messages.map((item) => {
    const { id, email, message, createdAt } = item;
    const date = moment(createdAt).format("LLLL");
    return (
      <div key={id} className={styles["message"]}>
        <div>
          <h4>Email</h4>
          <p>{email}</p>
        </div>
        <div>
          <h4>Message</h4>
          <p>{message}</p>
        </div>
        <div>
          <h4>Created at</h4>
          <p>{date}</p>
        </div>
      </div>
    );
  });

  return (
    <div>
      {messageList.length ? (
        <div>
          {messageList}
          <div className={styles["pagination"]}>{pageSelectors(count)}</div>
        </div>
      ) : (
        <div className={styles["appointments-placeholder"]}>
          <h2>No results were found!</h2>
        </div>
      )}
    </div>
  );
}

export default MessageList;
