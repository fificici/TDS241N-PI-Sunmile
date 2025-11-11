import { Request, Response } from "express"

export class StudentController {

    async createStudent(req: Request, res: Response): Promise<Response> {

        try {

          const { name, username, email, cpf, birth_date, password, bio, institution, enrollment } = req.body

          if (!name || !email || !password || !username || !cpf || !birth_date || !bio || !institution || !enrollment) {

            return res
              .status(400)
              .json({ message: "Something is missing!" })
          }
    
          const userExists = await studentRepository.findByEmail(email)
          const verificationBirthDate = await studentRepository.verifyBirthDate(birth_date)
          const verificationPassword = await studentRepository.verifyPassword(password)

          if (userExists) {
            return res.status(409).json({ message: "Email already in use!" })
          }

          if (verificationBirthDate) {
            return res.status(409).json({ message: "Birth date format error!" })
          }

          if (verificationPassword) {
            return res.status(409).json({ message: "Insert a stronger password!" })
          }
    
          const student = await studentRepository.createAndSave({
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

    async updateStudent(req: Request, res: Response): Promise<Response> {

        try {
  
          const id = Number(req.params.id) || req.student.id
    
          if (req.student.role !== "admin" && id !== req.student.id) {
  
            return res.status(403).json({ message: "Access denied" })
          }
    
          const student = await studentRepository.findById(id)
  
          if (!student) return res.status(404).json({ message: "Student not found" })
    
          const { name, username, email, password, bio } = req.body
    
          if (name) student.name = name
          if (password) student.password = password
          if (bio) student.bio = bio
  
          if (email) {
  
            const emailExists = await studentRepository.findByEmail(email)
  
            if (emailExists && emailExists.id !== student.id) {
  
              return res.status(409).json({ message: "Email already in use" })
  
            }
  
            student.email = email
          }
  
          if (username) {
  
            const usernameExists = await studentRepository.findByUsername(username)
  
            if (usernameExists && usernameExists.id !== student.id) {
  
              return res.status(409).json({ message: "Username already in use" })
  
            }
  
            student.username = username
          }
          
    
          const updatedStudent = await studentRepository.save(student)
  
          return res.json(updatedStudent)
  
        } catch (error) {
  
          console.error(error)
          return res.status(500).json({ message: "Internal server error" })
        }
    }

    async deleteStudent(req: Request, res: Response): Promise<Response> {

        try {
  
          const id = Number(req.params.id) || req.student.id
    
          if (req.student.role !== "admin" && id !== req.student.id) {

            return res.status(403).json({ message: "Access denied" })
          }
    
          const student = await studentRepository.findById(id);
          if (!student) return res.status(404).json({ message: "User not found" })
    
          await studentRepository.removeUser(student)
  
          return res.status(204).send()
  
        } catch (error) {
  
          console.error(error)
  
          return res.status(500).json({ message: "Internal server error" })
        }
    }
}