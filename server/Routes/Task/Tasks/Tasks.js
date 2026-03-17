import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import {
  verifyToken,
  requireVerified,
  allowRoles,
} from "../../../Auth/VerifyUserRole.js";

const prisma = new PrismaClient();
const router = Router();

// ----------------------------
// CREATE TASK (Customer/Client)
// ----------------------------
async function createTask(req, res) {
  try {
    const { title, description, price, category } = req.body;

    const task = await prisma.task.create({
      data: {
        title,
        description,
        price,
        category,
        customerId: req.user.id,
      },
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// ----------------------------
// ADMIN APPROVE OR DECLINE TASK
// ----------------------------
async function updateTask(req, res) {
  try {
    const { approved } = req.body; // true = approved, false = declined

    if (typeof approved !== "boolean") {
      return res.status(400).json({ message: "approved must be boolean" });
    }

    const task = await prisma.task.update({
      where: { id: req.params.id },
      data: { approved },
    });

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// ----------------------------
// DELETE TASK (Customer who posted it)
// ----------------------------
async function deleteTask(req, res) {
  try {
    const task = await prisma.task.findUnique({
      where: { id: req.params.id },
    });

    if (!task) return res.status(404).json({ message: "Task not found" });
    if (task.customerId !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not allowed" });
    }

    await prisma.task.delete({ where: { id: req.params.id } });
    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// ----------------------------
// GET AVAILABLE TASKS FOR FREELANCER
// ----------------------------
async function getTasks(req, res) {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });

    if (!user.isVerified)
      return res.status(403).json({ message: "Account not verified" });

    const tasks = await prisma.task.findMany({
      where: {
        category: user.category,
        approved: true,
        taken: false,
        completed: false,
      },
      include: {
        customer: {
          select: {
            firstName: true,
            email: true,
            category: true,
            phone: true,
            id: true,
          },
        },
      },
    });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// ----------------------------
// FREELANCER TAKES TASK
// ----------------------------
async function takeTask(req, res) {
  try {
    const task = await prisma.task.findUnique({ where: { id: req.params.id } });

    if (!task) return res.status(404).json({ message: "Task not found" });
    if (!task.approved)
      return res.status(403).json({ message: "Task not approved yet" });
    if (task.taken)
      return res.status(400).json({ message: "Task already taken" });

    // Atomic update to prevent race conditions
    const updated = await prisma.task.updateMany({
      where: { id: req.params.id, taken: false },
      data: { taken: true, Progress: 30, freelancerId: req.user.id },
    });

    if (updated.count === 0)
      return res.status(400).json({ message: "Task already taken" });

    const updatedTask = await prisma.task.findUnique({
      where: { id: req.params.id },
    });
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// ----------------------------
// UPDATE PROGRESS (Freelancer)
// ----------------------------
async function updateProgress(req, res) {
  try {
    const { progress } = req.body;

    if (typeof progress !== "number")
      return res.status(400).json({ message: "Progress must be a number" });

    const task = await prisma.task.findUnique({ where: { id: req.params.id } });

    if (!task) return res.status(404).json({ message: "Task not found" });
    if (task.freelancerId !== req.user.id)
      return res
        .status(403)
        .json({ message: "You are not assigned to this task" });

    let newProgress = (task.Progress || 0) + progress;
    if (newProgress > 100) newProgress = 100;

    const updated = await prisma.task.update({
      where: { id: req.params.id },
      data: {
        Progress: newProgress,
        completed: newProgress === 100 ? true : task.completed,
      },
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// ----------------------------
// COMPLETE TASK (Freelancer)
// ----------------------------
async function completeTask(req, res) {
  try {
    const task = await prisma.task.findUnique({ where: { id: req.params.id } });

    if (!task) return res.status(404).json({ message: "Task not found" });
    if (task.freelancerId !== req.user.id)
      return res
        .status(403)
        .json({ message: "You are not assigned to this task" });

    const updated = await prisma.task.update({
      where: { id: req.params.id },
      data: { completed: true, Progress: 100 },
    });

    res.json({ message: "Task completed", task: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
// ----------------------------
// GET MY TASKS (Customer/Client)
// ----------------------------
async function getMyTasks(req, res) {
  try {
    const tasks = await prisma.task.findMany({
      where: {
        customerId: req.user.id, // only tasks posted by this user
      },
      orderBy: {
        createdAt: "desc", // newest first
      },
      include: {
        freelancer: {
          select: {
            firstName: true,
            email: true,
            category: true,
            phone: true,
            id: true,
          },
        },
      },
    });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function allTask(req, res) {
  try {
    const tasks = await prisma.task.findMany();
    if (tasks.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No tasks at this momment" });
    }
    return res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
async function editTask(req, res) {
  try {
    const { title, description, price, category } = req.body;

    const task = await prisma.task.findUnique({
      where: { id: req.params.id },
    });

    if (!task) return res.status(404).json({ message: "Task not found" });

    if (task.customerId !== req.user.id) {
      return res.status(403).json({ message: "Not allowed to edit this task" });
    }

    const updatedTask = await prisma.task.update({
      where: { id: req.params.id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(price && { price }),
        ...(category && { category }),
      },
    });

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
async function getFreelancerTasks(req, res) {
  try {
    const tasks = await prisma.task.findMany({
      where: {
        freelancerId: req.user.id,
        completed: false,
      },
    });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
async function getSingleTask(req, res) {
  try {
    const task = await prisma.task.findUnique({
      where: { id: req.params.id },
      include: {
        customer: {
          select: {
            firstName: true,
            email: true,
          },
        },
      },
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
// ----------------------------
// ROUTES
// ----------------------------
router.get(
  "/:id",
  verifyToken,
  allowRoles("freelancer", "customer", "client", "admin"),
  getSingleTask,
);
router.get(
  "/me/my-active",
  verifyToken,
  requireVerified,
  allowRoles("freelancer"),
  getFreelancerTasks,
);

router.post(
  "/create",
  verifyToken,
  allowRoles("customer", "client"),
  createTask,
);
router.patch(
  "/edit/:id",
  verifyToken,
  allowRoles("customer", "client"),
  editTask,
);
router.patch("/verify/:id", verifyToken, allowRoles("admin"), updateTask);
router.delete(
  "/delete/:id",
  verifyToken,
  allowRoles("customer", "client", "admin"),
  deleteTask,
);
router.get(
  "/me/available",
  verifyToken,
  requireVerified,
  allowRoles("freelancer"),
  getTasks,
);
router.patch(
  "/take/:id",
  verifyToken,
  requireVerified,
  allowRoles("freelancer"),
  takeTask,
);
router.patch(
  "/progress/:id",
  verifyToken,
  requireVerified,
  allowRoles("freelancer"),
  updateProgress,
);
router.patch(
  "/complete/:id",
  verifyToken,
  requireVerified,
  allowRoles("freelancer"),
  completeTask,
);
router.get(
  "/tasks/my-tasks",
  verifyToken,
  allowRoles("customer", "client"),
  getMyTasks,
);
router.get("/tasks/all", verifyToken, allowRoles("admin"), allTask);
export default router;
