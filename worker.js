/**
 * Gemini API Proxy Worker
 * 
 * This Cloudflare Worker acts as a proxy for Google Gemini API requests,
 * solving CORS issues for frontend applications.
 * 
 * Features:
 * - CORS handling for browser-based applications
 * - Request/response forwarding with proper headers
 * - Error handling and logging
 * - Support for streaming responses
 * 
 * Related Project: https://github.com/tellerlin/gemini-app
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key, x-goog-api-key',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    // Health check endpoint
    if (url.pathname === '/health') {
      return new Response(JSON.stringify({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // Only allow specific HTTP methods
    if (!['GET', 'POST', 'PUT', 'DELETE'].includes(request.method)) {
      return new Response('Method not allowed', { 
        status: 405,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    try {
      // Extract the path after /api/gemini
      const geminiPath = url.pathname.replace(/^\/api\/gemini/, '') || '/v1beta/models';
      const geminiUrl = `https://generativelanguage.googleapis.com${geminiPath}${url.search}`;

      // Prepare headers for the Gemini API request
      const geminiHeaders = new Headers();
      
      // Copy relevant headers from the original request
      for (const [key, value] of request.headers.entries()) {
        if (key.toLowerCase() === 'content-type') {
          geminiHeaders.set(key, value);
        }
      }

      // Handle API key from various header formats
      let apiKey = request.headers.get('x-goog-api-key') || 
                   request.headers.get('x-api-key') ||
                   request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');

      if (apiKey) {
        geminiHeaders.set('x-goog-api-key', apiKey);
      }

      // Prepare request body
      let body = null;
      if (['POST', 'PUT'].includes(request.method)) {
        body = await request.text();
      }

      // Forward request to Gemini API
      const geminiResponse = await fetch(geminiUrl, {
        method: request.method,
        headers: geminiHeaders,
        body: body
      });

      // Get response data
      const responseData = await geminiResponse.text();
      
      // Prepare response headers with CORS
      const responseHeaders = new Headers();
      
      // Copy content-type from Gemini API response
      const contentType = geminiResponse.headers.get('content-type');
      if (contentType) {
        responseHeaders.set('Content-Type', contentType);
      }

      // Add CORS headers
      responseHeaders.set('Access-Control-Allow-Origin', '*');
      responseHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-api-key, x-goog-api-key');

      // Handle streaming responses
      if (contentType && contentType.includes('text/plain')) {
        responseHeaders.set('Access-Control-Expose-Headers', 'Content-Type');
      }

      return new Response(responseData, {
        status: geminiResponse.status,
        headers: responseHeaders
      });

    } catch (error) {
      console.error('Proxy error:', error);
      
      return new Response(JSON.stringify({ 
        error: 'Proxy server error',
        message: error.message,
        timestamp: new Date().toISOString()
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
  }
};