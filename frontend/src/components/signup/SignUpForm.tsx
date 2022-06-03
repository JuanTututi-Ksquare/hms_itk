import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import "./SignUpForm.css";

interface Patient {
  firstName: string;
  lastName: string;
  birthDate: string;
  email: string;
  password: string;
  curp: string;
  nss?: string;
}

const onSubmit: SubmitHandler<Patient> = (data) => console.log(data);

export default function SignUpForm() {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<Patient>();

  return (
    <div className="sign-up">
      <h2>Create an account with your email</h2>
      <p>Already have an account? <a href="/sign-in">Sign in</a></p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="first-name">First name</label>
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
          <label htmlFor="last-name">Last name</label>
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
          <label htmlFor="birthdate">Birthdate</label>
          <input
            {...register("birthDate", { required: "Birthdate is required" })}
            type="date"
            id="birthdate"
          />
          {errors.birthDate && (
            <p className="missing-field">{`${errors.birthDate.message}`}</p>
          )}
        </div>
        <div>
          <label htmlFor="email">Email</label>
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
          <label htmlFor="password">Password</label>
          <input
            {...register("password", {
              required: "Please enter a valid password",
              minLength: 8,
            })}
            type="password"
            id="password"
          />
          {errors.password && (
            <p className="missing-field">{errors.password.message}</p>
          )}
          <label htmlFor="confirm-password">Confirm password</label>
          <input
            type="password"
            name="confirm-password"
            id="confirm-password"
          />
        </div>
        <div>
          <label htmlFor="curp">CURP</label>
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
              minLength: {value: 9, message: "NSS must be 9 digits long!"},
              maxLength: {value: 9, message: "NSS must be 9 digits long!"},
            })}
            type="text"
            id="nss"
          />
          {errors.nss && <p className="missing-field">{errors.nss.message}</p>}
        </div>
        <input type="submit" className="submit-button" value="Sign up"/>
      </form>
    </div>
  );
}
