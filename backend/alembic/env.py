from logging.config import fileConfig
from sqlalchemy import create_engine, pool
from alembic import context
import os
from dotenv import load_dotenv

# Cargar variables de entorno desde .env
load_dotenv()

# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config

# Obtener URL de la base de datos desde DATABASE_URL o variables separadas
db_url = os.environ.get('DATABASE_URL')
if not db_url:
    POSTGRES_USER = os.environ.get("POSTGRES_USER")
    POSTGRES_PASSWORD = os.environ.get("POSTGRES_PASSWORD")
    POSTGRES_DB = os.environ.get("POSTGRES_DB")
    POSTGRES_HOST = os.environ.get("POSTGRES_HOST", "localhost")
    POSTGRES_PORT = os.environ.get("POSTGRES_PORT", "5432")
    db_url = f"postgresql+psycopg2://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_HOST}:{POSTGRES_PORT}/{POSTGRES_DB}"

# Configurar la URL en Alembic
config.set_main_option('sqlalchemy.url', db_url)

# Configurar logging desde el archivo de configuración
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Agregar tu MetaData de modelos para soporte de 'autogenerate'
from app.models.entity_abstract import EntityAbstract as Base
from app.models import *
target_metadata = Base.metadata

# Función para migraciones offline
def run_migrations_offline() -> None:
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()

# Función para migraciones online
def run_migrations_online() -> None:
    connectable = create_engine(db_url, poolclass=pool.NullPool)

    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)

        with context.begin_transaction():
            context.run_migrations()

# Ejecutar según el modo
if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
