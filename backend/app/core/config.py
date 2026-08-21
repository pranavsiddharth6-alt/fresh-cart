import os
from typing import List
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

class Settings:
    PROJECT_NAME: str = "FreshCart Supermarket API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # Default allowed origins for Local Development + Vercel Production
    DEFAULT_ORIGINS = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "https://fresh-cart-fkqusrdfn-siddharth-134b.vercel.app",
    ]
    
    # CORS Origins (merges environment variable ALLOWED_ORIGINS if provided)
    @property
    def ALLOWED_ORIGINS(self) -> List[str]:
        env_origins = os.getenv("ALLOWED_ORIGINS", "")
        origins = list(self.DEFAULT_ORIGINS)
        if env_origins:
            for o in env_origins.split(","):
                clean = o.strip().rstrip("/")
                if clean and clean not in origins:
                    origins.append(clean)
        return origins
    
    # Regex pattern to match all Vercel preview/production deployments
    ALLOWED_ORIGIN_REGEX: str = r"https://.*\.vercel\.app"
    
    # Supabase Configuration
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "") or os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")

    # Admin Email for initial permissions
    ADMIN_EMAIL: str = os.getenv("ADMIN_EMAIL", "admin@supermarket.com")

settings = Settings()
