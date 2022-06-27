import axios from "axios";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import styles from "./CreateMessageForm.module.css";

type Props = {
  onSuccess: Function;
};

interface FormMessage {
  message: string;
  email: string;
}

function CreateMessageForm({ onSuccess }: Props) {
  const [errorState, setErrorState] = useState("");

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<FormMessage>();

  const onSubmit: SubmitHandler<FormMessage> = (data) => {
    setErrorState("");
    const { message, email } = data;
    axios({
      method: "post",
      url: `http://localhost:3001/contact`,
      data: {
        email,
        message,
      },
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((result) => {
        onSuccess("Success");
        reset();
      })
      .catch((error) => {
        setErrorState("Ups! something went wrong :( try again later");
      });
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={styles["form-fields"]}>
        <div className={styles["message-input"]}>
          <label htmlFor="input-message">Message</label>
          <textarea
            {...register("message", {
              required: "Message is required",
              minLength: {
                value: 30,
                message: "Message must have at least 30 characters",
              },
            })}
            id="input-message"
            rows={8}
            cols={50}
            placeholder="Enter your message..."
          />
          {errors.message && (
            <p className="missing-field">{`${errors.message.message}`}</p>
          )}
        </div>
        <div className={styles["message-input"]}>
          <label htmlFor="input-email">Email</label>
          <input
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                message: "Please enter a valid email",
              },
            })}
            id="input-email"
            type="email"
            placeholder="email@example.com"
          />
          {errors.email && (
            <p className="missing-field">{`${errors.email.message}`}</p>
          )}
        </div>
        <input
          type="submit"
          value="Send message"
          className={styles["submit"]}
        />
      </div>
      {errorState && (
        <div className={styles["server-error"]}>
          <p>{errorState}</p>
        </div>
      )}
    </form>
  );
}

export default CreateMessageForm;
