import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export async function ValidateUserMiddleware(req, res, next) {
  const { email, firstName, lastName, password, role, category, phone } = req.body;

  try {
    // Required fields
    if (!email || !password || !role || !category) {
      return res.status(400).json({
        success: false,
        error: "Fields marked with * are required",
      });
    }

    // Email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
      error: "Invalid email format",
      });
    }

    // Optional firstName validation
    if (firstName && firstName.trim() !== "" && (firstName.length < 3 || firstName.length > 50)) {
      return res.status(400).json({
        success: false,
        error: "First name must be between 3 and 50 characters",
      });
    }

    // Optional lastName validation
    if (lastName && lastName.trim() !== "" && (lastName.length < 3 || lastName.length > 50)) {
      return res.status(400).json({
        success: false,
        error: "Last name must be between 3 and 50 characters",
      });
    }

    // Check if email already exists
    const existingEmailUser = await prisma.user.findFirst({ where: { email } });
    if (existingEmailUser) {
      return res.status(409).json({ // 409 Conflict
        error: "User with this email already exists",
      });
    }

    // Check phone if provided
    if (phone) {
      const existingPhoneUser = await prisma.user.findFirst({ where: { phone } });
      if (existingPhoneUser) {
        return res.status(409).json({
          success: false,
          error: "User with this phone number already exists",
        });
      }
    }

    // All validations passed
    next();
  } catch (error) {
    console.error("Error validating user inputs:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}