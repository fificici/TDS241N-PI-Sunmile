import { Request, Response } from "express"
import { ProfessionalRepository } from "../repositories/ProfessionalRepository"
import { UserRepository } from "../repositories/PostRepository"

export class ProfessionalController {

    async createProfessional(req: Request, res: Response): Promise<Response> {

      try {

        const { name, username, email, cpf, birth_date, password, bio, pro_registration } = req.body

        if (!name || !email || !password || !username || !cpf || !birth_date || !bio || !pro_registration) {

          return res
            .status(400)
            .json({ message: "Something is missing!" })
        }
  
        const userExists = await ProfessionalRepository.findByEmail(email)
        const verificationBirthDate = await ProfessionalRepository.verifyBirthDate(birth_date)
        const verificationPassword = await ProfessionalRepository.verifyPassword(password)

        if (userExists) {
          return res.status(409).json({ message: "Email already in use!" })
        }

        if (verificationBirthDate) {
          return res.status(409).json({ message: "Birth date format error!" })
        }

        if (verificationPassword) {
          return res.status(409).json({ message: "Insert a stronger password!" })
        }
  
        const professional = await ProfessionalRepository.createAndSave({
          name,
          username,
          email,
          cpf,
          birth_date,
          password,
          bio,
          pro_registration
        })

        return res.status(201).json(professional)

      } catch (error) {

        console.error(error)
        return res.status(500).json({ message: "Internal server error" })
      }
    }

    async updateProfessional(req: Request, res: Response): Promise<Response> {

        try {
  
          const id = Number(req.params.id) || req.professional.id
    
          if (req.professional.role !== "admin" && id !== req.professional.id) {
  
            return res.status(403).json({ message: "Access denied" })
          }
    
          const professional = await ProfessionalRepository.findById(id)
  
          if (!professional) return res.status(404).json({ message: "Professional not found" })
    
          const { name, username, email, password, bio } = req.body
    
          if (name) professional.name = name
          if (password) professional.password = password
          if (bio) professional.bio = bio
  
          if (email) {
  
            const emailExists = await ProfessionalRepository.findByEmail(email)
  
            if (emailExists && emailExists.id !== professional.id) {
  
              return res.status(409).json({ message: "Email already in use" })
  
            }
  
            professional.email = email
          }
  
          if (username) {
  
            const usernameExists = await ProfessionalRepository.findByUsername(username)
  
            if (usernameExists && usernameExists.id !== professional.id) {
  
              return res.status(409).json({ message: "Username already in use" })
  
            }
  
            professional.username = username
          }
          
    
          const updatedProfessional = await ProfessionalRepository.save(professional)
  
          return res.json(updatedProfessional)
  
        } catch (error) {
  
          console.error(error)
          return res.status(500).json({ message: "Internal server error" })
        }
    }

    async deleteProfessional(req: Request, res: Response): Promise<Response> {

        try {
  
          const id = Number(req.params.id) || req.professional.id
    
          if (req.professional.role !== "admin" && id !== req.professional.id) {

            return res.status(403).json({ message: "Access denied" })
          }
    
          const professional = await ProfessionalRepository.findById(id)

          if (!professional) return res.status(404).json({ message: "User not found" })
    
          await ProfessionalRepository.removeUser(professional)
  
          return res.status(204).send()
  
        } catch (error) {
  
          console.error(error)
  
          return res.status(500).json({ message: "Internal server error" })
        }
    }
}