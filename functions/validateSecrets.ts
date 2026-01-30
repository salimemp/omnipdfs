import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import { GoogleGenerativeAI } from 'npm:@google/generative-ai@0.21.0';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const results = {
      gemini: { status: 'unknown', message: '' },
      resend: { status: 'unknown', message: '' },
      cloudflare: { status: 'unknown', message: '' },
      googleOAuth: { status: 'unknown', message: '' },
      googleDrive: { status: 'unknown', message: '' },
    };

    // Test Gemini API
    try {
      const geminiKey = Deno.env.get('GEMINI_API_KEY');
      if (geminiKey) {
        const genAI = new GoogleGenerativeAI(geminiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent('Say "Hello"');
        results.gemini = { status: 'success', message: 'Connected successfully' };
      } else {
        results.gemini = { status: 'error', message: 'API key not set' };
      }
    } catch (error) {
      results.gemini = { status: 'error', message: error.message };
    }

    // Test Resend API
    try {
      const resendKey = Deno.env.get('RESEND_API_KEY');
      if (resendKey) {
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'test@test.com',
            to: ['test@test.com'],
            subject: 'Test',
            html: '<p>Test</p>',
          }),
        });
        
        if (response.status === 401) {
          results.resend = { status: 'error', message: 'Invalid API key' };
        } else if (response.status === 422) {
          results.resend = { status: 'success', message: 'API key valid (domain not verified)' };
        } else if (response.ok) {
          results.resend = { status: 'success', message: 'Connected successfully' };
        }
      } else {
        results.resend = { status: 'error', message: 'API key not set' };
      }
    } catch (error) {
      results.resend = { status: 'error', message: error.message };
    }

    // Test Cloudflare Turnstile
    const turnstileSiteKey = Deno.env.get('CLOUDFLARE_TURNSTILE_SITE_KEY');
    const turnstileSecret = Deno.env.get('CLOUDFLARE_TURNSTILE_SECRET_KEY');
    
    if (turnstileSiteKey && turnstileSecret) {
      results.cloudflare = { status: 'success', message: 'Keys configured' };
    } else {
      results.cloudflare = { status: 'error', message: 'Keys not set' };
    }

    // Test Google OAuth
    const googleClientId = Deno.env.get('GOOGLE_CLIENT_ID');
    const googleClientSecret = Deno.env.get('GOOGLE_CLIENT_SECRET');
    
    if (googleClientId && googleClientSecret) {
      results.googleOAuth = { status: 'success', message: 'Credentials configured' };
    } else {
      results.googleOAuth = { status: 'error', message: 'Credentials not set' };
    }

    // Test Google Drive connector
    try {
      const accessToken = await base44.asServiceRole.connectors.getAccessToken('googledrive');
      if (accessToken) {
        const response = await fetch(
          'https://www.googleapis.com/drive/v3/about?fields=user',
          {
            headers: { 'Authorization': `Bearer ${accessToken}` },
          }
        );
        
        if (response.ok) {
          const data = await response.json();
          results.googleDrive = { 
            status: 'success', 
            message: `Connected as ${data.user?.emailAddress || 'user'}` 
          };
        } else {
          results.googleDrive = { status: 'error', message: 'Token invalid' };
        }
      } else {
        results.googleDrive = { status: 'warning', message: 'Not authorized yet' };
      }
    } catch (error) {
      results.googleDrive = { status: 'error', message: error.message };
    }

    return Response.json({ success: true, results });

  } catch (error) {
    console.error('Validation error:', error);
    return Response.json({ 
      error: error.message || 'Validation failed' 
    }, { status: 500 });
  }
});