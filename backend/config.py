# AI API Configuration
# Replace these with your actual API keys
import os

# OpenAI API Key - Get from https://platform.openai.com/api-keys
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "your-openai-key-here")

# Anthropic API Key - Get from https://console.anthropic.com/
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "your-anthropic-key-here")

# Database
DATABASE_URL = "sqlite:///packages.db"

# Other settings
SECRET_KEY = "reflourish_ai_secret_key_2024"
TZ = "America/New_York"
DASHBOARD_TOKEN = "reflourish_dashboard_token"
