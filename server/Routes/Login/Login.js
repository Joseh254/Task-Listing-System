import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

import { Router } from "express";
import { loginMiddleware } from "../../Middlewares/Login/Login.Middleware.js";

const prisma = new PrismaClient();

export async function LoginController(request, response) {
  const { email, password } = request.body;

  try {
    const userExists = await prisma.user.findFirst({
      where: { email },
    });

    if (!userExists) {
      return response
        .status(404)
        .json({ success: false, message: "Wrong credentials!" });
    }

    const passwordMatch = await bcrypt.compare(password, userExists.password);
    if (!passwordMatch) {
      return response
        .status(400)
        .json({ success: false, message: "Wrong credentials" });
    }

    const payload = {
      id: userExists.id,

      firstName: userExists.firstName,
      lastName: userExists.lastName,
      phone: userExists.phone,
      role: userExists.role,
      email: userExists.email,
      category: userExists.category,
      isVerified: userExists.isVerified,
    };

    // Access token - 1 day
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET);

    // Cookies
    response.cookie("access_token", accessToken);

    return response.status(200).json({
      success: true,
      message: "Logged in successfully",
      data: payload,
      accessToken,
    });
  } catch (error) {
    console.error("Error logging in user:", error.message, error);

    return response
      .status(500)
      .json({ success: false, message: "Internal server error!" });
  }
}

const router = Router();

router.post("/", loginMiddleware, LoginController);

export default router;
