import { Controller, Post, Get, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from './user.service';
import { SessionService } from '../session/session.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from './entities/user.entity';

@ApiTags('usuarios')
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly sessionService: SessionService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Registrar nuevo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente' })
  @ApiResponse({ status: 409, description: 'Email ya registrado' })
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);
    
    // Omitir password de la respuesta
    const { password, ...userWithoutPassword } = user;
    
    return {
      message: 'Usuario registrado exitosamente',
      user: userWithoutPassword,
    };
  }

  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiResponse({ status: 200, description: 'Login exitoso' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Request() req: any,
  ) {
    const user = await this.userService.validateUser(loginUserDto);
    
    // Actualizar último login
    await this.userService.updateLastLogin(user.id);
    
    // Crear sesión
    const session = await this.sessionService.createSession(
      user,
      req.headers['user-agent'],
      req.ip,
    );

    // Omitir password de la respuesta
    const { password, ...userWithoutPassword } = user;
    
    return {
      message: 'Login exitoso',
      user: userWithoutPassword,
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  @ApiResponse({ status: 200, description: 'Lista de usuarios' })
  async findAll() {
    const users = await this.userService.findAll();
    return {
      users,
      total: users.length,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener usuario por ID' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findById(id);
    if (!user) {
      return { message: 'Usuario no encontrado' };
    }
    
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar usuario' })
  @ApiResponse({ status: 200, description: 'Usuario actualizado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async update(@Param('id') id: string, @Body() updateData: Partial<User>) {
    const user = await this.userService.update(id, updateData);
    const { password, ...userWithoutPassword } = user;
    return {
      message: 'Usuario actualizado exitosamente',
      user: userWithoutPassword,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar usuario' })
  @ApiResponse({ status: 200, description: 'Usuario eliminado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async remove(@Param('id') id: string) {
    await this.userService.delete(id);
    return { message: 'Usuario eliminado exitosamente' };
  }
} 