# 🚀 Gemini API Proxy Worker

<div align="center">

![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-F38020?style=for-the-badge&logo=cloudflare)
![API Proxy](https://img.shields.io/badge/API-Proxy-00D4AA?style=for-the-badge)
![CORS](https://img.shields.io/badge/CORS-Enabled-4285F4?style=for-the-badge)

**Cloudflare Worker Proxy for Google Gemini API · Solves CORS Issues · One-Click Deployment**

*Works seamlessly with [Gemini Chat App](https://github.com/tellerlin/gemini-app)*

</div>

---

## 📖 Overview

This Cloudflare Worker acts as a proxy server for Google Gemini API requests, solving CORS (Cross-Origin Resource Sharing) issues that prevent frontend applications from directly calling the Gemini API.

### 🎯 Key Features

- **🌐 CORS Resolution**: Eliminates browser CORS restrictions for Gemini API calls
- **⚡ High Performance**: Deployed on Cloudflare's global edge network
- **🔒 Secure**: Proper API key handling and request validation
- **📊 Health Monitoring**: Built-in health check endpoint
- **🛠️ Easy Configuration**: Minimal setup required
- **📱 Multi-platform Support**: Works with any frontend framework

### 🔗 Related Project

This proxy worker is designed to work with the [Gemini Chat Application](https://github.com/tellerlin/gemini-app), a modern React-based AI chat interface. However, it can be used with any frontend application that needs to access the Google Gemini API.

## 🚀 One-Click Deployment

### Deploy to Cloudflare Workers

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/tellerlin/gemini-proxy-worker)

**Quick Setup Steps:**
1. Click the deploy button above
2. Connect your GitHub account
3. Authorize Cloudflare Workers access
4. Your worker will be deployed automatically!

**That's it!** Your proxy worker will be available at: `https://your-worker-name.your-subdomain.workers.dev`

### Manual Deployment (Alternative)

If you prefer manual deployment:

1. **Clone this repository:**
```bash
git clone https://github.com/tellerlin/gemini-proxy-worker.git
cd gemini-proxy-worker
```

2. **Install Wrangler CLI:**
```bash
npm install -g wrangler
```

3. **Login to Cloudflare:**
```bash
wrangler login
```

4. **Deploy the worker:**
```bash
wrangler deploy
```

## 🛠️ Configuration

### Basic Usage

Once deployed, your worker accepts requests at:
```
https://your-worker-name.your-subdomain.workers.dev/api/gemini/*
```

### API Endpoints

- **Health Check**: `GET /health`
- **Gemini API Proxy**: `POST|GET /api/gemini/*`

### Request Headers

The worker supports multiple API key header formats:
- `x-goog-api-key: YOUR_API_KEY`
- `x-api-key: YOUR_API_KEY`  
- `Authorization: Bearer YOUR_API_KEY`

### Example Usage

```javascript
// Using fetch API
const response = await fetch('https://your-worker.workers.dev/api/gemini/v1beta/models/gemini-pro:generateContent', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-goog-api-key': 'YOUR_GEMINI_API_KEY'
  },
  body: JSON.stringify({
    contents: [{
      parts: [{ text: "Hello, Gemini!" }]
    }]
  })
});
```

### Frontend Integration

#### React/JavaScript Example
```javascript
const PROXY_URL = 'https://your-worker.workers.dev';

const callGeminiAPI = async (message) => {
  const response = await fetch(`${PROXY_URL}/api/gemini/v1beta/models/gemini-pro:generateContent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': process.env.REACT_APP_GEMINI_API_KEY
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: message }] }]
    })
  });
  
  return response.json();
};
```

#### Environment Variable Setup
```env
# For the Gemini Chat App
VITE_GEMINI_PROXY_URL=https://your-worker.workers.dev
VITE_GEMINI_API_KEYS=your_api_key_1,your_api_key_2
```

## 🔧 Advanced Configuration

### Custom Domain Setup

1. **Add a custom route** in your `wrangler.toml`:
```toml
[[route]]
pattern = "yourdomain.com/api/gemini/*"
zone_name = "yourdomain.com"
```

2. **Deploy with custom domain**:
```bash
wrangler deploy
```

### Environment Variables

Configure environment-specific settings in `wrangler.toml`:

```toml
[env.production]
vars = { LOG_LEVEL = "error" }

