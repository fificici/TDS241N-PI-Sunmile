import { Request, Response } from "express"
import { UserRepository } from "../repositories/UserRepository"
import { verifyBirthDate, verifyPassword, verifyCPF, verifyUsername, verifyEmail } from '../helpers/helpers'

const userRepository = new UserRepository()

export class UserController {

    async createUser(req: Request, res: Response): Promise<Response> {

        try {

          const { name, username, email, cpf, birth_date, password } = req.body

          if (!name || !email || !password || !username || !cpf || !birth_date) {

            return res
              .status(400)
              .json({ message: "Faltando informações para cadastro!" })
          }
    
          const userExists = await userRepository.findByEmail(email);
          const usernameExists = await userRepository.findByUsername(username);
          const birthDateValid = verifyBirthDate(birth_date);
          const passwordValid = verifyPassword(password);
          const cpfValid = verifyCPF(cpf);
          const usernameValid = verifyUsername(username);
          const emailValid = verifyEmail(email)

          if (userExists) return res.status(409).json({ message: "Email já em uso!" });
          if (usernameExists) return res.status(409).json({ message: "Nome de usuário já em uso!" });
          if (!birthDateValid) return res.status(409).json({ message: "Data inválida ou menor de idade!" });
          if (!passwordValid) return res.status(409).json({ message: "Insira uma senha mais forte (Padrão NIST)!" });
          if (!cpfValid) return res.status(409).json({ message: "Insira um CPF válido!" });
          if (!usernameValid) return res.status(409).json({ message: "Insira um nome de usuário sem espaços ou caracteres especiais além de ponto (.) e underline (_)!" });
          if (!emailValid) return res.status(409).json({ message: "Insira um email válido!" });
    
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
          return res.status(500).json({ message: "Erro de server interno" })
        }
    }

    async updateUser(req: Request, res: Response): Promise<Response> {
      try {
        const id = Number(req.params.id) || req.user.id;

        if (req.user.role !== "admin" && id !== req.user.id) {
          return res.status(403).json({ message: "Access denied" });
        }

        const user = await userRepository.findById(id);
        if (!user) return res.status(404).json({ message: "User not found" });

        const { name, username, email, password } = req.body;

        if (email && email !== user.email) {
          if (!verifyEmail(email)) {
            return res.status(400).json({ message: "Invalid email format" });
          }

          const emailExists = await userRepository.findByEmail(email);
          if (emailExists && emailExists.id !== user.id) {
            return res.status(409).json({ message: "Email already in use" });
          }
        }

        if (username && username !== user.username) {
          if (!verifyUsername(username)) {
            return res.status(400).json({
              message:
                "Username inválido: não use espaços ou caracteres especiais além de ponto (.) e underline (_)",
            });
          }

          const usernameExists = await userRepository.findByUsername(username);
          if (usernameExists && usernameExists.id !== user.id) {
            return res.status(409).json({ message: "Username already in use" });
          }
        }

        if (password && !verifyPassword(password)) {
          return res.status(400).json({
            message: "Weak password. Follow NIST requirements.",
          });
        }

        if (name) user.name = name;
        if (email) user.email = email;
        if (username) user.username = username;
        if (password) user.password = password;

        const updatedUser = await userRepository.saveUser(user);

        return res.json(updatedUser);

      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
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