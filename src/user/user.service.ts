import { Injectable, ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  /**
   * Crea un nuevo usuario en la base de datos.
   * Valida que el email no esté registrado previamente y encripta la contraseña antes de guardar.
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return this.userRepository.save(user);
  }

  /**
   * Busca un usuario por su email.
   * Retorna el usuario o null si no existe.
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  /**
   * Busca un usuario por su ID.
   * Retorna el usuario o null si no existe.
   */
  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
    });
  }

  /**
   * Valida las credenciales de un usuario durante el login.
   * Verifica email, contraseña y estado activo del usuario.
   */
  async validateUser(loginUserDto: LoginUserDto): Promise<User> {
    const user = await this.findByEmail(loginUserDto.email);
    
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(loginUserDto.password, user.password);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Usuario inactivo');
    }

    return user;
  }

  /**
   * Actualiza la fecha del último login exitoso del usuario.
   */
  async updateLastLogin(userId: string): Promise<void> {
    await this.userRepository.update(userId, {
      lastLoginAt: new Date(),
    });
  }

  /**
   * Obtiene todos los usuarios registrados (campos seleccionados).
   */
  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      select: ['id', 'email', 'firstName', 'lastName', 'role', 'isActive', 'lastLoginAt', 'createdAt'],
    });
  }

  /**
   * Actualiza los datos de un usuario existente.
   * Lanza excepción si el usuario no existe.
   */
  async update(id: string, updateData: Partial<User>): Promise<User> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    await this.userRepository.update(id, updateData);
    const updatedUser = await this.findById(id);
    if (!updatedUser) {
      throw new NotFoundException('Error al actualizar usuario');
    }
    return updatedUser;
  }

  /**
   * Elimina un usuario por su ID.
   * Lanza excepción si el usuario no existe.
   */
  async delete(id: string): Promise<void> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    await this.userRepository.delete(id);
  }
} 