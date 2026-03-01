import React from "react";
import { useFormik } from "formik";
import styles from "./Login.module.css";
import { FaGoogle } from "react-icons/fa";

function Login() {
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validate: (values) => {
      const errors = {};

      if (!values.email) {
        errors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(values.email)) {
        errors.email = "Invalid email address";
      }

      if (!values.password) {
        errors.password = "Password is required";
      } else if (values.password.length < 6) {
        errors.password = "Password must be at least 6 characters";
      }

      return errors;
    },
    onSubmit: (values) => {
      console.log("Form Data:", values);
    },
  });

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Login</h2>

        <form onSubmit={formik.handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
            />
            {formik.touched.email && formik.errors.email && (
              <span className={styles.error}>{formik.errors.email}</span>
            )}
          </div>

          <div className={styles.inputGroup}>
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
            />
            {formik.touched.password && formik.errors.password && (
              <span className={styles.error}>{formik.errors.password}</span>
            )}
          </div>

          <button type="submit" className={styles.loginBtn}>
            Login with Email
          </button>

          <div className={styles.divider}>OR</div>

          <button type="button" className={styles.googleBtn}>
            <FaGoogle className={styles.icon} />
            Login with Google
          </button>

          <div className={styles.links}>
            <a href="/forgot-password">Forgot Password?</a>
            <span>
              Don’t have an account? <a href="/register">Create Account</a>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;