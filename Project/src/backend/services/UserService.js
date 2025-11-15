import bcrypt from "bcryptjs";
import CreateUserDTO from "../dto/CreateUserDTO.js";
import { ValidationException } from "../exceptions/ValidationExeption.js";


export default class UserService {
    constructor(userRepository, roleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    async CreateUser(data) {
        const dto = new CreateUserDTO(data);
        dto.validate();

        const existingUser = await this.userRepository.findById(dto.id);
        if (existingUser) {
            throw new ValidationException("El usuario ya existe");
        }

        const existingEmail = await this.userRepository.findByEmail(dto.email);
        if (existingEmail) {
            throw new ValidationException("El email ya esta registrado");
        }

        const role = await this.roleRepository.findById(dto.rol_id);
        if (!role) {
            throw new ValidationException("El rol no existe");
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);

        const userData = {
            id: dto.id,
            name: dto.name, 
            last_name: dto.last_name,
            email: dto.email,
            password: hashedPassword,
            rol_id: dto.rol_id,
            status: true
        };
        return await this.userRepository.create(userData);
    }

    async authenticateUser(id, password) {
        const user = await this.userRepository.findById(id);

        if (!user) {
            throw new ValidationException("Usuario no encontrado");
        }

        if (!user.status) {
            throw new ValidationException("Usuario inactivo");
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            throw new ValidationException("Contraseña incorrecta");
        }

        return user;
    }
}