import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Link } from "react-router-dom";
import { validateDate } from "../../common/helpers/validators";
import styles from "./SignUpForm.module.css";

interface Patient {
  firstName: string;
  lastName: string;
  birthDate: string;
  email: string;
  password: string;
  confirmPassword: string;
  curp: string;
  nss?: string;
}

interface Props {
  onSuccess: Function;
}

export default function SignUpForm(props: Props) {
  const [passwordInput, setPasswordInput] = useState("");
  const [errorState, setErrorState] = useState("");

  const registerPatient = async (data: Patient) => {
    const { firstName, lastName, birthDate, email, password, curp, nss } = data;
    fetch("http://localhost:3001/patient/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        birthdate: birthDate,
        email,
        password,
        curp,
        nss
      }),
    }).then(
      (result) => {
        result.json().then((content) => {
          if (content.code) {
            setErrorState("Ups! something went wrong :( try again later");
          } else {
            props.onSuccess(email);
          }
        });
      },
      () => {
        setErrorState("Ups! something went wrong :( try again later");
      }
    );
  };

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<Patient>();

  const onSubmit: SubmitHandler<Patient> = (data) => {
    setErrorState("");
    registerPatient(data);
    reset();
  };

  const validatePassword = (pw: string) => {
    if (passwordInput !== pw || passwordInput.length !== pw.length) {
      return "Password is not matching";
    }
  };

  return (
    <>
      <h2>Create an account with your email</h2>
      <p>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles["form-fields"]}>
          <div>
            <label htmlFor="first-name">First name *</label>
            <input
              {...register("firstName", {
                required: "First name is required",
              })}
              id="first-name"
              type="text"
            />
            {errors.firstName && (
              <p className="missing-field">{`${errors.firstName.message}`}</p>
            )}
          </div>
          <div>
            <label htmlFor="last-name">Last name *</label>
            <input
              {...register("lastName", {
                required: "Last name is required",
              })}
              id="last-name"
              name="lastName"
              type="text"
            />
            {errors.lastName && (
              <p className="missing-field">{`${errors.lastName.message}`}</p>
            )}
          </div>
          <div>
            <label htmlFor="email">Email *</label>
            <input
              {...register("email", {
                required: "Please enter a valid email",
                pattern: {
                  value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                  message: "Please enter a valid email",
                },
              })}
              type="email"
              id="email"
            />
            {errors.email && (
              <p className="missing-field">{`${errors.email.message}`}</p>
            )}
          </div>
          <div>
            <label htmlFor="birthdate">Birthdate</label>
            <input
              {...register("birthDate", {
                required: "Birthdate is required",
                validate: validateDate,
              })}
              type="date"
              id="birthdate"
            />
            {errors.birthDate && (
              <p className="missing-field">{`${errors.birthDate.message}`}</p>
            )}
          </div>
          <div>
            <label htmlFor="password">Password *</label>
            <input
              {...register("password", {
                required: "Please enter a valid password",
                minLength: {
                  value: 8,
                  message: "Password needs to be at least 8 characters long",
                },
              })}
              type="password"
              id="password"
              onChange={(event) => setPasswordInput(event.target.value)}
            />
            {errors.password && (
              <p className="missing-field">{errors.password.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="confirm-password">Confirm password *</label>
            <input
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: validatePassword,
              })}
              type="password"
              id="confirm-password"
            />
            {errors.confirmPassword && (
              <p className="missing-field">{errors.confirmPassword.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="curp">CURP *</label>
            <input
              {...register("curp", {
                required: "Please enter a valid CURP",
                minLength: {
                  value: 18,
                  message: "CURP must be 18 characters long!",
                },
                maxLength: {
                  value: 18,
                  message: "CURP must be 18 characters long!",
                },
              })}
              type="text"
              id="curp"
            />
            {errors.curp && (
              <p className="missing-field">{errors.curp.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="nss">NSS</label>
            <input
              {...register("nss", {
                required: false,
                minLength: { value: 9, message: "NSS must be 9 digits long!" },
                maxLength: { value: 9, message: "NSS must be 9 digits long!" },
              })}
              type="text"
              id="nss"
            />
            {errors.nss && (
              <p className="missing-field">{errors.nss.message}</p>
            )}
          </div>
          <input
            type="submit"
            className={styles["submit-button"]}
            value="Create Account"
          />
          {errorState && (
            <div className={styles["server-error"]}>
              <p>{errorState}</p>
            </div>
          )}
        </div>
      </form>
    </>
  );
}
