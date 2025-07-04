import { JwtModuleOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

export const getJwtConfig = (configService: ConfigService): JwtModuleOptions => ({
  secret: configService.get<string>('JWT_SECRET', 'tu-super-secreto-jwt-aqui'),
  signOptions: {
    expiresIn: configService.get<string>('JWT_EXPIRES_IN', '15m'), // Token de acceso
  },
});

export const getRefreshTokenConfig = (configService: ConfigService) => ({
  secret: configService.get<string>('JWT_REFRESH_SECRET', 'tu-super-secreto-refresh-jwt-aqui'),
  expiresIn: configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d'), // Refresh token
}); 