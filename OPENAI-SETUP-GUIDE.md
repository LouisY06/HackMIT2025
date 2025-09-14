# OpenAI API Key Setup Guide

This guide will help you configure OpenAI and Anthropic API keys for the Reflourish AI features.

## 🔑 Getting API Keys

### OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the key (starts with `sk-`)
5. **Important**: Save it securely - you won't be able to see it again!

### Anthropic API Key (Optional)
1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Sign in or create an account
3. Navigate to API keys section
4. Create a new API key
5. Copy the key (starts with `sk-ant-`)

## 🛠️ Configuration Options

### Option 1: Environment Variables (Recommended)
Set these in your system environment:

```bash
export OPENAI_API_KEY="sk-your-actual-openai-key-here"
export ANTHROPIC_API_KEY="sk-ant-your-actual-anthropic-key-here"
```

### Option 2: .env Files
Create `.env` files in the project directories:

**Root directory `.env`:**
```env
OPENAI_API_KEY=sk-your-actual-openai-key-here
ANTHROPIC_API_KEY=sk-ant-your-actual-anthropic-key-here
```

**AI Integration directory `ai-integration/.env`:**
```env
OPENAI_API_KEY=sk-your-actual-openai-key-here
ANTHROPIC_API_KEY=sk-ant-your-actual-anthropic-key-here
LLM_PROVIDER_PRIMARY=openai
LLM_PROVIDER_FALLBACK=anthropic
OPENAI_MODEL=gpt-4o-mini
ANTHROPIC_MODEL=claude-3-5-sonnet-20241022
```

### Option 3: Direct Configuration (Not Recommended)
You can edit the config files directly, but this is not recommended for security reasons:

- `backend/config.py`
- `ai-integration/app/config.py`

## 🧪 Testing Your Setup

Run the test script to verify your configuration:

```bash
cd backend
python test_openai_config.py
```

This will test:
- ✅ API key format validation
- ✅ Actual API connectivity
- ✅ AI Analytics integration

## 🔧 Troubleshooting

### Common Issues

**❌ "API key is still set to placeholder value"**
- Make sure you replaced the placeholder with your actual API key

**❌ "API key doesn't start with 'sk-'"**
- OpenAI keys start with `sk-`
- Anthropic keys start with `sk-ant-`
- Make sure you copied the full key

**❌ "API call failed: 401 Unauthorized"**
- Your API key is invalid or expired
- Check if you have sufficient credits in your account

**❌ "API call failed: 429 Rate Limited"**
- You've exceeded your rate limits
- Wait a few minutes and try again
- Consider upgrading your plan

**❌ "ImportError: No module named 'openai'"**
- Install required packages: `pip install openai anthropic requests`

### Getting Help

If you're still having issues:

1. Check the [OpenAI API documentation](https://platform.openai.com/docs)
2. Verify your account has sufficient credits
3. Make sure your API keys have the right permissions
4. Check the console for detailed error messages

## 🚀 Next Steps

Once your API keys are configured:

1. ✅ Run the test script to verify everything works
2. ✅ Start the backend server: `python app.py`
3. ✅ Test AI features in the dashboard
4. ✅ Generate your first AI insights!

## 📊 AI Features Available

With properly configured API keys, you'll have access to:

- 🤖 **Executive Summaries**: AI-generated insights about store performance
- 📈 **Detailed Reports**: Comprehensive weekly analysis with recommendations
- 🔮 **Predictions**: Inventory forecasting and behavior predictions
- 💡 **Smart Recommendations**: Data-driven suggestions for optimization

## 🔒 Security Best Practices

- ✅ Never commit API keys to version control
- ✅ Use environment variables or .env files
- ✅ Rotate your keys regularly
- ✅ Monitor your API usage and costs
- ✅ Set usage limits in your API provider dashboard

---

*Last updated: $(date)*
*For more help, check the main README.md or contact support.*
