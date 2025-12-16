import { Request, Response } from "express"
import { ProPostRepository } from "../repositories/ProPostRepository"
import { ProfessionalRepository } from "../repositories/ProfessionalRepository"

const proPostRepository = new ProPostRepository()
const professionalRepository = new ProfessionalRepository()

export class ProPostController {

  async list(req: Request, res: Response) {
    try {
      const posts = await proPostRepository.findAllWithProfessional()

      const formatted = posts.map(post => ({
        id: post.id,
        title: post.title,
        content: post.content,
        created_at: post.created_at,
        author: {
          name: post.professional.user.name,
          username: post.professional.user.username
        }
      }))

      return res.json(formatted)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: "Internal server error" })
    }
  }

  async show(req: Request, res: Response) {
    try {
      const { id } = req.params

      const post = await proPostRepository.findByIdWithProfessional(Number(id))
      if (!post) {
        return res.status(404).json({ message: "ProPost not found" })
      }

      return res.json({
        id: post.id,
        title: post.title,
        content: post.content,
        created_at: post.created_at,
        author: {
          name: post.professional.user.name,
          username: post.professional.user.username
        }
      })

    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: "Internal server error" })
    }
  }


  async create(req: Request, res: Response) {
    try {
      const { title, content } = req.body
      const userId = req.user.id

      if (!title || !content) {
        return res.status(400).json({
          message: "Title and content are required"
        })
      }

      const professional = await professionalRepository.findByUserId(userId)

      if (!professional) {
        return res.status(403).json({
          message: "Only professionals can create ProPosts"
        })
      }

      const post = await proPostRepository.createAndSave({
        title,
        content,
        professional
      })

      return res.status(201).json(post)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: "Internal server error" })
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { title, content } = req.body
      const user = req.user

      const post = await proPostRepository.findByIdWithProfessional(Number(id))
      if (!post) {
        return res.status(404).json({ message: "ProPost not found" })
      }

      const isOwner =
        post.professional.user.id === user.id

      if (user.role !== "admin" && !isOwner) {
        return res.status(403).json({ message: "Access denied" })
      }

      if (title) post.title = title
      if (content) post.content = content

      const updatedPost = await proPostRepository.save(post)
      return res.json(updatedPost)

    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: "Internal server error" })
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params
      const user = req.user

      const post = await proPostRepository.findByIdWithProfessional(Number(id))
      if (!post) {
        return res.status(404).json({ message: "ProPost not found" })
      }

      const isOwner =
        post.professional.user.id === user.id

      if (user.role !== "admin" && !isOwner) {
        return res.status(403).json({ message: "Access denied" })
      }

      await proPostRepository.remove(post)
      return res.status(204).send()

    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: "Internal server error" })
    }
  }
}
