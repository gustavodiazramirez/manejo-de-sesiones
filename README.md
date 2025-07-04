# 🛡️ Gestión de Sesiones: ¡Tu Seguridad y Control en el Proyecto!

¡Bienvenido! Aquí descubrirás cómo funciona la **gestión de sesiones** en este sistema, cómo se relaciona con los usuarios y por qué es clave para la seguridad y experiencia de tu app. 🚀

---

## 🗄️ ¿Qué es la tabla `session`?
La tabla `session` es como el registro de entradas y salidas de los usuarios. Cada vez que alguien inicia sesión, se crea una "ficha" que guarda:

- 🆔 **id**: Identificador único de la sesión.
- 👤 **userId**: ¿A qué usuario pertenece esta sesión? (relación con la tabla `user`).
- 🔑 **refreshToken**: Token especial para renovar el acceso sin volver a loguearse.
- 🕒 **createdAt**: Cuándo se creó la sesión.
- ⏰ **expiresAt**: Cuándo expira la sesión.
- ✅ **isActive**: ¿Sigue activa esta sesión?

Así, puedes tener varias sesiones activas (por ejemplo, en tu compu y tu celular al mismo tiempo).

---

## 🔗 Relación con la entidad `User`
Cada sesión está conectada a un usuario. Esto permite:
- Ver todas las sesiones activas de un usuario 👀
- Cerrar todas las sesiones de un usuario (logout global) 🔒
- Eliminar o limpiar sesiones específicas o expiradas 🧹

**¡Un usuario puede tener varias sesiones activas a la vez!**

---

## ⚙️ Servicios principales de sesión

### 1️⃣ Renovar access token (`POST /sessions/refresh`)
- 🔄 Usa el `refreshToken` para obtener un nuevo access token sin volver a poner la contraseña.
- Solo funciona si la sesión está activa y no ha expirado.

**🧩 Caso hipotético:**
> Un usuario está usando la app y, después de un tiempo, su access token expira (por seguridad). Cuando intenta hacer una acción protegida, la app detecta el error de expiración y automáticamente (sin que el usuario lo note) envía el refresh token al backend para obtener un nuevo access token y continuar la experiencia sin interrupciones.

### 2️⃣ Cerrar sesión (`POST /sessions/logout`)
- 🚪 Cierra una sesión específica (por ejemplo, si cierras sesión en un dispositivo).
- Invalida el `refreshToken` y marca la sesión como inactiva.

**🧩 Caso hipotético:**
> El usuario hace clic en "Cerrar sesión" en la app web o móvil. La app envía el refresh token de la sesión actual al backend para invalidarla y cerrar la sesión en ese dispositivo.

### 3️⃣ Cerrar todas las sesiones (`POST /sessions/logout-all`)
- 💣 Cierra todas las sesiones activas de un usuario (logout global).
- Útil si el usuario quiere salir de todos los dispositivos.

**🧩 Caso hipotético:**
> El usuario nota actividad sospechosa en su cuenta y decide cerrar sesión en todos los dispositivos desde la sección de seguridad de su perfil. La app envía su userId y el backend cierra todas sus sesiones activas.

### 4️⃣ Obtener sesiones activas (`GET /sessions/user/{userId}`)
- 📋 Muestra todas las sesiones activas de un usuario.

**🧩 Caso hipotético:**
> En la sección de "Dispositivos conectados" de la app, el usuario puede ver desde dónde ha iniciado sesión y en qué dispositivos sigue conectado. Esto se logra consultando este endpoint.

### 5️⃣ Eliminar sesión específica (`DELETE /sessions/{sessionId}`)
- 🗑️ Elimina una sesión concreta (por seguridad o administración).

**🧩 Caso hipotético:**
> El usuario ve que hay una sesión activa en un dispositivo que no reconoce y decide eliminarla desde la app, seleccionando la sesión y enviando la petición para eliminarla.

### 6️⃣ Limpiar sesiones expiradas (`POST /sessions/cleanup`)
- 🧹 Borra todas las sesiones que ya expiraron, manteniendo la base de datos limpia.

**🧩 Caso hipotético:**
> El sistema ejecuta automáticamente (por ejemplo, con un cron job) esta petición cada noche para eliminar todas las sesiones que ya expiraron, optimizando el rendimiento y la seguridad.

---

## 🔄 Flujo típico de autenticación y manejo de sesión

1. **Login:** El usuario inicia sesión y se crea una nueva sesión con un refresh token. ✨
2. **Renovación:** Cuando el access token expira, el usuario puede renovarlo usando el refresh token. 🔄
3. **Logout:** El usuario puede cerrar una sesión específica o todas sus sesiones. 🚪
4. **Limpieza:** El sistema puede limpiar sesiones expiradas automáticamente. 🧹

---

## 🛡️ Seguridad
- Los refresh tokens se guardan de forma segura y se invalidan al cerrar sesión. 🔐
- No se permite renovar tokens con sesiones expiradas o inactivas. 🚫
- Cada usuario puede tener múltiples sesiones activas, pero cada sesión es única y controlada. 🧑‍💻

---

## 📊 Diagrama de relación

```mermaid
erDiagram
    USER ||--o{ SESSION : tiene
    USER {
      string id
      string email
      ...
    }
    SESSION {
      string id
      string refreshToken
      datetime createdAt
      datetime expiresAt
      boolean isActive
      string userId
    }
```

---

## 📝 Resumen
La tabla de sesiones es el corazón del control de acceso: permite saber quién está conectado, desde dónde, y gestionar la seguridad de todos los usuarios. ¡Así tu app es más segura, flexible y fácil de administrar! 🎉

---

## ✍️ Desarrollado por Gustavo Díaz 