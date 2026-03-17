import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import register from "./Routes/Register/Register.js";
import login from "./Routes/Login/Login.js";
import users from "./Routes/Users/AllUsers/AllUsers.js";
import updateuser from "./Routes/Users/UpdateUser/UpdateUser.js";
import verifyUser from "./Routes/Users/VerifyUser/VerifyUser.js";
import deleteUser from "./Routes/Users/DeleteUser/DeleteUser.js";
import tasks from "./Routes/Task/Tasks/Tasks.js";
import submissions from './Routes/submissions/submissions.js'
dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: true, // ✅ Allows all origins
    credentials: true,
  }),
);

app.get("/", (req, res) => {
  res.send("Welcome to task listing system server!");
});
app.use("/api/register", register);
app.use("/api/login", login);
app.use("/api/users", users);
app.use("/api/users/update", updateuser);
app.use("/api/users", verifyUser);
app.use("/api/users", deleteUser);
app.use("/api/task/", submissions);
app.use("/api/tasks", tasks);
app.listen(3000, () => {
  console.log(`Server running on port 3000`);
});
