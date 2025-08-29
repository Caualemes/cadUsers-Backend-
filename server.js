import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'

const app = express()
const prisma = new PrismaClient()

// Middlewares
app.use(express.json())

// Configuração CORS
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:4173', 
    'https://caualemes.github.io'
  ],
  credentials: true
}))

// Rota de teste
app.get('/', (req, res) => {
  res.json({ message: 'API funcionando!' })
})

// CREATE
app.post('/usuarios', async (req, res) => {
  try {
    const user = await prisma.user.create({
      data: {
        email: req.body.email,
        name: req.body.name,
        age: req.body.age
      }
    })
    res.status(201).json(user)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// READ
app.get('/usuarios', async (req, res) => {
  try {
    let users = []
    if (req.query.name) {
      users = await prisma.user.findMany({
        where: { name: req.query.name }
      })
    } else {
      users = await prisma.user.findMany()
    }
    res.status(200).json(users)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// UPDATE
app.put('/usuarios/:id', async (req, res) => {
  try {
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: {
        email: req.body.email,
        name: req.body.name,
        age: req.body.age
      }
    })
    res.status(200).json(user)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// DELETE
app.delete('/usuarios/:id', async (req, res) => {
  try {
    await prisma.user.delete({
      where: { id: req.params.id }
    })
    res.status(200).json({ message: 'Usuário deletado com sucesso!' })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// PORTA pro Render
const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`))

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect()
  process.exit()
})