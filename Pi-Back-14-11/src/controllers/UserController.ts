import { Request, Response } from "express"
import { UserRepository } from "../repositories/UserRepository"
import { verifyBirthDate, verifyPassword, verifyCPF, verifyUsername } from '../helpers/helpers'

const userRepository = new UserRepository()

export class UserController {

    async createUser(req: Request, res: Response): Promise<Response> {

        try {

          const { name, username, email, cpf, birth_date, password } = req.body

          if (!name || !email || !password || !username || !cpf || !birth_date) {

            return res
              .status(400)
              .json({ message: "Something is missing!" })
          }
    
          const userExists = await userRepository.findByEmail(email)
          const usernameExists = await userRepository.findByUsername(username)
          const verificationBirthDate = verifyBirthDate(birth_date)
          const verificationPassword = verifyPassword(password)
          const verificationCPF = verifyCPF(cpf)
          const verificationUsername = verifyUsername(username)

          if (userExists) {
            return res.status(409).json({ message: "Email already in use!" })
          }

          if (usernameExists) {
            return res.status(409).json({ message: "Username already in use!" })
          }

          if (!verificationBirthDate) {
            return res.status(409).json({ message: "Birth date format error!" })
          }

          if (!verificationPassword) {
            return res.status(409).json({ message: "Insert a stronger password!" })
          }
          
          if (!verificationCPF) {
            return res.status(409).json({ message: "Insert a valid CPF!" })
          }

          if (!verificationUsername) {
            return res.status(409).json({ message: "Insert a valid username!" })
          }
    
          const user = await userRepository.createAndSave({
            name,
            username,
            email,
            cpf,
            birth_date,
            password
          })

          return res.status(201).json(user)

        } catch (error) {

          console.error(error)
          return res.status(500).json({ message: "Internal server error" })
        }
    }

    async updateUser(req: Request, res: Response): Promise<Response> {

      try {

        const id = Number(req.params.id) || req.user.id
  
        if (req.user.role !== "admin" && id !== req.user.id) {

          return res.status(403).json({ message: "Access denied" })
        }
  
        const user = await userRepository.findById(id)

        if (!user) return res.status(404).json({ message: "User not found" })
  
        const { name, username, email, password } = req.body
  
        if (name) user.name = name
        if (password) user.password = password

        if (email) {

          const emailExists = await userRepository.findByEmail(email)

          if (emailExists && emailExists.id !== user.id) {

            return res.status(409).json({ message: "Email already in use" })

          }

          user.email = email
        }

        if (username) {

          const usernameExists = await userRepository.findByUsername(username)

          if (usernameExists && usernameExists.id !== user.id) {

            return res.status(409).json({ message: "Username already in use" })

          }

          user.username = username
        }
        
  
        const updatedUser = await userRepository.saveUser(user)

        return res.json(updatedUser)

      } catch (error) {

        console.error(error)
        return res.status(500).json({ message: "Internal server error" })
      }
    }

    async deleteUser(req: Request, res: Response): Promise<Response> {

      try {

        const id = Number(req.params.id) || req.user.id
  
        if (req.user.role !== "admin" && id !== req.user.id) {
          return res.status(403).json({ message: "Access denied" })
        }
  
        const user = await userRepository.findById(id);
        if (!user) return res.status(404).json({ message: "User not found" })
  
        await userRepository.removeUser(user)

        return res.status(204).send()

      } catch (error) {

        console.error(error)

        return res.status(500).json({ message: "Internal server error" })
      }
    }
}