import { Request, Response } from "express";
import { StudentRepository } from "../repositories/StudentRepository";
import { UserRepository } from "../repositories/UserRepository";
import { verifyBirthDate, verifyPassword, verifyCPF, verifyUsername, verifyEmail, verifyPhone } from "../helpers/helpers";

const studentRepository = new StudentRepository();
const userRepository = new UserRepository();

export class StudentController {

  async createStudent(req: Request, res: Response): Promise<Response> {
    try {
      const { name, username, email, cpf, phone_number, birth_date, password, bio, institution, enrollment } = req.body;

      if (!name || !username || !email || !cpf || !phone_number || !birth_date || !password || !institution || !enrollment) {
        return res.status(400).json({ message: "Faltando informações para cadastro!" });
      }

      const userExists = await userRepository.findByEmail(email);
      const usernameExists = await userRepository.findByUsername(username);
      const phoneExists = await studentRepository.findByPhone(phone_number)
      const birthDateValid = verifyBirthDate(birth_date);
      const passwordValid = verifyPassword(password);
      const cpfValid = verifyCPF(cpf);
      const usernameValid = verifyUsername(username);
      const phoneValid = verifyPhone(phone_number)
      const emailValid = verifyEmail(email)

      if (userExists) return res.status(409).json({ message: "Email já em uso!" });
      if (usernameExists) return res.status(409).json({ message: "Nome de usuário já em uso!" });
      if (phoneExists) return res.status(409).json({ message: "Número de telefone já em uso!" });
      if (!birthDateValid) return res.status(409).json({ message: "Data inválida ou menor de idade!" });
      if (!passwordValid) return res.status(409).json({ message: "Insira uma senha mais forte (Padrão NIST)!" });
      if (!cpfValid) return res.status(409).json({ message: "Insira um CPF válido!" });
      if (!usernameValid) return res.status(409).json({ message: "Insira um nome de usuário sem espaços ou caracteres especiais além de ponto (.) e underline (_)!" });
      if (!phoneValid) return res.status(409).json({ message: "Insira um número de telefone válido (Exemplo: (11) 11111-1111)!" });
      if (!emailValid) return res.status(409).json({ message: "Insira um email válido!" });
 

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
        phone_number,
        institution,
        enrollment,
        user
      });

      return res.status(201).json(student);

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erro de server interno" });
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

      const { name, username, email, phone_number, password, bio, institution, enrollment } = req.body;

      if (email && email !== student.user.email) {
        if (!verifyEmail(email)) {
          return res.status(400).json({ message: "Invalid email format" });
        }

        const emailExists = await userRepository.findByEmail(email);
        if (emailExists && emailExists.id !== student.user.id) {
          return res.status(409).json({ message: "Email already in use" });
        }
      }

      if (username && username !== student.user.username) {
        if (!verifyUsername(username)) {
          return res.status(400).json({ message: "Invalid username format" });
        }

        const usernameExists = await userRepository.findByUsername(username);
        if (usernameExists && usernameExists.id !== student.user.id) {
          return res.status(409).json({ message: "Username already in use" });
        }
      }

      if (password && !verifyPassword(password)) {
        return res.status(400).json({ message: "Weak password. Follow NIST requirements." });
      }

      if (phone_number && phone_number !== student.phone_number) {

          if (!verifyPhone(phone_number)) {
              return res.status(400).json({ message: "Invalid phone. Use format: (11) 99999-9999" });
          }
      
          const phoneExists = await studentRepository.findByPhone(phone_number);
            if (phoneExists && phoneExists.id !== student.id) {
              return res.status(409).json({ message: "Phone number already in use" });
          }
        }

      if (name) student.user.name = name;
      if (email) student.user.email = email;
      if (username) student.user.username = username;
      if (password) student.user.password = password;
      if (bio) student.bio = bio;
      if (phone_number) student.phone_number = phone_number;
      if (institution) student.institution = institution;
      if (enrollment) student.enrollment = enrollment;

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
