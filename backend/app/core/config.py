import os
from typing import List
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

class Settings:
    PROJECT_NAME: str = "FreshCart Supermarket API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # CORS Origins
    ALLOWED_ORIGINS: List[str] = [
        origin.strip() 
        for origin in os.getenv(
            "ALLOWED_ORIGINS", 
            "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173,http://127.0.0.1:3000"
        ).split(",")
        if origin.strip()
    ]
    
    # Supabase Configuration
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "") or os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")

    # Admin Email for initial permissions
    ADMIN_EMAIL: str = os.getenv("ADMIN_EMAIL", "admin@supermarket.com")

settings = Settings()
