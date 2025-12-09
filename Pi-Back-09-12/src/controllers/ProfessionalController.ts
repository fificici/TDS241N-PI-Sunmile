import { Request, Response } from "express";
import { ProfessionalRepository } from "../repositories/ProfessionalRepository";
import { UserRepository } from "../repositories/UserRepository";
import { verifyBirthDate, verifyPassword, verifyCPF, verifyUsername, verifyPhone, verifyEmail } from "../helpers/helpers";

const professionalRepository = new ProfessionalRepository();
const userRepository = new UserRepository();

export class ProfessionalController {

  async createProfessional(req: Request, res: Response): Promise<Response> {
    try {
      const { name, username, email, cpf, phone_number, birth_date, password, bio, pro_registration } = req.body;

      if (!name || !username || !email || !cpf || !phone_number || !birth_date || !password || !pro_registration) {
        return res.status(400).json({ message: "Faltando informações para cadastro!" });
      }

      const userExists = await userRepository.findByEmail(email);
      const usernameExists = await userRepository.findByUsername(username);
      const phoneExists = await professionalRepository.findByPhone(phone_number);
      const registrationExists = await professionalRepository.findByRegistration(pro_registration);
      const birthDateValid = verifyBirthDate(birth_date);
      const passwordValid = verifyPassword(password);
      const cpfValid = verifyCPF(cpf);
      const usernameValid = verifyUsername(username);
      const phoneValid = verifyPhone(phone_number)
      const emailValid = verifyEmail(email)

      if (userExists) return res.status(409).json({ message: "Email já em uso!" });
      if (usernameExists) return res.status(409).json({ message: "Nome de usuário já em uso!" });
      if (phoneExists) return res.status(409).json({ message: "Número de telefone já em uso!" });
      if (registrationExists) return res.status(409).json({ message: "Registro profissional já em uso!" });
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
        password,
        role: "pro"
      });

      const professional = await professionalRepository.createAndSave({
        bio,
        phone_number,
        pro_registration,
        user
      });

      return res.status(201).json(professional);

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erro de server interno" });
    }
  }

  async updateProfessional(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id) || req.user.id;

      if (req.user.role !== "admin" && id !== req.user.id) {
        return res.status(403).json({ message: "Access denied" });
      }

      const professional = await professionalRepository.findById(id);
      if (!professional) return res.status(404).json({ message: "Professional not found" });

      const { name, username, email, password, bio, phone_number } = req.body;
      
      if (email && email !== professional.user.email) {
        if (!verifyEmail(email)) {
          return res.status(400).json({ message: "Invalid email format" });
        }

        const emailExists = await userRepository.findByEmail(email);
        if (emailExists && emailExists.id !== professional.user.id) {
          return res.status(409).json({ message: "Email already in use" });
        }
      }

      if (username && username !== professional.user.username) {
        if (!verifyUsername(username)) {
          return res.status(400).json({ message: "Invalid username format" });
        }

        const usernameExists = await userRepository.findByUsername(username);
        if (usernameExists && usernameExists.id !== professional.user.id) {
          return res.status(409).json({ message: "Username already in use" });
        }
      }

      if (password && !verifyPassword(password)) {
        return res.status(400).json({ message: "Weak password. Follow NIST requirements." });
      }

      if (phone_number && phone_number !== professional.phone_number) {
        if (!verifyPhone(phone_number)) {
          return res.status(400).json({ message: "Invalid phone. Use format: (11) 99999-9999" });
        }

        const phoneExists = await professionalRepository.findByPhone(phone_number);
        if (phoneExists && phoneExists.id !== professional.id) {
          return res.status(409).json({ message: "Phone number already in use" });
        }
      }

      if (name) professional.user.name = name;
      if (email) professional.user.email = email;
      if (username) professional.user.username = username;
      if (password) professional.user.password = password;
      if (bio) professional.bio = bio;
      if (phone_number) professional.phone_number = phone_number;

      await userRepository.saveUser(professional.user);
      const updatedProfessional = await professionalRepository.savePro(professional);

      return res.json(updatedProfessional);

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }


  async deleteProfessional(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id) || req.user.id;

      if (req.user.role !== "admin" && id !== req.user.id) {
        return res.status(403).json({ message: "Access denied" });
      }

      const professional = await professionalRepository.findById(id);
      if (!professional) return res.status(404).json({ message: "Professional not found" });

      await professionalRepository.removePro(professional);
      await userRepository.removeUser(professional.user);

      return res.status(204).send();

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
