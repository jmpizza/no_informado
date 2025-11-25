import bcrypt from "bcryptjs";
import LoginDTO from "../dto/LoginDTO.js";
import { ValidationException } from "../exceptions/ValidationException.js";

export default class AuthService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async authUser(id, password) {
    const dto = new LoginDTO(id, password);
    dto.validate();
    
    const user = await this.userRepository.findById(dto.id);
    if (!user) {
      throw new ValidationException("Usuario no encontrado");
    }

    if (!user.status) {
      throw new ValidationException("Usuario inactivo");
    }

    const passwordMatch = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatch) {
      throw new ValidationException("Contraseña incorrecta");
    }

    return user;
  }
}
