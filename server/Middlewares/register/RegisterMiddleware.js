import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function ValidateUserMiddleware(request, response, next) {
  const { email, firstName, lastName, password, role, category, phone } =
    request.body;

  try {
    // Validate that all fields are provided
    if (!email || !password || !role || !category) {
      return response.status(400).json({
        success: false,
        message: "fields marked with* ara required",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return response.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // Validate length of fields
    if (
      (firstName && firstName.length < 3) ||
      (firstName && firstName.length > 50)
    ) {
      return response.status(400).json({
        success: false,
        message: "first name must be between 3 and 50 characters",
      });
    }

    if (
      (lastName && lastName.length < 3) ||
      (lastName && lastName.length > 50)
    ) {
      return response.status(400).json({
        success: false,
        message: "Last name must be between 3 and 50 characters",
      });
    }

    // Check if email already exists in the database
    const userWithEmailExists = await prisma.user.findFirst({
      where: { email },
    });
    if (userWithEmailExists) {
      return response.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }
    const userWithEmailPhone = await prisma.user.findFirst({
      where: { email },
    });
    if (userWithEmailPhone) {
      return response.status(400).json({
        success: false,
        message: "User with this Phone number already exists",
      });
    }

    // Proceed to the next middleware or controller if validation passes
    next();
  } catch (error) {
    console.log("Error validating user inputs in middleware", error);
    return response.status(500).json({
      success: false,
      message: "Internal server error!",
    });
  }
}
