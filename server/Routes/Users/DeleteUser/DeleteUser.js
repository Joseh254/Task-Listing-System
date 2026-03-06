// routes/admin/deleteUser.js
import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { allowRoles, verifyToken } from "../../../Auth/VerifyUserRole.js";

const prisma = new PrismaClient();
const router = Router();

/**
 * DELETE /api/users/:id
 * Admin can delete a user
 */
router.delete("/:id", verifyToken, allowRoles("admin"), async (req, res) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    await prisma.user.delete({ where: { id } });

    return res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("[DELETE USER ERROR]", error); // Log for server
    return res
      .status(500)
      .json({ success: false, message: "Unable to delete user" }); // Friendly message
  }
});

export default router;