import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { Router } from "express";
import { ValidateUserMiddleware } from "../../Middlewares/register/RegisterMiddleware.js";
const prisma = new PrismaClient();

export async function SignUpController(req, res) {
  const { email, firstName, lastName, password, role, category } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const createdUser = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        role,
        password: hashedPassword,
        category,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        category: true,
        role: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Account created successfully!",
      data: createdUser,
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

const router = Router();
router.post("/", ValidateUserMiddleware, SignUpController);

export default router;
