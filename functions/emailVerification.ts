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

const getPasswordResetTemplate = (email, token, appUrl) => {
  const resetUrl = `${appUrl}/ResetPassword?token=${token}`;
  
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
      <h1>🔑 Password Reset Request</h1>
    </div>
    <div class="content">
      <h2>Reset Your Password</h2>
      <p>Hi there,</p>
      <p>We received a request to reset your password for your OmniPDFs account. Click the button below to create a new password.</p>
      
      <div style="text-align: center;">
        <a href="${resetUrl}" class="button">Reset My Password</a>
      </div>
      
      <p>Or copy and paste this link into your browser:</p>
      <p style="word-break: break-all; color: #06B6D4; font-size: 14px;">${resetUrl}</p>
      
      <div class="warning">
        <strong>⏱️ This link expires in 1 hour</strong><br>
        For security reasons, this reset link will expire after 1 hour.
      </div>
      
      <p>If you didn't request a password reset, please ignore this email or contact our support team if you have concerns.</p>
      
      <p>Best regards,<br><strong>The OmniPDFs Team</strong></p>
    </div>
    <div class="footer">
      <p>© 2026 OmniPDFs. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;
};

const getJobCompletionTemplate = (email, jobDetails, appUrl) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
    .content { background: #ffffff; padding: 40px; border: 1px solid #e2e8f0; border-top: none; }
    .button { display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
    .footer { text-align: center; padding: 20px; color: #64748b; font-size: 14px; }
    .info-box { background: #f0fdf4; border: 1px solid #86efac; padding: 16px; border-radius: 8px; margin: 20px 0; }
    .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✅ Job Completed Successfully!</h1>
    </div>
    <div class="content">
      <h2>Your ${jobDetails.type} is Ready</h2>
      <p>Great news! Your file processing job has been completed successfully.</p>
      
      <div class="info-box">
        <h3 style="margin-top: 0; color: #059669;">Job Details:</h3>
        <div class="detail-row"><span>Job Type:</span><strong>${jobDetails.type}</strong></div>
        <div class="detail-row"><span>File Name:</span><strong>${jobDetails.fileName}</strong></div>
        <div class="detail-row"><span>Processing Time:</span><strong>${jobDetails.processingTime}</strong></div>
        ${jobDetails.outputSize ? `<div class="detail-row"><span>Output Size:</span><strong>${jobDetails.outputSize}</strong></div>` : ''}
      </div>
      
      <div style="text-align: center;">
        <a href="${appUrl}/Files" class="button">Download Your File</a>
      </div>
      
      <p style="color: #64748b; font-size: 14px; margin-top: 20px;">Your file will be available for download for the next 30 days.</p>
      
      <p>Best regards,<br><strong>The OmniPDFs Team</strong></p>
    </div>
    <div class="footer">
      <p>© 2026 OmniPDFs. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;
};

const getPaymentReceiptTemplate = (email, paymentDetails) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%); color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
    .content { background: #ffffff; padding: 40px; border: 1px solid #e2e8f0; border-top: none; }
    .footer { text-align: center; padding: 20px; color: #64748b; font-size: 14px; }
    .receipt-box { background: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .detail-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e2e8f0; }
    .total-row { display: flex; justify-content: space-between; padding: 16px 0; font-size: 18px; font-weight: bold; color: #8B5CF6; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>💳 Payment Receipt</h1>
    </div>
    <div class="content">
      <h2>Thank You for Your Payment!</h2>
      <p>Hi ${paymentDetails.customerName || 'there'},</p>
      <p>Your payment has been processed successfully. Here's your receipt:</p>
      
      <div class="receipt-box">
        <h3 style="margin-top: 0;">Receipt #${paymentDetails.receiptNumber}</h3>
        <div class="detail-row"><span>Date:</span><strong>${paymentDetails.date}</strong></div>
        <div class="detail-row"><span>Plan:</span><strong>${paymentDetails.plan}</strong></div>
        <div class="detail-row"><span>Billing Period:</span><strong>${paymentDetails.billingPeriod}</strong></div>
        <div class="detail-row"><span>Payment Method:</span><strong>${paymentDetails.paymentMethod}</strong></div>
        <div class="detail-row" style="border: none;"><span>Subtotal:</span><strong>$${paymentDetails.subtotal}</strong></div>
        ${paymentDetails.tax ? `<div class="detail-row" style="border: none;"><span>Tax:</span><strong>$${paymentDetails.tax}</strong></div>` : ''}
        <div class="total-row">
          <span>Total Paid:</span><strong>$${paymentDetails.total}</strong>
        </div>
      </div>
      
      <p>Your subscription is now active and will renew on ${paymentDetails.nextBillingDate}.</p>
      
      <p>If you have any questions about this payment, please don't hesitate to contact our support team.</p>
      
      <p>Best regards,<br><strong>The OmniPDFs Team</strong></p>
    </div>
    <div class="footer">
      <p>© 2026 OmniPDFs. All rights reserved.</p>
      <p>Invoice ID: ${paymentDetails.invoiceId}</p>
    </div>
  </div>
</body>
</html>
  `;
};

const getPaymentFailedTemplate = (email, failureDetails, appUrl) => {
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
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>⚠️ Payment Failed</h1>
    </div>
    <div class="content">
      <h2>Action Required: Payment Not Received</h2>
      <p>Hi ${failureDetails.customerName || 'there'},</p>
      <p>We were unable to process your recent payment for your OmniPDFs subscription.</p>
      
      <div class="alert">
        <strong>Reason:</strong> ${failureDetails.reason || 'Payment method declined'}<br>
        <strong>Amount:</strong> $${failureDetails.amount}<br>
        <strong>Attempted on:</strong> ${failureDetails.attemptDate}
      </div>
      
      <p>To avoid any interruption to your service, please update your payment method and retry the payment.</p>
      
      <div style="text-align: center;">
        <a href="${appUrl}/Settings?tab=billing" class="button">Update Payment Method</a>
      </div>
      
      <p><strong>What happens next?</strong></p>
      <ul>
        <li>Your account will remain active for ${failureDetails.gracePeriodDays || 7} days</li>
        <li>We'll automatically retry the payment in 3 days</li>
        <li>If payment fails again, your service may be suspended</li>
      </ul>
      
      <p>If you believe this is an error or need assistance, please contact our support team immediately.</p>
      
      <p>Best regards,<br><strong>The OmniPDFs Billing Team</strong></p>
    </div>
    <div class="footer">
      <p>© 2026 OmniPDFs. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;
};

const getServiceSuspensionTemplate = (email, suspensionDetails, appUrl) => {
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
    .critical { background: #fee2e2; border: 2px solid #ef4444; padding: 20px; margin: 20px 0; border-radius: 8px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🚫 Service Suspended</h1>
    </div>
    <div class="content">
      <h2>Your Account Has Been Suspended</h2>
      <p>Hi ${suspensionDetails.customerName || 'there'},</p>
      
      <div class="critical">
        <h3 style="margin-top: 0; color: #dc2626;">Immediate Action Required</h3>
        <p style="margin-bottom: 0;"><strong>Reason:</strong> ${suspensionDetails.reason}</p>
      </div>
      
      <p>Due to ${suspensionDetails.reason.toLowerCase()}, we have temporarily suspended your OmniPDFs account. This means:</p>
      
      <ul>
        <li>❌ You cannot access your files or documents</li>
        <li>❌ All conversion and processing jobs are paused</li>
        <li>❌ Collaboration features are disabled</li>
        <li>⚠️ Your data will be deleted in ${suspensionDetails.deletionDays || 30} days if not resolved</li>
      </ul>
      
      <h3>How to Restore Your Account:</h3>
      ${suspensionDetails.restoreSteps || `
      <ol>
        <li>Update your payment information</li>
        <li>Pay any outstanding balance</li>
        <li>Your account will be automatically restored within 1 hour</li>
      </ol>
      `}
      
      <div style="text-align: center;">
        <a href="${appUrl}/Settings?tab=billing" class="button">Restore My Account</a>
      </div>
      
      <p>If you have questions or believe this is an error, please contact our support team immediately at <a href="mailto:support@omnipdfs.com">support@omnipdfs.com</a>.</p>
      
      <p>Best regards,<br><strong>The OmniPDFs Team</strong></p>
    </div>
    <div class="footer">
      <p>© 2026 OmniPDFs. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;
};

const getWelcomeTemplate = (email, userName, appUrl) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%); color: white; padding: 40px; text-align: center; border-radius: 12px 12px 0 0; }
    .content { background: #ffffff; padding: 40px; border: 1px solid #e2e8f0; border-top: none; }
    .button { display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
    .footer { text-align: center; padding: 20px; color: #64748b; font-size: 14px; }
    .feature-box { background: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 8px; margin: 10px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Welcome to OmniPDFs!</h1>
      <p style="font-size: 18px; margin: 10px 0 0 0;">Your Enterprise PDF Management Platform</p>
    </div>
    <div class="content">
      <h2>Hi ${userName || 'there'}! 👋</h2>
      <p>Thank you for joining OmniPDFs! Your account is now fully activated and ready to use.</p>
      
      <h3>Get Started with These Features:</h3>
      
      <div class="feature-box">
        <strong>📄 Convert Documents</strong><br>
        Convert between 50+ file formats with AI-powered optimization
      </div>
      
      <div class="feature-box">
        <strong>✏️ PDF Editor</strong><br>
        Edit, annotate, and sign PDFs directly in your browser
      </div>
      
      <div class="feature-box">
        <strong>🤖 AI Assistant</strong><br>
        Get intelligent document analysis and automated workflows
      </div>
      
      <div class="feature-box">
        <strong>👥 Collaboration</strong><br>
        Share and collaborate on documents in real-time
      </div>
      
      <div style="text-align: center;">
        <a href="${appUrl}/CustomDashboard" class="button">Go to Dashboard</a>
      </div>
      
      <p>Need help getting started? Check out our <a href="${appUrl}/APIDocs">documentation</a> or contact our support team.</p>
      
      <p>Best regards,<br><strong>The OmniPDFs Team</strong></p>
    </div>
    <div class="footer">
      <p>© 2026 OmniPDFs. All rights reserved.</p>
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

    if (action === 'send_password_reset') {
      const { email } = data;
      const token = crypto.randomUUID();
      
      const emailTemplate = getPasswordResetTemplate(email, token, appUrl);
      await sendEmail(email, '🔑 Reset Your Password - OmniPDFs', emailTemplate);
      
      return Response.json({ success: true, message: 'Password reset email sent', token });
    }

    if (action === 'send_job_completion') {
      const { email, jobDetails } = data;
      const emailTemplate = getJobCompletionTemplate(email, jobDetails, appUrl);
      await sendEmail(email, `✅ Your ${jobDetails.type} is Ready - OmniPDFs`, emailTemplate);
      
      return Response.json({ success: true, message: 'Job completion email sent' });
    }

    if (action === 'send_payment_receipt') {
      const { email, paymentDetails } = data;
      const emailTemplate = getPaymentReceiptTemplate(email, paymentDetails);
      await sendEmail(email, '💳 Payment Receipt - OmniPDFs', emailTemplate);
      
      return Response.json({ success: true, message: 'Payment receipt sent' });
    }

    if (action === 'send_payment_failed') {
      const { email, failureDetails } = data;
      const emailTemplate = getPaymentFailedTemplate(email, failureDetails, appUrl);
      await sendEmail(email, '⚠️ Payment Failed - Action Required', emailTemplate);
      
      return Response.json({ success: true, message: 'Payment failed notification sent' });
    }

    if (action === 'send_service_suspension') {
      const { email, suspensionDetails } = data;
      const emailTemplate = getServiceSuspensionTemplate(email, suspensionDetails, appUrl);
      await sendEmail(email, '🚫 Service Suspended - Immediate Action Required', emailTemplate);
      
      return Response.json({ success: true, message: 'Suspension notification sent' });
    }

    if (action === 'send_welcome_email') {
      const { email, userName } = data;
      const emailTemplate = getWelcomeTemplate(email, userName, appUrl);
      await sendEmail(email, '🎉 Welcome to OmniPDFs!', emailTemplate);
      
      return Response.json({ success: true, message: 'Welcome email sent' });
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