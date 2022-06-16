import { Link } from "react-router-dom";
import styles from "./LoginForm.module.css";
import { useForm, SubmitHandler } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { loginWithFirebase, selectRequestStatus } from "./LoginSlice";

interface Login {
  email: string;
  password: string;
}

export default function LoginForm() {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<Login>();

  const dispatch = useAppDispatch();

  const onSubmit: SubmitHandler<Login> = (data) => {
    dispatch(loginWithFirebase(data));
    reset();
  };

  const failedLogin = useAppSelector(selectRequestStatus);

  return (
    <>
      <h2>Login with your email</h2>
      <p>
        Don't have an account yet? <Link to="/sign-up">Sign up</Link>
      </p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles["form-fields"]}>
          <div className={styles["email"]}>
            <label htmlFor="input-email">Email</label>
            <input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                  message: "Please enter a valid email",
                },
              })}
              type="text"
              id="input-email"
            />
            {errors.email && (
              <p className="missing-field">{`${errors.email.message}`}</p>
            )}
          </div>
          <div className={styles["password"]}>
            <label htmlFor="input-password">Password</label>
            <input
              {...register("password", {
                required: "Password is required",
              })}
              type="password"
              id="input-passowrd"
            />
            {errors.password && (
              <p className="missing-field">{`${errors.password.message}`}</p>
            )}
          </div>
          <input type="submit" value="Log In" className={styles["submit"]} />
        </div>
        {failedLogin === "failed" && (
          <div className={styles["server-error"]}>
            <p>Invalid email or password, please try again!</p>
          </div>
        )}
      </form>
    </>
  );
}
