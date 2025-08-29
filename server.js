import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const app = express()

app.use(express.json())
app.use(cors({
  origin: ['http://localhost:5173', 'https://caualemes.github.io/cadUsers-/', 'https://caualemes.github.io/cadUser-site/'],
  methods: ['GET','POST','PUT','DELETE'],
  credentials: true
}))


// CREATE
app.post('/usuarios', async (req, res) => {
  await prisma.user.create({
    data: {
      email: req.body.email,
      name: req.body.name,
      age: req.body.age
    }
  })
  res.status(201).json(req.body)
})

// READ
app.get('/usuarios', async (req, res) => {
  let users = []
  if (req.query.name) {
    users = await prisma.user.findMany({
      where: { name: req.query.name }
    })
  } else {
    users = await prisma.user.findMany()
  }
  res.status(200).json(users)  
})

// UPDATE
app.put('/usuarios/:id', async (req, res) => {
  await prisma.user.update({
    where: { id: req.params.id },
    data: {
      email: req.body.email,
      name: req.body.name,
      age: req.body.age
    }
  })
  res.status(201).json(req.body)
})

// DELETE
app.delete('/usuarios/:id', async (req, res) => {
  await prisma.user.delete({
    where: { id: req.params.id }
  })
  res.status(200).json({ message: 'Usuário deletado com sucesso!' })
})

// PORTA pro Render
const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`))
