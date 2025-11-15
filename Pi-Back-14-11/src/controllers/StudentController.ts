import { Request, Response } from "express";
import { StudentRepository } from "../repositories/StudentRepository";
import { UserRepository } from "../repositories/UserRepository";
import { verifyBirthDate, verifyPassword, verifyCPF, verifyUsername } from "../helpers/helpers";

const studentRepository = new StudentRepository();
const userRepository = new UserRepository();

export class StudentController {

  async createStudent(req: Request, res: Response): Promise<Response> {
    try {
      const { name, username, email, cpf, birth_date, password, bio, institution, enrollment } = req.body;

      if (!name || !username || !email || !cpf || !birth_date || !password || !institution || !enrollment) {
        return res.status(400).json({ message: "Something is missing!" });
      }

      const userExists = await userRepository.findByEmail(email);
      const usernameExists = await userRepository.findByUsername(username);
      const birthDateValid = verifyBirthDate(birth_date);
      const passwordValid = verifyPassword(password);
      const cpfValid = verifyCPF(cpf);
      const usernameValid = verifyUsername(username);

      if (userExists) return res.status(409).json({ message: "Email already in use!" });
      if (usernameExists) return res.status(409).json({ message: "Username already in use!" });
      if (!birthDateValid) return res.status(409).json({ message: "Birth date format error!" });
      if (!passwordValid) return res.status(409).json({ message: "Insert a stronger password!" });
      if (!cpfValid) return res.status(409).json({ message: "Insert a valid CPF!" });
      if (!usernameValid) return res.status(409).json({ message: "Insert a valid username!" });

      const user = await userRepository.createAndSave({
        name,
        username,
        email,
        cpf,
        birth_date,
        password
      });

      const student = await studentRepository.createAndSave({
        bio,
        institution,
        enrollment,
        user
      });

      return res.status(201).json(student);

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async updateStudent(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id) || req.user.id;

      if (req.user.role !== "admin" && id !== req.user.id) {
        return res.status(403).json({ message: "Access denied" });
      }

      const student = await studentRepository.findById(id);
      if (!student) return res.status(404).json({ message: "Student not found" });

      const { name, username, email, password, bio, institution, enrollment } = req.body;

      if (name) student.user.name = name;
      if (password) student.user.password = password;

      if (email) {
        const emailExists = await userRepository.findByEmail(email);
        if (emailExists && emailExists.id !== student.user.id) {
          return res.status(409).json({ message: "Email already in use" });
        }
        student.user.email = email;
      }

      if (username) {
        const usernameExists = await userRepository.findByUsername(username);
        if (usernameExists && usernameExists.id !== student.user.id) {
          return res.status(409).json({ message: "Username already in use" });
        }
        student.user.username = username;
      }

      if (bio) student.bio = bio
      if (institution) student.institution = institution
      if (enrollment) student.enrollment = enrollment

      await userRepository.saveUser(student.user);
      const updatedStudent = await studentRepository.save(student);

      return res.json(updatedStudent);

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async deleteStudent(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id) || req.user.id;

      if (req.user.role !== "admin" && id !== req.user.id) {
        return res.status(403).json({ message: "Access denied" });
      }

      const student = await studentRepository.findById(id);
      if (!student) return res.status(404).json({ message: "Student not found" });

      await studentRepository.remove(student);
      await userRepository.removeUser(student.user);

      return res.status(204).send();

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
