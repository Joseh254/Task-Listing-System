import { PrismaClient } from '@prisma/client'
import { Router } from 'express'
import { verifyToken, requireVerified ,allowRoles} from '../../../Auth/VerifyUserRole.js'

const prisma = new PrismaClient()
const router = Router()


// CREATE TASK (Customer)
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

    res.json(task)

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}


// ADMIN VERIFY OR DECLINE TASK
async function updateTask(req, res) {
  try {

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin allowed" })
    }

    const { status } = req.body // APPROVED or DECLINED

    const task = await prisma.task.update({
      where: { id: req.params.id },
      data: { status }
    })

    res.json(task)

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}


// DELETE TASK (Customer who posted it)
async function deleteTask(req, res) {
  try {

    const task = await prisma.task.findUnique({
      where: { id: req.params.id }
    })

    if (!task) {
      return res.status(404).json({ message: "Task not found" })
    }

    if (task.customerId !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" })
    }

    await prisma.task.delete({
      where: { id: req.params.id }
    })

    res.json({ message: "Task deleted" })

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}


// GET TASKS BASED ON FREELANCER CATEGORY
async function getTasks(req, res) {
  try {

    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    })

    if (!user.isVerified) {
      return res.status(403).json({ message: "Account not verified" })
    }

    const tasks = await prisma.task.findMany({
      where: {
        category: user.category,
        status: "APPROVED",
        taken: false
      },
      include: {
        customer: {
          select: {
            firstName: true,
            email: true
          }
        }
      }
    })

    res.json(tasks)

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}


// FREELANCER TAKE TASK
async function takeTask(req, res) {
  try {

    const task = await prisma.task.findUnique({
      where: { id: req.params.id }
    })

    if (!task) {
      return res.status(404).json({ message: "Task not found" })
    }

    if (task.taken) {
      return res.status(400).json({ message: "Task already taken" })
    }

    const updatedTask = await prisma.task.update({
      where: { id: req.params.id },
      data: {
        taken: true,
        freelancerId: req.user.id
      }
    })

    res.json(updatedTask)

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}



// ROUTES

router.post('/create', verifyToken,allowRoles("customer", "client"), createTask)

router.patch('/verify/:id', verifyToken,allowRoles("admin"), updateTask)

router.delete('/delete/:id', verifyToken,allowRoles("customer", "client","admin"), deleteTask)

router.get('/available', verifyToken, requireVerified, allowRoles("customer", "client","freelancer"),getTasks)

router.patch('/take/:id', verifyToken, requireVerified,allowRoles("freelancer"), takeTask)


export default router