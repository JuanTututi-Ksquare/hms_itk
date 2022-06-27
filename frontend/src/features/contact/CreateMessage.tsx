import React, { useEffect, useState } from "react";
import Modal from "../../common/components/modal/Modal";
import styles from "./CreateMessage.module.css";
import CreateMessageForm from "./CreateMessageForm";

type Props = {
  title: string;
};

function CreateMessage({ title }: Props) {
  const [success, setSucess] = useState(false);

  const messageSent = (message: string) => {
    setSucess(true);
  };

  useEffect(() => {
    document.title = title;
  });

  return (
    <div className={styles["contact-form"]}>
      {success && (
        <Modal
          type="success"
          title="Thank you for the feedback!"
          message={`Message has been sent correctly`}
          redirect="/"
        />
      )}
      <CreateMessageForm onSuccess={messageSent} />
    </div>
  );
}

export default CreateMessage;
