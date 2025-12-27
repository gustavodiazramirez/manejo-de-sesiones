import { Injectable, ConflictException, NotFoundException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User, UserRole } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Registra un nuevo usuario en el sistema
   * Por defecto, el rol será USER ('usuario')
   * @param createUserDto - Datos del nuevo usuario
   * @returns Usuario creado (sin contraseña)
   */
  async register(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    // Validar que el email no esté registrado
    await this.validateEmailAvailability(createUserDto.email);

    // Crear usuario con rol por defecto USER
    const hashedPassword = await this.hashPassword(createUserDto.password);
    
    const newUser = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
      role: UserRole.USER, // Por defecto siempre USER
      isActive: true,
    });

    const savedUser = await this.userRepository.save(newUser);
    const { password, ...userWithoutPassword } = savedUser;
    
    return userWithoutPassword;
  }

  /**
   * Valida las credenciales de un usuario durante el login
   * Verifica email, contraseña y estado activo del usuario
   * @param loginUserDto - Credenciales del usuario
   * @returns Usuario validado
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
      throw new UnauthorizedException('Usuario desactivado. Contacte al administrador');
    }

    return user;
  }

  /**
   * Actualiza la fecha del último login exitoso del usuario
   * @param userId - ID del usuario
   */
  async updateLastLogin(userId: string): Promise<void> {
    await this.userRepository.update(userId, {
      lastLoginAt: new Date(),
    });
  }

  /**
   * Busca un usuario por su email
   * @param email - Email del usuario
   * @returns Usuario encontrado o null
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  /**
   * Busca un usuario por su ID
   * @param id - ID del usuario
   * @returns Usuario encontrado o null (sin contraseña)
   */
  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
      select: [
        'id',
        'email',
        'firstName',
        'lastName',
        'role',
        'isActive',
        'lastLoginAt',
        'createdAt',
        'updatedAt',
      ],
    });
  }

  /**
   * Obtiene todos los usuarios con paginación y filtros
   * @param page - Número de página
   * @param limit - Cantidad de usuarios por página
   * @param search - Término de búsqueda
   * @param role - Filtro por rol
   * @param isActive - Filtro por estado activo
   * @returns Lista de usuarios y total
   */
  async findAll(
    page = 1,
    limit = 10,
    search = '',
    role?: UserRole,
    isActive?: boolean,
  ): Promise<{ users: User[]; total: number }> {
    const skip = (page - 1) * limit;
    const query = this.userRepository
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.email',
        'user.firstName',
        'user.lastName',
        'user.role',
        'user.isActive',
        'user.lastLoginAt',
        'user.createdAt',
        'user.updatedAt',
      ]);

    // Aplicar filtro de búsqueda
    if (search) {
      const searchTerm = `%${search}%`;
      query.andWhere(
        `(
          user.email ILIKE :search OR 
          user.firstName ILIKE :search OR 
          user.lastName ILIKE :search
        )`,
        { search: searchTerm },
      );
    }

    // Aplicar filtro de rol
    if (role) {
      query.andWhere('user.role = :role', { role });
    }

    // Aplicar filtro de estado activo
    if (isActive !== undefined) {
      query.andWhere('user.isActive = :isActive', { isActive });
    }

    const [users, total] = await query
      .skip(skip)
      .take(limit)
      .orderBy('user.createdAt', 'DESC')
      .getManyAndCount();

    return { users, total };
  }

  /**
   * Crea un nuevo usuario (solo para administradores)
   * Permite especificar el rol del usuario
   * @param createUserDto - Datos del usuario
   * @returns Usuario creado
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    // Validar que el email no esté registrado
    await this.validateEmailAvailability(createUserDto.email);

    // Hash de contraseña
    const hashedPassword = await this.hashPassword(createUserDto.password);

    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
      role: createUserDto.role || UserRole.USER, 
    });

    return this.userRepository.save(user);
  }

  /**
   * Actualiza los datos de un usuario existente
   * @param id - ID del usuario a actualizar
   * @param updateData - Datos a actualizar
   * @returns Usuario actualizado
   */
  async update(id: string, updateData: Partial<User>): Promise<User> {
    // Verificar que el usuario existe
    const userEntity = await this.userRepository.findOne({ where: { id } });
    if (!userEntity) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Filtrar solo los campos definidos (no undefined ni null)
    const filteredData: Record<string, any> = {};
    Object.keys(updateData).forEach((key) => {
      const value = (updateData as Record<string, any>)[key];
      if (value !== undefined && value !== null && value !== '') {
        filteredData[key] = value;
      }
    });

    if (Object.keys(filteredData).length === 0) {
      throw new BadRequestException('No se proporcionaron datos válidos para actualizar');
    }

    // Si se intenta actualizar el email, verificar disponibilidad
    if (filteredData.email && filteredData.email !== userEntity.email) {
      await this.validateEmailAvailability(filteredData.email, id);
    }

    // Si se actualiza la contraseña, encriptarla
    if (filteredData.password) {
      filteredData.password = await this.hashPassword(filteredData.password);
    }

    // Actualizar usuario
    await this.userRepository.update(id, filteredData);
    
    const updatedUser = await this.findById(id);
    if (!updatedUser) {
      throw new NotFoundException('Error al actualizar usuario');
    }
    
    return updatedUser;
  }

  /**
   * Desactiva un usuario (soft delete)
   * @param id - ID del usuario
   */
  async deactivate(id: string): Promise<void> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    await this.userRepository.update(id, { isActive: false });
  }

  /**
   * Activa un usuario previamente desactivado
   * @param id - ID del usuario
   */
  async activate(id: string): Promise<void> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    await this.userRepository.update(id, { isActive: true });
  }

  /**
   * Valida que un email esté disponible para registro
   * @param email - Email a validar
   * @param excludeUserId - ID del usuario a excluir de la validación (para updates)
   */
  private async validateEmailAvailability(email: string, excludeUserId?: string): Promise<void> {
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser && (!excludeUserId || existingUser.id !== excludeUserId)) {
      throw new ConflictException('El email ya está registrado');
    }
  }

  /**
   * Genera un hash seguro de la contraseña
   * @param password - Contraseña en texto plano
   * @returns Hash de la contraseña
   */
  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }
}
