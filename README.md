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
