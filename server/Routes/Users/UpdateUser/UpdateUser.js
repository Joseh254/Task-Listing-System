import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import Joi from "joi";
import {
  verifyToken,
  requireVerified,
  allowRoles
} from "../../../Auth/VerifyUserRole.js";

const prisma = new PrismaClient();
const router = Router();

/*
  Validation schema
  All fields optional because we allow partial updates
*/
const updateUserSchema = Joi.object({
  firstName: Joi.string().min(2).max(50),
  lastName: Joi.string().min(2).max(50),
  email: Joi.string().email(),
  category: Joi.string().min(2).max(50),
  isVerified: Joi.boolean()
});

/*
  PUT /api/users/:id
*/
router.patch(
  "/:id",
  verifyToken,
  requireVerified,
  async (req, res) => {
    const userId = req.params.id;
    const currentUser = req.user;

    try {
      // -----------------------
      // Validate input
      // -----------------------
      const { error, value } = updateUserSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true
      });

      if (error) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.details.map((e) => e.message)
        });
      }

      // -----------------------
      // Prevent role change
      // -----------------------
      if ("role" in req.body) {
        return res.status(403).json({
          success: false,
          message: "Role cannot be modified"
        });
      }

      // -----------------------
      // Prevent verification change by non-admin
      // -----------------------
      if ("isVerified" in req.body && currentUser.role !== "admin") {
        return res.status(403).json({
          success: false,
          message: "Only admin can verify users"
        });
      }

      // -----------------------
      // Check if user exists
      // -----------------------
      const existingUser = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!existingUser) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }

      // -----------------------
      // Update user
      // -----------------------
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
          isVerified: true
        }
      });

      console.log(
        `[USER UPDATED] Admin/User ${currentUser.id} updated user ${userId}`
      );

      return res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: updatedUser
      });

    } catch (error) {
      // Log full error internally
      console.error("[UPDATE USER ERROR]", {
        message: error.message,
        stack: error.stack,
        body: req.body,
        userId,
        requester: currentUser?.id
      });

      // Send safe error to client
      return res.status(500).json({
        success: false,
        message: "Something went wrong while updating user"
      });
    }
  }
);

export default router;