import { Request, Response } from "express"

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
          const verificationBirthDate = await userRepository.verifyBirthDate(birth_date)
          const verificationPassword = await userRepository.verifyPassword(password)

          if (userExists) {
            return res.status(409).json({ message: "Email already in use!" })
          }

          if (verificationBirthDate) {
            return res.status(409).json({ message: "Birth date format error!" })
          }

          if (verificationPassword) {
            return res.status(409).json({ message: "Insert a stronger password!" })
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

    async createStudent(req: Request, res: Response): Promise<Response> {

        try {

          const { name, username, email, cpf, birth_date, password, bio, institution, enrollment } = req.body

          if (!name || !email || !password || !username || !cpf || !birth_date || !bio || !institution || !enrollment) {

            return res
              .status(400)
              .json({ message: "Something is missing!" })
          }
    
          const userExists = await userRepository.findByEmail(email)
          const verificationBirthDate = await userRepository.verifyBirthDate(birth_date)
          const verificationPassword = await userRepository.verifyPassword(password)

          if (userExists) {
            return res.status(409).json({ message: "Email already in use!" })
          }

          if (verificationBirthDate) {
            return res.status(409).json({ message: "Birth date format error!" })
          }

          if (verificationPassword) {
            return res.status(409).json({ message: "Insert a stronger password!" })
          }
    
          const user = await userRepository.createAndSave({
            name,
            username,
            email,
            cpf,
            birth_date,
            password,
            bio,
            institution,
            enrollment
          })

          return res.status(201).json(user)

        } catch (error) {

          console.error(error)
          return res.status(500).json({ message: "Internal server error" })
        }
    }

    async createProfessional(req: Request, res: Response): Promise<Response> {

      try {

        const { name, username, email, cpf, birth_date, password, bio, pro_registration } = req.body

        if (!name || !email || !password || !username || !cpf || !birth_date || !bio || !pro_registration) {

          return res
            .status(400)
            .json({ message: "Something is missing!" })
        }
  
        const userExists = await userRepository.findByEmail(email)
        const verificationBirthDate = await userRepository.verifyBirthDate(birth_date)
        const verificationPassword = await userRepository.verifyPassword(password)

        if (userExists) {
          return res.status(409).json({ message: "Email already in use!" })
        }

        if (verificationBirthDate) {
          return res.status(409).json({ message: "Birth date format error!" })
        }

        if (verificationPassword) {
          return res.status(409).json({ message: "Insert a stronger password!" })
        }
  
        const user = await userRepository.createAndSave({
          name,
          username,
          email,
          cpf,
          birth_date,
          password,
          bio,
          pro_registration
        })

        return res.status(201).json(user)

        } catch (error) {

        console.error(error)
        return res.status(500).json({ message: "Internal server error" })
        }
    }

}
