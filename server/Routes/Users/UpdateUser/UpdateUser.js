import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import Joi from "joi";
import { verifyToken } from "../../../Auth/VerifyUserRole.js";

const prisma = new PrismaClient();
const router = Router();

/*
Validation schema
*/
const updateUserSchema = Joi.object({
  firstName: Joi.string().min(2).max(50),
  lastName: Joi.string().min(2).max(50),
  email: Joi.string().email(),
  category: Joi.string().min(2).max(50),
  role: Joi.string().valid("admin", "freelancer", "customer"),
  isVerified: Joi.boolean(),
});

router.patch("/:id", verifyToken, async (req, res) => {
  const userId = req.params.id;
  const currentUser = req.user;

  try {
    /*
    -----------------------
    USER PERMISSION CHECK
    -----------------------
    */

    const isAdmin = currentUser.role === "admin";
    const isOwner = currentUser.id === userId;

    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        success: false,
        message: "You cannot update another user",
      });
    }

    /*
    -----------------------
    VALIDATE INPUT
    -----------------------
    */

    const { error, value } = updateUserSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.details.map((e) => e.message),
      });
    }

    /*
    -----------------------
    NON ADMIN RESTRICTIONS
    -----------------------
    */

    if (!isAdmin) {
      if ("role" in value) {
        return res.status(403).json({
          success: false,
          message: "You cannot change your role",
        });
      }

      if ("isVerified" in value) {
        return res.status(403).json({
          success: false,
          message: "You cannot change verification status",
        });
      }
    }

    /*
    -----------------------
    CHECK USER EXISTS
    -----------------------
    */

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    /*
    -----------------------
    UPDATE USER
    -----------------------
    */

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: value,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        category: true,
        isVerified: true,
      },
    });

    console.log(
      `[USER UPDATED] ${currentUser.role} ${currentUser.id} updated user ${userId}`,
    );

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    /*
    INTERNAL LOGGING
    */

    console.error("[UPDATE USER ERROR]", {
      message: error.message,
      stack: error.stack,
      requester: currentUser?.id,
      targetUser: userId,
      body: req.body,
    });

    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating user",
    });
  }
});

export default router;
