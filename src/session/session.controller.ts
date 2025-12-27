import { Controller, Post, Get, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { SessionService } from './session.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('sessions')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Post('refresh')
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    const tokens = await this.sessionService.refreshAccessToken(refreshTokenDto);
    
    return {
      message: 'Tokens renovados exitosamente',
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  @UseGuards() 
  @Post('logout')
  async logout(@Body() refreshTokenDto: RefreshTokenDto) {
    await this.sessionService.deactivateSessionByRefreshToken(refreshTokenDto.refreshToken);
    
    return {
      message: 'Sesión cerrada exitosamente',
    };
  }

  @Post('logout-all')
  async logoutAll(@Body() body: { userId: string }) {
    await this.sessionService.deactivateAllUserSessions(body.userId);
    
    return {
      message: 'Todas las sesiones han sido cerradas',
    };
  }

  @Get('user/:userId')
  async getUserSessions(@Param('userId') userId: string) {
    const sessions = await this.sessionService.getActiveSessions(userId);
    
    return {
      sessions,
      total: sessions.length,
    };
  }

  @Delete(':sessionId')
  async deleteSession(@Param('sessionId') sessionId: string) {
    await this.sessionService.deactivateSession(sessionId);
    
    return {
      message: 'Sesión eliminada exitosamente',
    };
  }

  @Post('cleanup')
  async cleanupExpiredSessions() {
    await this.sessionService.cleanupExpiredSessions();
    
    return {
      message: 'Limpieza de sesiones expiradas completada',
    };
  }
} 