import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const getDatabaseConfig = (configService: ConfigService): TypeOrmModuleOptions => {
  // Detectar si estamos en Docker o local basado en variables de entorno
  const isDocker = configService.get<string>('DB_ENVIRONMENT') === 'docker';
  const isDevelopment = configService.get<string>('NODE_ENV') === 'development';
  
  return {
    type: 'postgres',
    host: configService.get<string>('DB_HOST', isDocker ? 'postgres' : 'localhost'),
    port: configService.get<number>('DB_PORT', 5432),
    username: configService.get<string>('DB_USERNAME', 'postgres'),
    password: configService.get<string>('DB_PASSWORD', 'password'),
    database: configService.get<string>('DB_NAME', 'sesion_manager'),
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: configService.get<boolean>('DB_SYNC', isDevelopment), 
    logging: configService.get<boolean>('DB_LOGGING', isDevelopment),
    // Configuraciones adicionales para Docker
    retryAttempts: isDocker ? 10 : 3,
    retryDelay: isDocker ? 3000 : 1000,
    autoLoadEntities: true,
  };
}; 