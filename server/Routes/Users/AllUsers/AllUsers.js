// routes/admin/AllUsers.js
import express from "express";
import { PrismaClient } from "@prisma/client";
import {
  verifyToken,
  requireVerified,
  allowRoles,
} from "../../../Auth/VerifyUserRole.js";
// import { verifyToken, requireVerified, allowRoles } from "../../auth.js";

const router = express.Router();
const prisma = new PrismaClient();

// GET /admin/all-users
router.get(
  "/",
  verifyToken, // Verify JWT token
  requireVerified, // Ensure the admin is verified
  allowRoles("admin"), // Only admin can access
  async (req, res) => {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
          category: true,
          isVerified: true,
          createdAt: true,
        },
      });

      return res.status(200).json({
        success: true,
        message: "All users fetched successfully",
        data: users,
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },
);

export default router;
