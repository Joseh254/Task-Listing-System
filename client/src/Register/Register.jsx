import { useFormik } from "formik";
import styles from "./Register.module.css";
import { FaGoogle } from "react-icons/fa";

function Register() {
  const formik = useFormik({
    initialValues: {
      fname: "",
      lname: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "", // freelancer or client
      category: "", // computing, business, etc.
    },
    validate: (values) => {
      const errors = {};

      // Required
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

      if (!values.confirmPassword) {
        errors.confirmPassword = "Confirm your password";
      } else if (values.password !== values.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
      }

      if (!values.role) {
        errors.role = "Select a role";
      }

      if (!values.category) {
        errors.category = "Select a category";
      }

      return errors;
    },
    onSubmit: (values) => {
      console.log("Registration Data:", values);
    },
  });

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Create Account</h2>

        <form onSubmit={formik.handleSubmit} className={styles.form}>
          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <input
                type="text"
                name="fname"
                placeholder="First Name (optional)"
                onChange={formik.handleChange}
                value={formik.values.fname}
              />
            </div>

            <div className={styles.inputGroup}>
              <input
                type="text"
                name="lname"
                placeholder="Last Name (optional)"
                onChange={formik.handleChange}
                value={formik.values.lname}
              />
            </div>
          </div>

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

          <div className={styles.row}>
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

            <div className={styles.inputGroup}>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.confirmPassword}
              />
              {formik.touched.confirmPassword &&
                formik.errors.confirmPassword && (
                  <span className={styles.error}>
                    {formik.errors.confirmPassword}
                  </span>
                )}
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <select
                name="role"
                value={formik.values.role}
                onChange={formik.handleChange}
              >
                <option value="">Select Role</option>
                <option value="freelancer">Freelancer</option>
                <option value="client">Client</option>
              </select>
              {formik.touched.role && formik.errors.role && (
                <span className={styles.error}>{formik.errors.role}</span>
              )}
            </div>

            <div className={styles.inputGroup}>
              <select
                name="category"
                value={formik.values.category}
                onChange={formik.handleChange}
              >
                <option value="">Select Category</option>
                <option value="computing">Computing</option>
                <option value="business">Business</option>
                <option value="design">Design</option>
                <option value="marketing">Marketing</option>
              </select>
              {formik.touched.category && formik.errors.category && (
                <span className={styles.error}>{formik.errors.category}</span>
              )}
            </div>
          </div>

          <button type="submit" className={styles.registerBtn}>
            Create Account
          </button>

          <div className={styles.divider}>OR</div>

          <button type="button" className={styles.googleBtn}>
            <FaGoogle className={styles.icon} />
            Register with Google
          </button>

          <div className={styles.links}>
            <span>
              Already have an account? <a href="/login">Login here</a>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
