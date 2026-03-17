import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import {
  verifyToken,
  requireVerified,
  allowRoles,
} from "../../Auth/VerifyUserRole.js";
const prisma = new PrismaClient();
const router = Router();
async function submitTask(req, res) {
  try {
    const { message, files } = req.body;

    const task = await prisma.task.findUnique({
      where: { id: req.params.id },
      include: { submissions: true },
    });

    if (!task) return res.status(404).json({ message: "Task not found" });

    if (task.freelancerId !== req.user.id)
      return res.status(403).json({
        message: "You are not assigned to this task",
      });

    // ✅ Prevent submitting twice
    if (task.submissions.length > 0 || task.completed) {
      return res.status(400).json({
        message: "You have already submitted this task",
      });
    }

    // ✅ Create submission
    const submission = await prisma.submission.create({
      data: {
        message,
        taskId: task.id,
        freelancerId: req.user.id,
        files: {
          create: files.map((url) => ({
            url,
          })),
        },
      },
      include: {
        files: true,
      },
    });

    // ✅ Mark task as completed
    await prisma.task.update({
      where: { id: task.id },
      data: {
        Progress: 100,
        completed: true,
      },
    });

    res.json({
      message: "Task submitted successfully",
      submission,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// CUSTOMER COMPLETED TASKS
async function getCustomerCompletedTasks(req, res) {
  try {
    const tasks = await prisma.task.findMany({
      where: {
        customerId: req.user.id,
        completed: true,
      },
      include: {
        freelancer: {
          select: {
            id: true,
            firstName: true,
            email: true,
          },
        },
        submissions: {
          include: {
            files: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// TREELANCER COMPLETED TASKS
async function getFreelancerSubmittedTasks(req, res) {
  try {
    const tasks = await prisma.task.findMany({
      where: {
        freelancerId: req.user.id,
        completed: true,
      },
      include: {
        customer: {
          select: {
            id: true,
            firstName: true,
            email: true,
          },
        },
        submissions: {
          include: {
            files: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

//ROUTES

router.get(
  "/freelancer/submitted",
  verifyToken,
  requireVerified,
  allowRoles("freelancer"),
  getFreelancerSubmittedTasks,
);

router.get(
  "/customer/completed",
  verifyToken,
  allowRoles("customer", "client"),
  getCustomerCompletedTasks,
);

router.post(
  "/submit/:id",
  verifyToken,
  requireVerified,
  allowRoles("freelancer"),
  submitTask,
);
export default router;
