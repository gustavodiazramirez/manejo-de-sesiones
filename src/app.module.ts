import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getDatabaseConfig } from './config/database.config';

// Detectar el entorno para cargar el archivo .env correcto
const getEnvPath = (): string => {
  const environment = process.env.DB_ENVIRONMENT || process.env.NODE_ENV;

  if (environment === 'docker') {
    return '.env.docker';
  } else if (environment === 'local' || environment === 'development') {
    return '.env.local';
  }

  // Fallback al .env por defecto
  return '.env';
};

// Módulos de la app
import { UserModule } from './user/user.module';
import { SessionModule } from './session/session.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: getEnvPath(),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        getDatabaseConfig(configService),
      inject: [ConfigService],
    }),
    UserModule,
    SessionModule,
  ],
})
export class AppModule {}
