import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

const sendEmail = async (to, subject, html) => {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: 'OmniPDFs <noreply@omnipdfs.com>',
      to: [to],
      subject,
      html
    })
  });

  if (!response.ok) {
    throw new Error('Failed to send email');
  }

  return await response.json();
};

const getRegistrationEmailTemplate = (email, token, appUrl) => {
  const verificationUrl = `${appUrl}/EmailVerification?token=${token}&type=registration`;
  
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%); color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
    .content { background: #ffffff; padding: 40px; border: 1px solid #e2e8f0; border-top: none; }
    .button { display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
    .footer { text-align: center; padding: 20px; color: #64748b; font-size: 14px; }
    .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px; margin: 20px 0; border-radius: 4px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Welcome to OmniPDFs!</h1>
    </div>
    <div class="content">
      <h2>Verify Your Email Address</h2>
      <p>Hi there!</p>
      <p>Thank you for signing up for OmniPDFs. To complete your registration and start using our enterprise PDF management platform, please verify your email address.</p>
      
      <div style="text-align: center;">
        <a href="${verificationUrl}" class="button">Verify My Email</a>
      </div>
      
      <p>Or copy and paste this link into your browser:</p>
      <p style="word-break: break-all; color: #06B6D4; font-size: 14px;">${verificationUrl}</p>
      
      <div class="warning">
        <strong>⏱️ This link expires in 24 hours</strong><br>
        For security reasons, this verification link will expire after 24 hours.
      </div>
      
      <p>If you didn't create an account with OmniPDFs, you can safely ignore this email.</p>
      
      <p>Best regards,<br><strong>The OmniPDFs Team</strong></p>
    </div>
    <div class="footer">
      <p>© 2026 OmniPDFs. All rights reserved.</p>
      <p>Enterprise PDF Management & Conversion Platform</p>
    </div>
  </div>
</body>
</html>
  `;
};

const getReVerificationEmailTemplate = (email, token, appUrl, reason, deviceInfo) => {
  const verificationUrl = `${appUrl}/EmailVerification?token=${token}&type=re-verification`;
  
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
    .content { background: #ffffff; padding: 40px; border: 1px solid #e2e8f0; border-top: none; }
    .button { display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
    .footer { text-align: center; padding: 20px; color: #64748b; font-size: 14px; }
    .alert { background: #fee2e2; border-left: 4px solid #ef4444; padding: 16px; margin: 20px 0; border-radius: 4px; }
    .info-box { background: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 8px; margin: 20px 0; }
    .info-item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e2e8f0; }
    .info-item:last-child { border-bottom: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔒 Security Alert</h1>
    </div>
    <div class="content">
      <h2>Re-Verification Required</h2>
      
      <div class="alert">
        <strong>⚠️ Unusual Activity Detected</strong><br>
        ${reason}
      </div>
      
      <p>Hi there,</p>
      <p>We detected a login attempt from a new device or location. To protect your account, please verify that this was you.</p>
      
      <div class="info-box">
        <h3 style="margin-top: 0;">Login Details:</h3>
        ${deviceInfo.os ? `<div class="info-item"><span>Operating System:</span><strong>${deviceInfo.os}</strong></div>` : ''}
        ${deviceInfo.browser ? `<div class="info-item"><span>Browser:</span><strong>${deviceInfo.browser}</strong></div>` : ''}
        ${deviceInfo.location?.city ? `<div class="info-item"><span>Location:</span><strong>${deviceInfo.location.city}, ${deviceInfo.location.country}</strong></div>` : ''}
        ${deviceInfo.ipAddress ? `<div class="info-item"><span>IP Address:</span><strong>${deviceInfo.ipAddress}</strong></div>` : ''}
      </div>
      
      <div style="text-align: center;">
        <a href="${verificationUrl}" class="button">Yes, This Was Me</a>
      </div>
      
      <p>Or copy and paste this link into your browser:</p>
      <p style="word-break: break-all; color: #06B6D4; font-size: 14px;">${verificationUrl}</p>
      
      <div class="alert">
        <strong>⏱️ This link expires in 1 hour</strong><br>
        For security reasons, this verification link will expire after 1 hour.
      </div>
      
      <h3>Wasn't You?</h3>
      <p>If you didn't attempt to log in, your account may be compromised. Please:</p>
      <ul>
        <li>Change your password immediately</li>
        <li>Review your account activity</li>
        <li>Contact our support team</li>
      </ul>
      
      <p>Best regards,<br><strong>The OmniPDFs Security Team</strong></p>
    </div>
    <div class="footer">
      <p>© 2026 OmniPDFs. All rights reserved.</p>
      <p>This is an automated security email. Please do not reply.</p>
    </div>
  </div>
</body>
</html>
  `;
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const url = new URL(req.url);
    const appUrl = `${url.protocol}//${url.host}`;
    
    const { action, data } = await req.json();

    if (action === 'send_verification_email') {
      const { email, verificationType, deviceInfo, reason } = data;

      const token = crypto.randomUUID();
      const expiresAt = new Date();
      if (verificationType === 'registration') {
        expiresAt.setHours(expiresAt.getHours() + 24); // 24 hours
      } else {
        expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour
      }

      await base44.asServiceRole.entities.EmailVerification.create({
        user_email: email,
        verification_token: token,
        verification_type: verificationType,
        expires_at: expiresAt.toISOString(),
        ip_address: deviceInfo?.ipAddress,
        device_info: deviceInfo
      });

      const emailTemplate = verificationType === 'registration'
        ? getRegistrationEmailTemplate(email, token, appUrl)
        : getReVerificationEmailTemplate(email, token, appUrl, reason, deviceInfo);

      const subject = verificationType === 'registration'
        ? '🎉 Welcome to OmniPDFs - Verify Your Email'
        : '🔒 Security Alert - Verify Your Login';

      await sendEmail(email, subject, emailTemplate);

      return Response.json({ success: true, message: 'Verification email sent' });
    }

    if (action === 'verify_token') {
      const { token, verificationType } = data;

      const verifications = await base44.asServiceRole.entities.EmailVerification.filter({
        verification_token: token,
        verification_type: verificationType,
        is_verified: false
      });

      if (verifications.length === 0) {
        return Response.json({ 
          success: false, 
          error: 'Invalid or expired verification token' 
        }, { status: 400 });
      }

      const verification = verifications[0];
      const now = new Date();
      const expiresAt = new Date(verification.expires_at);

      if (now > expiresAt) {
        return Response.json({ 
          success: false, 
          error: 'Verification link has expired' 
        }, { status: 400 });
      }

      await base44.asServiceRole.entities.EmailVerification.update(verification.id, {
        is_verified: true,
        verified_at: now.toISOString()
      });

      // Update user's email verification status
      const users = await base44.asServiceRole.entities.User.filter({ 
        email: verification.user_email 
      });

      if (users.length > 0) {
        await base44.asServiceRole.entities.User.update(users[0].id, {
          email_verified: true
        });
      }

      return Response.json({ 
        success: true, 
        email: verification.user_email,
        verificationType: verification.verification_type
      });
    }

    if (action === 'check_verification_status') {
      const { email } = data;

      const users = await base44.asServiceRole.entities.User.filter({ email });
      
      if (users.length === 0) {
        return Response.json({ success: false, error: 'User not found' }, { status: 404 });
      }

      return Response.json({ 
        success: true, 
        emailVerified: users[0].email_verified || false
      });
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('Email verification error:', error);
    return Response.json({ 
      error: error.message || 'Verification failed' 
    }, { status: 500 });
  }
});