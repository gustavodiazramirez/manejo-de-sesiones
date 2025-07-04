import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import { Session } from './entities/session.entity';
import { User } from '../user/entities/user.entity';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
    private jwtService: JwtService,
  ) {}

  async createSession(user: User, userAgent?: string, ipAddress?: string): Promise<{
    accessToken: string;
    refreshToken: string;
    sessionId: string;
  }> {
    // Generar tokens
    const accessToken = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = uuidv4();

    // Calcular fecha de expiración (7 días)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Crear sesión en base de datos
    const session = this.sessionRepository.create({
      userId: user.id,
      refreshToken,
      accessToken,
      userAgent,
      ipAddress,
      expiresAt,
      lastUsedAt: new Date(),
    });

    await this.sessionRepository.save(session);

    return {
      accessToken,
      refreshToken,
      sessionId: session.id,
    };
  }

  async refreshAccessToken(refreshTokenDto: RefreshTokenDto): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const session = await this.sessionRepository.findOne({
      where: { refreshToken: refreshTokenDto.refreshToken },
      relations: ['user'],
    });

    if (!session || !session.isActive) {
      throw new UnauthorizedException('Refresh token inválido');
    }

    if (session.expiresAt && session.expiresAt < new Date()) {
      await this.deactivateSession(session.id);
      throw new UnauthorizedException('Refresh token expirado');
    }

    // Generar nuevo access token
    const newAccessToken = this.jwtService.sign({
      sub: session.user.id,
      email: session.user.email,
      role: session.user.role,
    });

    // Generar nuevo refresh token
    const newRefreshToken = uuidv4();

    // Actualizar sesión
    session.accessToken = newAccessToken;
    session.refreshToken = newRefreshToken;
    session.lastUsedAt = new Date();
    session.expiresAt = new Date();
    session.expiresAt.setDate(session.expiresAt.getDate() + 7);

    await this.sessionRepository.save(session);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async deactivateSession(sessionId: string): Promise<void> {
    await this.sessionRepository.update(sessionId, { isActive: false });
  }

  async deactivateAllUserSessions(userId: string): Promise<void> {
    await this.sessionRepository.update(
      { userId, isActive: true },
      { isActive: false }
    );
  }

  async deactivateSessionByRefreshToken(refreshToken: string): Promise<void> {
    const session = await this.sessionRepository.findOne({
      where: { refreshToken },
    });

    if (session) {
      await this.deactivateSession(session.id);
    }
  }

  async getActiveSessions(userId: string): Promise<Session[]> {
    return this.sessionRepository.find({
      where: { userId, isActive: true },
      order: { lastUsedAt: 'DESC' },
    });
  }

  async validateSession(sessionId: string): Promise<Session> {
    const session = await this.sessionRepository.findOne({
      where: { id: sessionId, isActive: true },
      relations: ['user'],
    });

    if (!session) {
      throw new NotFoundException('Sesión no encontrada');
    }

    if (session.expiresAt && session.expiresAt < new Date()) {
      await this.deactivateSession(session.id);
      throw new UnauthorizedException('Sesión expirada');
    }

    return session;
  }

  async cleanupExpiredSessions(): Promise<void> {
    const expiredSessions = await this.sessionRepository.find({
      where: {
        expiresAt: new Date(),
        isActive: true,
      },
    });

    for (const session of expiredSessions) {
      await this.deactivateSession(session.id);
    }
  }
} 