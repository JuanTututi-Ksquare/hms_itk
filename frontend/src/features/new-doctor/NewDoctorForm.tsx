import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAppSelector } from "../../app/hooks";
import { validateDate } from "../../common/helpers/validators";
import { selectLogin } from "../login/LoginSlice";
import styles from "./NewDoctorForm.module.css"

type Props = {
  onSuccess: Function;
};

interface Doctor {
  firstName: string;
  lastName: string;
  birthDate: string;
  email: string;
  password: string;
  confirmPassword: string;
  license: string;
  area: number;
}

function NewDoctorForm({ onSuccess }: Props) {
  const [passwordInput, setPasswordInput] = useState("");
  const [errorState, setErrorState] = useState("");
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<Doctor>();

  const token = useAppSelector(selectLogin).token;

  const registerDoctor = async (data: Doctor) => {
    const { firstName, lastName, birthDate, email, password, license, area } = data;
    fetch("http://localhost:3001/admin/doctors", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        birthdate: birthDate,
        email,
        password,
        license,
        id_area: area,
      }),
    }).then(
      (result) => {
        result.json().then((content) => {
          if (content.code) {
            setErrorState("Ups! something went wrong :( try again later");
          } else {
            onSuccess(email);
          }
        });
      },
      () => {
        setErrorState("Ups! something went wrong :( try again later");
      }
    );
  };

  const onSubmit: SubmitHandler<Doctor> = (data) => {
    setErrorState("");
    registerDoctor(data);
    reset();
  };

  const validatePassword = (pw: string) => {
    if (passwordInput !== pw || passwordInput.length !== pw.length) {
      return "Password is not matching";
    }
  };
  return (
    <>
      <h2>Create new Doctor account</h2>
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
            <label htmlFor="license">License Code *</label>
            <input
              {...register("license", {
                required: "Please enter a valid CURP",
                minLength: {
                  value: 10,
                  message: "License Code must be 10 characters long",
                },
                maxLength: {
                  value: 10,
                  message: "License Code must be 10 characters long",
                },
              })}
              type="text"
              id="curp"
            />
            {errors.license && (
              <p className="missing-field">{errors.license.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="area">Area</label>
            <select  id="area" {...register("area", {
                required: "Area is missing",
              })}>
                <option value="" selected disabled>Select area</option>
                <option value="1">Dermatology</option>
                <option value="2">Internal Medicine</option>
                <option value="3">Familiar Medicine</option>
                <option value="4">Pediatry</option>
                <option value="5">Gynecology</option>
                <option value="6">Preventive Medicine</option>
                <option value="7">Dentistry</option>
                <option value="8">Radiology</option>
                <option value="9">Cardiology</option>
            </select>
            {errors.area && (
              <p className="missing-field">{errors.area.message}</p>
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

export default NewDoctorForm;
