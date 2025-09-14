import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///../backend/packages.db")
SECRET_KEY = os.getenv("SECRET_KEY", "reflourish_ai_secret_key_2024")
TZ = os.getenv("TZ", "America/New_York")
DASHBOARD_TOKEN = os.getenv("DASHBOARD_TOKEN", "reflourish_dashboard_token")

# LLM provider config
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "your-openai-key-here")
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "your-anthropic-key-here")
LLM_PRIMARY = os.getenv("LLM_PROVIDER_PRIMARY", "anthropic")
LLM_FALLBACK = os.getenv("LLM_PROVIDER_FALLBACK", "openai")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
ANTHROPIC_MODEL = os.getenv("ANTHROPIC_MODEL", "claude-3-5-sonnet-20241022")
