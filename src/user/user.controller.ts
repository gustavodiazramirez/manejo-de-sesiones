import { Controller, Post, Get, Body, Param, UseGuards, Request, Patch, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { SessionService } from '../session/session.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from '../common/roles.decorator';
import { RolesGuard } from '../common/roles.guard';
import { JwtAuthGuard } from './jwt.strategy';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly sessionService: SessionService,
  ) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.register(createUserDto);

    return {
      message: 'Usuario registrado exitosamente',
      user,
    };
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto, @Request() req: any) {
    const user = await this.userService.validateUser(loginUserDto);
    await this.userService.updateLastLogin(user.id);
    const session = await this.sessionService.createSession(user, req.headers['user-agent'], req.ip);
    const { password, ...userWithoutPassword } = user;

    return {
      message: 'Login exitoso',
      user: userWithoutPassword,
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get()
  async findAll(@Query('page') page?: string, @Query('limit') limit?: string, @Query('search') search?: string, @Query('role') role?: string, @Query('status') status?: string) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    const searchStr = search || '';
    const roleFilter = role as any;
    let isActiveFilter: boolean | undefined = undefined;
    if (status === 'active') {
      isActiveFilter = true;
    } else if (status === 'inactive') {
      isActiveFilter = false;
    }

    const { users, total } = await this.userService.findAll(pageNum, limitNum, searchStr, roleFilter, isActiveFilter);
    return {
      users,
      total,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'usuario')
  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req: any) {
    // Solo admin o el propio usuario pueden ver su info
    if (req.user.role !== 'admin' && req.user.id !== id) {
      return { message: 'No autorizado' };
    }
    const user = await this.userService.findById(id);
    if (!user) {
      return { message: 'Usuario no encontrado' };
    }
    return user;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'usuario')
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateData: UpdateUserDto, @Request() req: any) {
    const user = await this.userService.update(id, updateData);
    const { password, ...userWithoutPassword } = user;
    return {
      message: 'Usuario actualizado exitosamente',
      user: userWithoutPassword,
    };
  }
}
