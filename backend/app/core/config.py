from pydantic_settings import BaseSettings
 

class Setting(BaseSettings):
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int
    DATABASE_URL: str
    UVICORN_HOST: str
    UVICORN_PORT: int
    VITE_API_URL: str
    
    class Config:
        env_file = ".env"
        env_file_encoding = 'utf-8'
        
settings = Setting()