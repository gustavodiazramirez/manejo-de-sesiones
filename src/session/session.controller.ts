import { Controller, Post, Get, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SessionService } from './session.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@ApiTags('sesiones')
@Controller('sessions')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Post('refresh')
  @ApiOperation({ summary: 'Renovar access token usando refresh token' })
  @ApiResponse({ status: 200, description: 'Tokens renovados exitosamente' })
  @ApiResponse({ status: 401, description: 'Refresh token inválido o expirado' })
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    const tokens = await this.sessionService.refreshAccessToken(refreshTokenDto);
    
    return {
      message: 'Tokens renovados exitosamente',
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  @Post('logout')
  @ApiOperation({ summary: 'Cerrar sesión' })
  @ApiResponse({ status: 200, description: 'Sesión cerrada exitosamente' })
  async logout(@Body() refreshTokenDto: RefreshTokenDto) {
    await this.sessionService.deactivateSessionByRefreshToken(refreshTokenDto.refreshToken);
    
    return {
      message: 'Sesión cerrada exitosamente',
    };
  }

  @Post('logout-all')
  @ApiOperation({ summary: 'Cerrar todas las sesiones del usuario' })
  @ApiResponse({ status: 200, description: 'Todas las sesiones cerradas' })
  async logoutAll(@Body() body: { userId: string }) {
    await this.sessionService.deactivateAllUserSessions(body.userId);
    
    return {
      message: 'Todas las sesiones han sido cerradas',
    };
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Obtener sesiones activas del usuario' })
  @ApiResponse({ status: 200, description: 'Sesiones activas' })
  async getUserSessions(@Param('userId') userId: string) {
    const sessions = await this.sessionService.getActiveSessions(userId);
    
    return {
      sessions,
      total: sessions.length,
    };
  }

  @Delete(':sessionId')
  @ApiOperation({ summary: 'Eliminar sesión específica' })
  @ApiResponse({ status: 200, description: 'Sesión eliminada' })
  async deleteSession(@Param('sessionId') sessionId: string) {
    await this.sessionService.deactivateSession(sessionId);
    
    return {
      message: 'Sesión eliminada exitosamente',
    };
  }

  @Post('cleanup')
  @ApiOperation({ summary: 'Limpiar sesiones expiradas' })
  @ApiResponse({ status: 200, description: 'Limpieza completada' })
  async cleanupExpiredSessions() {
    await this.sessionService.cleanupExpiredSessions();
    
    return {
      message: 'Limpieza de sesiones expiradas completada',
    };
  }
} 