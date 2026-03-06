import { PrismaClient } from '@prisma/client'
import { Router } from 'express'
import { verifyToken, requireVerified, allowRoles } from '../../../Auth/VerifyUserRole.js'

const prisma = new PrismaClient()
const router = Router()

// ----------------------------
// CREATE TASK (Customer/Client)
// ----------------------------
async function createTask(req, res) {
  try {
    const { title, description, price, category } = req.body

    const task = await prisma.task.create({
      data: {
        title,
        description,
        price,
        category,
        customerId: req.user.id
      }
    })

    res.status(201).json(task)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// ----------------------------
// ADMIN APPROVE OR DECLINE TASK
// ----------------------------
async function updateTask(req, res) {
  try {
    const { approved } = req.body // true = approved, false = declined

    if (typeof approved !== 'boolean') {
      return res.status(400).json({ message: "approved must be boolean" })
    }

    const task = await prisma.task.update({
      where: { id: req.params.id },
      data: { approved }
    })

    res.json(task)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// ----------------------------
// DELETE TASK (Customer who posted it)
// ----------------------------
async function deleteTask(req, res) {
  try {
    const task = await prisma.task.findUnique({
      where: { id: req.params.id }
    })

    if (!task) return res.status(404).json({ message: "Task not found" })
    if (task.customerId !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not allowed" })
    }

    await prisma.task.delete({ where: { id: req.params.id } })
    res.json({ message: "Task deleted" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// ----------------------------
// GET AVAILABLE TASKS FOR FREELANCER
// ----------------------------
async function getTasks(req, res) {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } })

    if (!user.isVerified) return res.status(403).json({ message: "Account not verified" })

    const tasks = await prisma.task.findMany({
      where: {
        category: user.category,
        approved: true,
        taken: false,
        completed: false
      },
      include: {
        customer: {
          select: { firstName: true, email: true, category: true, phone: true, id: true }
        }
      }
    })

    res.json(tasks)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// ----------------------------
// FREELANCER TAKES TASK
// ----------------------------
async function takeTask(req, res) {
  try {
    const task = await prisma.task.findUnique({ where: { id: req.params.id } })

    if (!task) return res.status(404).json({ message: "Task not found" })
    if (!task.approved) return res.status(403).json({ message: "Task not approved yet" })
    if (task.taken) return res.status(400).json({ message: "Task already taken" })

    // Atomic update to prevent race conditions
    const updated = await prisma.task.updateMany({
      where: { id: req.params.id, taken: false },
      data: { taken: true, freelancerId: req.user.id }
    })

    if (updated.count === 0) return res.status(400).json({ message: "Task already taken" })

    const updatedTask = await prisma.task.findUnique({ where: { id: req.params.id } })
    res.json(updatedTask)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// ----------------------------
// UPDATE PROGRESS (Freelancer)
// ----------------------------
async function updateProgress(req, res) {
  try {
    const { progress } = req.body

    if (typeof progress !== "number") return res.status(400).json({ message: "Progress must be a number" })

    const task = await prisma.task.findUnique({ where: { id: req.params.id } })

    if (!task) return res.status(404).json({ message: "Task not found" })
    if (task.freelancerId !== req.user.id) return res.status(403).json({ message: "You are not assigned to this task" })

    let newProgress = (task.Progress || 0) + progress
    if (newProgress > 100) newProgress = 100

    const updated = await prisma.task.update({
      where: { id: req.params.id },
      data: { Progress: newProgress, completed: newProgress === 100 ? true : task.completed }
    })

    res.json(updated)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// ----------------------------
// COMPLETE TASK (Freelancer)
// ----------------------------
async function completeTask(req, res) {
  try {
    const task = await prisma.task.findUnique({ where: { id: req.params.id } })

    if (!task) return res.status(404).json({ message: "Task not found" })
    if (task.freelancerId !== req.user.id) return res.status(403).json({ message: "You are not assigned to this task" })

    const updated = await prisma.task.update({
      where: { id: req.params.id },
      data: { completed: true, Progress: 100 }
    })

    res.json({ message: "Task completed", task: updated })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// ----------------------------
// ROUTES
// ----------------------------
router.post('/create', verifyToken, allowRoles("customer", "client"), createTask)
router.patch('/verify/:id', verifyToken, allowRoles("admin"), updateTask)
router.delete('/delete/:id', verifyToken, allowRoles("customer", "client", "admin"), deleteTask)
router.get('/available', verifyToken, requireVerified, allowRoles("freelancer"), getTasks)
router.patch('/take/:id', verifyToken, requireVerified, allowRoles("freelancer"), takeTask)
router.patch('/progress/:id', verifyToken, requireVerified, allowRoles("freelancer"), updateProgress)
router.patch('/complete/:id', verifyToken, requireVerified, allowRoles("freelancer"), completeTask)

export default router