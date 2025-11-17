import { Request, Response } from "express";
import { ProfessionalRepository } from "../repositories/ProfessionalRepository";
import { UserRepository } from "../repositories/UserRepository";
import { verifyBirthDate, verifyPassword, verifyCPF, verifyUsername } from "../helpers/helpers";

const professionalRepository = new ProfessionalRepository();
const userRepository = new UserRepository();

export class ProfessionalController {

  async createProfessional(req: Request, res: Response): Promise<Response> {
    try {
      const { name, username, email, cpf, birth_date, password, bio, pro_registration } = req.body;

      if (!name || !username || !email || !cpf || !birth_date || !password || !pro_registration) {
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

      const professional = await professionalRepository.createAndSave({
        bio,
        pro_registration,
        user
      });

      return res.status(201).json(professional);

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
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

      const { name, username, email, password, bio, pro_registration } = req.body;

      if (name) professional.user.name = name;
      if (password) professional.user.password = password;

      if (email) {
        const emailExists = await userRepository.findByEmail(email);
        if (emailExists && emailExists.id !== professional.user.id) {
          return res.status(409).json({ message: "Email already in use" });
        }
        professional.user.email = email;
      }

      if (username) {
        const usernameExists = await userRepository.findByUsername(username);
        if (usernameExists && usernameExists.id !== professional.user.id) {
          return res.status(409).json({ message: "Username already in use" });
        }
        professional.user.username = username;
      }

      if (bio) professional.bio = bio;
      if (pro_registration) professional.pro_registration = pro_registration;

      await userRepository.saveUser(professional.user);
      const updatedProfessional = await professionalRepository.save(professional);

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

      await professionalRepository.remove(professional);
      await userRepository.removeUser(professional.user);

      return res.status(204).send();

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
