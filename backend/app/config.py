import os


class Settings:
    environment: str = os.getenv("ENVIRONMENT", "development")
    admin_username: str = os.getenv("ADMIN_USERNAME", "admin")
    admin_password: str = os.getenv("ADMIN_PASSWORD", "admin")
    secret_key: str = os.getenv("SECRET_KEY", "change-me-in-production")
    algorithm: str = os.getenv("JWT_ALGORITHM", "HS256")
    access_token_expire_minutes: int = int(
        os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60")
    )
    database_url: str = os.getenv("DATABASE_URL", "sqlite:///./tickets.db")
    cors_origins: list[str] = [
        origin.strip()
        for origin in os.getenv(
            "CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173"
        ).split(",")
        if origin.strip()
    ]

    def validate(self) -> None:
        if self.environment != "production":
            return
        insecure: list[str] = []
        if self.secret_key == "change-me-in-production":
            insecure.append("SECRET_KEY")
        if self.admin_password == "admin":
            insecure.append("ADMIN_PASSWORD")
        if insecure:
            raise RuntimeError(
                "В production обязательно задать безопасные значения: "
                + ", ".join(insecure)
            )


settings = Settings()
