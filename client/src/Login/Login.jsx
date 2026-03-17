import React, { useState } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./Login.module.css";
import { FaGoogle } from "react-icons/fa";

function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
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
      }

      return errors;
    },
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response = await axios.post(
          "http://localhost:3000/api/login",
          values,
          {
            withCredentials: true, // Important for cookies
          },
        );

        if (response.data.success) {
          const userData = response.data.data;
          localStorage.setItem("user", JSON.stringify(userData));
          toast.success(response.data.message || "Logged in successfully!");

          // ✅ Only navigate if verified
          if (userData.isVerified) {
            switch (userData.role) {
              case "freelancer":
                navigate("/freelancer");
                break;
              case "customer":
                navigate("/customer");
                break;
              case "client":
                navigate("/customer");
                break;
              case "admin":
                navigate("/admin");
                break;
              default:
                navigate("/"); // fallback
            }
          } else {
            // Not verified → redirect to verification pending
            navigate("/verification-pending");
          }
        } else {
          toast.error(response.data.message || "Login failed!");
        }
      } catch (error) {
        const message =
          error?.response?.data?.message ||
          "Server did not respond. Please try again later!";
        toast.error(message);
        console.error("Login error:", error);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className={styles.container}>
      <ToastContainer />
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
              disabled={loading}
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
              disabled={loading}
            />
            {formik.touched.password && formik.errors.password && (
              <span className={styles.error}>{formik.errors.password}</span>
            )}
          </div>

          <button type="submit" className={styles.loginBtn} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className={styles.divider}>OR</div>

          <button type="button" className={styles.googleBtn} disabled={loading}>
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
