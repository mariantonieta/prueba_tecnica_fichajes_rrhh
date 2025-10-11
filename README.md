# Prueba Técnica — Sistema Full Stack (FastAPI + React + PostgreSQL + Docker)

Este proyecto implementa un sistema web completo para gestión de **fichajes, vacaciones y recursos humanos**.  
Forma parte de una **prueba técnica**, y está completamente **dockerizado** para que se pueda levantar con un solo comando.

---

## Cómo levantar el proyecto

1. **Clonar el repositorio**

   ```bash
   git clone https://github.com/mariantonieta/prueba_tecnica_fichajes_rrhh.git
   cd prueba_tecnica_fichajes_rrhh

   ```

2. **Configurar las variables de entorno**

   ```bash
   Copiar código
   cp .env.example .env

   ```

3. **Levantar todo con Docker**

   ```bash
   Copiar código
   docker-compose up --build
   Servicios activos
   ```

- Frontend → http://localhost:3000

- Backend (API Docs) → http://localhost:8000/docs

- Base de datos → PostgreSQL en localhost:5432

- Stack tecnológico: Decidí utilizar estas tecnologías porque son las que llevo usando durante los últimos 2 años y me permiten ser más eficiente y entregar un proyecto sólido:

- Backend
  FastAPI — rápido, moderno y fácil de mantener.

SQLAlchemy — ORM para manejar las tablas y relaciones.

Alembic — control de migraciones.

PostgreSQL — base de datos robusta y confiable.

python-jose + bcrypt — autenticación con JWT y contraseñas seguras.

- Frontend
  React + Vite + TypeScript — desarrollo ágil y tipado estático.

TailwindCSS — estilos rápidos, limpios y consistentes.

- Infraestructura
  Docker + docker-compose — todo el entorno aislado y fácil de levantar.

Volúmenes persistentes — los datos de la base se mantienen entre reinicios.

Healthchecks y dependencias — los servicios se inician en orden (DB → API → Frontend).

- Decisiones de diseño
  Arquitectura limpia: separación clara entre rutas, modelos, esquemas y servicios.

Autenticación JWT con expiración configurable.

Contraseñas cifradas con bcrypt.

Migraciones controladas con Alembic.

Frontend modular y tipado con TypeScript.

Estilos con TailwindCSS para mantener coherencia y agilidad.

Despliegue reproducible con Docker Compose (db, backend, frontend).
