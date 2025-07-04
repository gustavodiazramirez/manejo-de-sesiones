<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

# Sesión Manager API

API completa para manejo de sesiones con tokens JWT y refresh tokens usando NestJS, TypeORM y PostgreSQL

## Características

- ✅ Registro y autenticación de usuarios
- ✅ Manejo de sesiones con tokens JWT
- ✅ Refresh tokens para renovar sesiones
- ✅ Gestión de múltiples sesiones por usuario
- ✅ Limpieza automática de sesiones expiradas
- ✅ Documentación con Swagger
- ✅ Validación de datos con class-validator
- ✅ Configuración con variables de entorno
- ✅ Estructura modular organizada

## Estructura del Proyecto

```
src/
├── config/
│   ├── database.config.ts    # Configuración de TypeORM
│   └── jwt.config.ts         # Configuración de JWT
├── user/
│   ├── entities/
│   │   └── user.entity.ts    # Entidad Usuario
│   ├── dto/
│   │   ├── create-user.dto.ts
│   │   └── login-user.dto.ts
│   ├── user.controller.ts    # Controlador de usuarios
│   ├── user.service.ts       # Servicio de usuarios
│   └── user.module.ts        # Módulo de usuarios
├── session/
│   ├── entities/
│   │   └── session.entity.ts # Entidad Sesión
│   ├── dto/
│   │   └── refresh-token.dto.ts
│   ├── session.controller.ts # Controlador de sesiones
│   ├── session.service.ts    # Servicio de sesiones
│   └── session.module.ts     # Módulo de sesiones
├── app.module.ts             # Módulo principal
└── main.ts                   # Punto de entrada
```

## Instalación

1. **Clonar el repositorio**
```bash
git clone <tu-repositorio>
cd sesion-manager
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp env.example .env
```

Editar el archivo `.env` con tus configuraciones:
```env
# Base de Datos
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=tu_password
DB_NAME=sesion_manager
DB_SYNC=true

# JWT
JWT_SECRET=tu-super-secreto-jwt
JWT_REFRESH_SECRET=tu-super-secreto-refresh-jwt
```

4. **Configurar PostgreSQL**
- Crear base de datos: `sesion_manager`
- Asegurar que las credenciales en `.env` sean correctas

5. **Ejecutar la aplicación**
```bash
# Desarrollo
npm run start:dev

# Producción
npm run build
npm run start:prod
```

## Endpoints de la API

### Usuarios

- `POST /users/register` - Registrar nuevo usuario
- `POST /users/login` - Iniciar sesión
- `GET /users` - Obtener todos los usuarios
- `GET /users/:id` - Obtener usuario por ID
- `PUT /users/:id` - Actualizar usuario
- `DELETE /users/:id` - Eliminar usuario

### Sesiones

- `POST /sessions/refresh` - Renovar access token
- `POST /sessions/logout` - Cerrar sesión
- `POST /sessions/logout-all` - Cerrar todas las sesiones
- `GET /sessions/user/:userId` - Obtener sesiones activas
- `DELETE /sessions/:sessionId` - Eliminar sesión específica
- `POST /sessions/cleanup` - Limpiar sesiones expiradas

## Flujo de Autenticación

1. **Registro**: Usuario se registra con email y contraseña
2. **Login**: Usuario inicia sesión y recibe access token + refresh token
3. **Acceso**: Usar access token en header `Authorization: Bearer <token>`
4. **Renovación**: Cuando el access token expira, usar refresh token para obtener nuevos tokens
5. **Logout**: Invalidar refresh token para cerrar sesión

## Documentación

La documentación interactiva está disponible en:
- **Swagger UI**: `http://localhost:3000/api`

## Variables de Entorno

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `DB_HOST` | Host de PostgreSQL | localhost |
| `DB_PORT` | Puerto de PostgreSQL | 5432 |
| `DB_USERNAME` | Usuario de PostgreSQL | postgres |
| `DB_PASSWORD` | Contraseña de PostgreSQL | - |
| `DB_NAME` | Nombre de la base de datos | sesion_manager |
| `DB_SYNC` | Sincronizar esquemas | false |
| `JWT_SECRET` | Secreto para JWT | - |
| `JWT_REFRESH_SECRET` | Secreto para refresh tokens | - |
| `JWT_EXPIRES_IN` | Expiración del access token | 15m |
| `JWT_REFRESH_EXPIRES_IN` | Expiración del refresh token | 7d |

## Seguridad

- ✅ Contraseñas hasheadas con bcrypt
- ✅ Tokens JWT con expiración
- ✅ Refresh tokens únicos por sesión
- ✅ Validación de datos de entrada
- ✅ Limpieza automática de sesiones expiradas
- ✅ Soporte para múltiples sesiones por usuario

## Scripts Disponibles

```bash
npm run start:dev    # Desarrollo con hot reload
npm run build        # Compilar para producción
npm run start:prod   # Ejecutar en producción
npm run test         # Ejecutar tests
npm run lint         # Linting del código
```

## Tecnologías Utilizadas

- **NestJS** - Framework de Node.js
- **TypeORM** - ORM para TypeScript
- **PostgreSQL** - Base de datos
- **JWT** - Autenticación con tokens
- **bcryptjs** - Hash de contraseñas
- **class-validator** - Validación de datos
- **Swagger** - Documentación de API