[env.staging]
vars = { LOG_LEVEL = "debug" }
```

### Monitoring and Analytics

Enable observability in `wrangler.toml`:
```toml
[observability]
enabled = true
```

View logs with:
```bash
wrangler tail
```

## 📊 Supported Gemini API Features

- ✅ **Text Generation**: Standard text completion requests
- ✅ **Streaming Responses**: Real-time streaming support
- ✅ **Multimodal Requests**: Image and document processing
- ✅ **Function Calling**: Tool and function execution
- ✅ **Model Listing**: Available models endpoint
- ✅ **All HTTP Methods**: GET, POST, PUT, DELETE support

## 🔒 Security Features

- **API Key Protection**: Secure API key forwarding
- **CORS Configuration**: Proper CORS headers for browser security
- **Request Validation**: Method and header validation
- **Error Handling**: Comprehensive error responses
- **Rate Limiting**: Inherits Cloudflare's built-in protections

## 🧪 Testing

### Health Check
```bash
curl https://your-worker.workers.dev/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-01-20T10:30:00.000Z",
  "version": "1.0.0"
}
```

### API Proxy Test
```bash
curl -X POST https://your-worker.workers.dev/api/gemini/v1beta/models/gemini-pro:generateContent \
  -H "Content-Type: application/json" \
  -H "x-goog-api-key: YOUR_API_KEY" \
  -d '{"contents":[{"parts":[{"text":"Hello!"}]}]}'
```

## 🛡️ Troubleshooting

### Common Issues

#### 1. CORS Errors
- **Problem**: Still seeing CORS errors in browser
- **Solution**: Ensure you're using the correct worker URL and the worker is deployed

#### 2. API Key Issues
- **Problem**: "Invalid API key" errors
- **Solution**: Verify your Gemini API key is valid and has proper permissions

#### 3. Worker 500 Errors
- **Problem**: Worker returning 500 errors
- **Solution**: Check worker logs with `wrangler tail`

#### 4. Request Timeout
- **Problem**: Requests timing out
- **Solution**: Check Gemini API status and your quota limits

### Debug Commands

```bash
# View real-time logs
wrangler tail

# Test worker locally
wrangler dev

# Deploy to staging
wrangler deploy --env staging
```

## 📈 Performance

- **Global Edge Network**: Deployed across 280+ Cloudflare data centers
- **Low Latency**: Sub-100ms response times worldwide
- **High Availability**: 99.99% uptime SLA
- **Scalability**: Automatically scales with demand
- **No Cold Starts**: Always ready to serve requests

## 🤝 Integration Guide

### With Gemini Chat App

1. **Deploy this worker** using the one-click button above
2. **Copy your worker URL**: `https://your-worker.workers.dev`
3. **Deploy [Gemini Chat App](https://github.com/tellerlin/gemini-app)**
4. **Set environment variable**: `VITE_GEMINI_PROXY_URL=https://your-worker.workers.dev`

### With Other Projects

This worker can be used with any frontend framework:
- React, Vue, Angular applications
- Static sites (HTML/JS)
- Mobile applications (React Native, Flutter)
- Desktop applications (Electron)

## 📚 API Reference

### Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check endpoint |
| `/api/gemini/*` | POST/GET | Proxy to Gemini API |

### Headers

| Header | Required | Description |
|--------|----------|-------------|
| `x-goog-api-key` | Yes | Google Gemini API key |
| `Content-Type` | Yes | application/json |

### Response Format

All responses include CORS headers:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization, x-api-key, x-goog-api-key
```

## 🚀 Deployment Platforms

### Recommended: Cloudflare Workers
- ✅ **Best Performance**: Global edge network
- ✅ **Best Pricing**: Generous free tier
- ✅ **Best Integration**: Native Wrangler tooling
- ✅ **Best for CORS**: Purpose-built for this use case

### Alternative Deployments
- **Vercel Edge Functions**: Deploy to Vercel
- **Netlify Edge Functions**: Deploy to Netlify
- **AWS Lambda@Edge**: Deploy to AWS

## 🔗 Links

- **Main Project**: [Gemini Chat App](https://github.com/tellerlin/gemini-app)
- **Live Demo**: [Try the Chat App](https://gemini-chat-demo.pages.dev)
- **Cloudflare Workers**: [Documentation](https://developers.cloudflare.com/workers/)
- **Google Gemini API**: [Documentation](https://ai.google.dev/docs)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Setup

1. **Clone the repository**:
```bash
git clone https://github.com/tellerlin/gemini-proxy-worker.git
cd gemini-proxy-worker
```

2. **Install dependencies**:
```bash
npm install
```

3. **Start development server**:
```bash
npm run dev
```

4. **Test your changes**:
```bash
npm run test
```

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

## 🙏 Acknowledgments

- [Cloudflare Workers](https://workers.cloudflare.com/) - Serverless platform
- [Google Gemini API](https://ai.google.dev/) - AI language models
- [Gemini Chat App](https://github.com/tellerlin/gemini-app) - Frontend application

---

<div align="center">

**🚀 One-Click Deployment · Global Edge Network · Zero Configuration**

[⭐ Star on GitHub](https://github.com/tellerlin/gemini-proxy-worker) · 
[🐛 Report Issue](https://github.com/tellerlin/gemini-proxy-worker/issues) · 
[💬 Discussions](https://github.com/tellerlin/gemini-proxy-worker/discussions)

*Built for the [Gemini Chat Application](https://github.com/tellerlin/gemini-app)*

</div>