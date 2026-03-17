// routes/admin/verifyUser.js
import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { allowRoles, verifyToken } from "../../../Auth/VerifyUserRole.js";

const prisma = new PrismaClient();
const router = Router();

/**
 * PATCH /api/users/verify/:id
 * Admin can verify or unverify a user
 * Request body: { isVerified: true/false }
 */
router.patch(
  "/verify/:id",
  verifyToken,
  allowRoles("admin"),
  async (req, res) => {
    const { id } = req.params;
    const { isVerified } = req.body;

    if (typeof isVerified !== "boolean") {
      return res
        .status(400)
        .json({ success: false, message: "verification failed" });
    }

    try {
      const user = await prisma.user.findUnique({ where: { id } });

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      const updatedUser = await prisma.user.update({
        where: { id },
        data: { isVerified },
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

      return res.status(200).json({
        success: true,
        message: isVerified
          ? "User verified successfully"
          : "User unverified successfully",
        data: updatedUser,
      });
    } catch (error) {
      console.error("[VERIFY USER ERROR]", error);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  },
);

export default router;
