import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { token } = await req.json();

    if (!token) {
      return Response.json({ 
        success: false, 
        error: 'Missing token' 
      }, { status: 400 });
    }

    const secretKey = Deno.env.get('CLOUDFLARE_TURNSTILE_SECRET_KEY');
    
    if (!secretKey) {
      return Response.json({ 
        success: false, 
        error: 'Server configuration error' 
      }, { status: 500 });
    }

    // Verify token with Cloudflare
    const verifyResponse = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          secret: secretKey,
          response: token,
        }),
      }
    );

    const verifyData = await verifyResponse.json();

    if (verifyData.success) {
      // Log successful verification
      await base44.asServiceRole.entities.ComplianceLog.create({
        event_type: 'security_incident',
        user_email: user.email,
        action_description: 'Turnstile verification successful',
        compliance_framework: ['SOC2'],
        severity: 'low'
      });

      return Response.json({ 
        success: true,
        message: 'Verification successful' 
      });
    } else {
      return Response.json({ 
        success: false,
        error: 'Verification failed',
        'error-codes': verifyData['error-codes']
      }, { status: 400 });
    }
  } catch (error) {
    console.error('Turnstile verification error:', error);
    return Response.json({ 
      success: false,
      error: error.message 
    }, { status: 500 });
  }
});