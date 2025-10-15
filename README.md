# Prueba Técnica — Sistema Full Stack (FastAPI + React + PostgreSQL + Docker)

Este proyecto es un **sistema web completo** para la gestión de **fichajes, vacaciones y recursos humanos**.  
Está diseñado como **prueba técnica** y viene **completamente dockerizado**, listo para ejecutarse con un solo comando.

---

## 🚀 Objetivo de la prueba

El objetivo principal es demostrar la capacidad de desarrollar una **aplicación web funcional**, con:

- Gestión de **usuarios** con distintos niveles de permisos (Empleado y RRHH).
- Registro de **fichajes** (entrada/salida) y gestión de correcciones.
- Solicitudes de **vacaciones y ausencias** con workflow de aprobación.
- Implementación de un sistema **seguro y escalable**, listo para desplegarse con Docker.

---

## 🛠 Tecnologías utilizadas

**Elegí este stack porque llevo trabajando con él los últimos 2 años y me permite entregar proyectos sólidos, escalables y mantenibles:**

**Backend:**

- **FastAPI** — framework rápido, moderno y fácil de mantener.
- **SQLAlchemy** — ORM para manejar tablas y relaciones de manera eficiente.
- **Alembic** — control de migraciones de base de datos.
- **PostgreSQL** — base de datos robusta y confiable.
- **python-jose + bcrypt** — autenticación con JWT y contraseñas seguras.
- **pydantic** — validación y serialización de datos.

**Frontend:**

- **React + Vite + TypeScript** — desarrollo ágil y con tipado estático.
- **TailwindCSS + shadcn/ui** — estilos consistentes y rápidos de implementar.
- **React Hook Form + Zod** — manejo de formularios y validación robusta.
- **Axios + JWT** — comunicación segura con la API.

**Infraestructura:**

- **Docker + docker-compose** — todo el entorno aislado y reproducible.
- **Volúmenes persistentes** — los datos de la base se mantienen entre reinicios.
- **Healthchecks y dependencias** — los servicios se levantan en el orden correcto (DB → API → Frontend).

---

## ⚙️ Funcionalidades principales

- **Sistema de usuarios** (2 niveles de permisos)
  1- **Empleado**

- Acciones permitidas:

- Fichar entrada/salida (marcar timestamp de inicio y fin de jornada).

- Consultar su historial de fichajes en una tabla.

- Solicitar correcciones de fichajes.

- Solicitar vacaciones o ausencias.

- Ver dashboard con:

-Horas trabajadas semanalmente.

- Horas trabajadas mensualmente.

- Editar su propio perfil:

- Campos editables: fullname, username, email.

- Pendiente: editar contraseña (password).

2️- **RRHH**

- Todos los permisos de empleado, más:

- Gestión completa de fichajes:

- Aprobar/rechazar solicitudes de corrección.

- Visualización de fichajes de todos los empleados.

- Gestión de solicitudes de vacaciones/ausencias:

- Aprobar/rechazar solicitudes con comentarios.

- Ver el historial y estado de todas las solicitudes.

- Creación y edición de usuarios.

- Asignación de roles (Empleado o RRHH).

- Configuración del sistema (parámetros generales, límites de días de vacaciones, etc.).

- Acceso a reportes y estadísticas (horas trabajadas, ausencias, balances, etc.).

- Módulo de fichajes

- Registro automático de entrada y salida con timestamp.

- Visualización de historial personal:

- Buscador de empleados (solo RRHH):

- Filtrar fichajes por empleado.

- **Solicitudes de corrección:**

- Empleado solicita corrección indicando la fecha y motivo.

- RRHH aprueba o rechaza con comentario.

- Módulo de vacaciones y ausencias

- Solicitud de vacaciones/ausencias con:

- Fecha de inicio y fin.

- Motivo.

**Sistema de aprobación/rechazo:**

- RRHH aprueba o rechaza la solicitud.

- Se pueden añadir comentarios explicativos.

- Visualización del estado:

- Pendiente, aprobada, rechazada.

**Balance de días disponibles**

- Tabla de saldo de días de vacaciones por empleado.

- Visualización de progreso (porcentaje usado).

- Los balances se actualizan al aprobar solicitudes.

**Posibles mejoras**

Implementar edición de contraseña en el perfil de empleado.

Mejorar dashboard de balances de vacaciones.

Implementar filtros en todas las tablas por fecha (fichajes, solicitudes, balances).

Posible sistema de notificaciones para avisar a empleados sobre aprobaciones/rechazos.

**Datos de prueba incluidos**

- 3–4 empleados y 1 usuario RRHH, con fichajes y solicitudes de ejemplo para facilitar la evaluación.

---

## 📝 Cómo levantar el proyecto

1. **Clonar el repositorio**

   ```bash
   git clone https://github.com/mariantonieta/prueba_tecnica_fichajes_rrhh.git
   cd prueba_tecnica_fichajes_rrhh

   ```

2. **Configurar variables de entorno**

- Copia el archivo de ejemplo y renómbralo a .env:

  ```bash
  cp .env.example .env
  Levantar los servicios con Docker
  ```

3. **Ejecuta el contenedor**

   ```bash

   ```

- docker compose up --build

  ```

  ```

4. **Listo-Accede los links**
   Frontend: http://localhost:3000

Backend (API Docs): http://localhost:8000/docs

Base de datos: PostgreSQL corriendo en localhost:5432

## 👥 Usuarios de prueba (Seed Data)

El proyecto incluye datos iniciales cargados automáticamente al ejecutar el contenedor por primera vez.  
Esto permite probar la aplicación sin necesidad de crear usuarios manualmente.

### 🔑 Credenciales de acceso

| Rol         | Nombre completo      | Usuario (username) | Email                       | Contraseña |
| ----------- | -------------------- | ------------------ | --------------------------- | ---------- |
| 🧑‍💼 RRHH     | Nerea López          | `nerea_rrhh`       | `nerea@empresa.com`         | `123456`   |
| 👩‍💻 Empleado | Mariantonieta Chacon | `mariantonieta`    | `mariantonieta@empresa.com` | `123456`   |
| 👩‍💻 Empleado | Luisa Fernández      | `luisa`            | `luisa@empresa.com`         | `123456`   |
| 👨‍💻 Empleado | Juan Morales         | `juan`             | `juan@empresa.com`          | `123456`   |

### 🗂️ Datos pre-cargados

- **Fichajes:** Cada empleado tiene un registro de entrada y salida del 10 de octubre de 2025.
- **Solicitudes de vacaciones y ausencias:**
  - Mariantonieta → vacaciones del 20 al 22 de octubre de 2025.
  - Luisa → ausencia por enfermedad del 2 al 3 de noviembre de 2025.
  - Juan → permiso personal el 10 de noviembre de 2025.
- **Ajustes de fichaje:**
  - Mariantonieta → corrección de entrada.
  - Luisa → corrección de salida.
- **Balance de vacaciones:** Todos los empleados comienzan con 40 horas semanales y su correspondiente saldo de días.
