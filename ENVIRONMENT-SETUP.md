# Environment Setup Guide

This project uses environment variables to securely store API keys and configuration. Follow these steps to set up your environment:

## 1. Create Environment File

Copy the example environment file and add your actual API keys:

```bash
cp env.example .env
```

## 2. Edit the .env File

Open `.env` and replace the placeholder values with your actual API keys:

```env
# API Keys - Replace with your actual keys
OPENAI_API_KEY=sk-proj-your-actual-openai-key-here
ANTHROPIC_API_KEY=sk-ant-api03-your-actual-anthropic-key-here

# Database
DATABASE_URL=sqlite:///packages.db

# Other settings
SECRET_KEY=reflourish_ai_secret_key_2024
TZ=America/New_York
DASHBOARD_TOKEN=reflourish_dashboard_token

# LLM provider config
LLM_PROVIDER_PRIMARY=anthropic
LLM_PROVIDER_FALLBACK=openai
OPENAI_MODEL=gpt-4o-mini
ANTHROPIC_MODEL=claude-3-7-sonnet
```

## 3. Get API Keys

### OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Create a new API key
4. Copy the key and paste it in your `.env` file

### Anthropic API Key
1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Sign in or create an account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key and paste it in your `.env` file

## 4. Security Notes

- **Never commit the `.env` file to git** - it's already in `.gitignore`
- The `env.example` file is safe to commit as it contains only placeholder values
- Keep your API keys secure and don't share them publicly
- Consider using different keys for development and production

## 5. Running the Application

Once you've set up your `.env` file, you can run the application:

```bash
# Backend
cd backend
python app.py

# Frontend
cd frontend
npm start
```

The application will automatically load the environment variables from your `.env` file.

## 6. Deployment

For deployment platforms (Railway, Vercel, etc.), you'll need to set these environment variables in your platform's environment settings rather than using a `.env` file.
