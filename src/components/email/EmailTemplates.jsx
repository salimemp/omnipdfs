// Transactional Email Templates for OmniPDFs

const getEmailTemplate = (type, data = {}) => {
  const baseStyle = `
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #334155; background: #f8fafc; margin: 0; padding: 0; }
      .container { max-width: 600px; margin: 0 auto; background: white; }
      .header { background: linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%); padding: 40px 20px; text-align: center; }
      .logo { font-size: 28px; font-weight: bold; color: white; margin: 0; }
      .content { padding: 40px 30px; }
      .button { display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
      .footer { background: #f1f5f9; padding: 30px; text-align: center; font-size: 14px; color: #64748b; }
      .divider { border-top: 1px solid #e2e8f0; margin: 30px 0; }
      .info-box { background: #f8fafc; border-left: 4px solid #8B5CF6; padding: 16px; margin: 20px 0; border-radius: 4px; }
      .badge { display: inline-block; padding: 4px 12px; background: #ddd6fe; color: #6d28d9; border-radius: 12px; font-size: 12px; font-weight: 600; }
      h1 { color: #0f172a; font-size: 24px; margin: 0 0 16px 0; }
      h2 { color: #334155; font-size: 18px; margin: 24px 0 12px 0; }
      p { margin: 12px 0; color: #475569; }
      .highlight { color: #8B5CF6; font-weight: 600; }
      .warning { color: #f59e0b; font-weight: 600; }
      .success { color: #10b981; font-weight: 600; }
    </style>
  `;

  const templates = {
    // 1. Welcome Email
    welcome: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="UTF-8">${baseStyle}</head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="logo">🚀 OmniPDFs</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0;">Enterprise Document Management</p>
          </div>
          <div class="content">
            <h1>Welcome to OmniPDFs, ${data.name || 'there'}! 🎉</h1>
            <p>We're thrilled to have you on board! Your account is now active and ready to use.</p>
            
            <div class="info-box">
              <strong>✨ What you can do now:</strong>
              <ul style="margin: 12px 0; padding-left: 20px;">
                <li>Convert documents between 50+ formats</li>
                <li>Edit PDFs with AI-powered tools</li>
                <li>Collaborate with your team in real-time</li>
                <li>Automate workflows and tasks</li>
                <li>Secure your documents with enterprise-grade encryption</li>
              </ul>
            </div>
            
            <p style="text-align: center;">
              <a href="${data.dashboardUrl || '#'}" class="button">Go to Dashboard</a>
            </p>
            
            <div class="divider"></div>
            
            <h2>Quick Start Guide</h2>
            <p><strong>1. Upload your first document</strong> - Drag and drop files or click to browse</p>
            <p><strong>2. Choose your tool</strong> - Convert, edit, merge, compress, or use AI features</p>
            <p><strong>3. Download or share</strong> - Get your processed files instantly</p>
            
            <p style="margin-top: 30px;">Need help? Our support team is here 24/7 at <a href="mailto:support@omnipdfs.com">support@omnipdfs.com</a></p>
          </div>
          <div class="footer">
            <p><strong>OmniPDFs</strong> - Professional Document Management</p>
            <p style="margin: 8px 0; font-size: 12px;">© ${new Date().getFullYear()} OmniPDFs. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,

    // 2. Password Reset
    passwordReset: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="UTF-8">${baseStyle}</head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="logo">🔐 OmniPDFs</h1>
          </div>
          <div class="content">
            <h1>Password Reset Request</h1>
            <p>Hi ${data.name || 'there'},</p>
            <p>We received a request to reset your password. Click the button below to create a new password:</p>
            
            <p style="text-align: center;">
              <a href="${data.resetUrl || '#'}" class="button">Reset Password</a>
            </p>
            
            <div class="info-box">
              <p style="margin: 0;"><strong>⏰ This link expires in ${data.expiryHours || '24'} hours</strong></p>
            </div>
            
            <p>If you didn't request this password reset, you can safely ignore this email. Your password will remain unchanged.</p>
            
            <div class="divider"></div>
            
            <p style="font-size: 14px; color: #64748b;">For security reasons, this link can only be used once. If you need another reset link, please submit a new request.</p>
          </div>
          <div class="footer">
            <p>If the button doesn't work, copy and paste this link:</p>
            <p style="word-break: break-all; font-size: 12px;">${data.resetUrl || '#'}</p>
          </div>
        </div>
      </body>
      </html>
    `,

    // 3. Document Upload Confirmation
    documentUploaded: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="UTF-8">${baseStyle}</head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="logo">📄 OmniPDFs</h1>
          </div>
          <div class="content">
            <h1>Document Uploaded Successfully ✅</h1>
            <p>Hi ${data.name || 'there'},</p>
            <p>Your document has been uploaded and is now available in your library.</p>
            
            <div class="info-box">
              <p><strong>Document Details:</strong></p>
              <p style="margin: 8px 0;">📁 <strong>Name:</strong> ${data.documentName || 'Untitled'}</p>
              <p style="margin: 8px 0;">📊 <strong>Size:</strong> ${data.fileSize || 'N/A'}</p>
              <p style="margin: 8px 0;">🏷️ <strong>Type:</strong> ${data.fileType || 'N/A'}</p>
              <p style="margin: 8px 0;">📅 <strong>Uploaded:</strong> ${data.uploadDate || new Date().toLocaleDateString()}</p>
            </div>
            
            <p style="text-align: center;">
              <a href="${data.documentUrl || '#'}" class="button">View Document</a>
            </p>
            
            <p>You can now convert, edit, share, or perform any available operations on this document.</p>
          </div>
          <div class="footer">
            <p><strong>OmniPDFs</strong> - Your documents are safe with us</p>
          </div>
        </div>
      </body>
      </html>
    `,

    // 4. Conversion Complete
    conversionComplete: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="UTF-8">${baseStyle}</head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="logo">⚡ OmniPDFs</h1>
          </div>
          <div class="content">
            <h1>Your Conversion is Ready! 🎉</h1>
            <p>Hi ${data.name || 'there'},</p>
            <p>Great news! Your document conversion is complete and ready for download.</p>
            
            <div class="info-box">
              <p><strong>Conversion Details:</strong></p>
              <p style="margin: 8px 0;">📄 <strong>Original:</strong> ${data.originalName || 'Document'} (${data.sourceFormat || 'N/A'})</p>
              <p style="margin: 8px 0;">✨ <strong>Converted to:</strong> ${data.targetFormat || 'N/A'}</p>
              <p style="margin: 8px 0;">⏱️ <strong>Processing time:</strong> ${data.processingTime || 'N/A'}</p>
              <p style="margin: 8px 0;">📦 <strong>Output size:</strong> ${data.outputSize || 'N/A'}</p>
            </div>
            
            <p style="text-align: center;">
              <a href="${data.downloadUrl || '#'}" class="button">Download Converted File</a>
            </p>
            
            <p style="font-size: 14px; color: #64748b;">Your converted file will be available for ${data.expiryDays || '30'} days.</p>
          </div>
          <div class="footer">
            <p><strong>OmniPDFs</strong> - Fast & Accurate Conversions</p>
          </div>
        </div>
      </body>
      </html>
    `,

    // 5. Document Shared
    documentShared: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="UTF-8">${baseStyle}</head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="logo">🤝 OmniPDFs</h1>
          </div>
          <div class="content">
            <h1>${data.sharedBy || 'Someone'} Shared a Document with You</h1>
            <p>Hi ${data.recipientName || 'there'},</p>
            <p><strong>${data.sharedBy || 'A colleague'}</strong> has shared a document with you on OmniPDFs.</p>
            
            <div class="info-box">
              <p><strong>Document:</strong> ${data.documentName || 'Untitled'}</p>
              <p style="margin: 8px 0;"><strong>Your access level:</strong> <span class="badge">${data.accessLevel || 'Viewer'}</span></p>
              ${data.message ? `<p style="margin: 12px 0; padding: 12px; background: white; border-radius: 4px;"><em>"${data.message}"</em></p>` : ''}
            </div>
            
            <p style="text-align: center;">
              <a href="${data.documentUrl || '#'}" class="button">Open Document</a>
            </p>
            
            <p>You can view, download, ${data.canEdit ? 'and edit ' : ''}this document. ${data.expiryDate ? `Access expires on ${data.expiryDate}.` : ''}</p>
          </div>
          <div class="footer">
            <p><strong>OmniPDFs</strong> - Collaborate Seamlessly</p>
          </div>
        </div>
      </body>
      </html>
    `,

    // 6. Collaboration Invitation
    collaborationInvite: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="UTF-8">${baseStyle}</head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="logo">👥 OmniPDFs</h1>
          </div>
          <div class="content">
            <h1>You're Invited to Collaborate!</h1>
            <p>Hi ${data.recipientName || 'there'},</p>
            <p><strong>${data.invitedBy || 'A team member'}</strong> has invited you to collaborate on a project in OmniPDFs.</p>
            
            <div class="info-box">
              <p><strong>Project:</strong> ${data.projectName || 'Untitled Project'}</p>
              <p style="margin: 8px 0;"><strong>Role:</strong> <span class="badge">${data.role || 'Member'}</span></p>
              <p style="margin: 8px 0;"><strong>Team size:</strong> ${data.teamSize || '1'} collaborator(s)</p>
            </div>
            
            <p style="text-align: center;">
              <a href="${data.acceptUrl || '#'}" class="button">Accept Invitation</a>
            </p>
            
            <p>Join your team and start collaborating on documents, share feedback, and work together in real-time.</p>
          </div>
          <div class="footer">
            <p><strong>OmniPDFs</strong> - Better Together</p>
          </div>
        </div>
      </body>
      </html>
    `,

    // 7. Document Expiry Warning
    documentExpiring: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="UTF-8">${baseStyle}</head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="logo">⚠️ OmniPDFs</h1>
          </div>
          <div class="content">
            <h1>Document Expiring Soon</h1>
            <p>Hi ${data.name || 'there'},</p>
            <p>This is a reminder that the following document will expire soon:</p>
            
            <div class="info-box">
              <p><strong>📄 Document:</strong> ${data.documentName || 'Untitled'}</p>
              <p style="margin: 8px 0;"><strong>⏰ Expires:</strong> <span class="warning">${data.expiryDate || 'Soon'}</span></p>
              <p style="margin: 8px 0;"><strong>📅 Days remaining:</strong> ${data.daysRemaining || 'N/A'}</p>
            </div>
            
            <p>After expiration, this document will be automatically deleted and cannot be recovered.</p>
            
            <p style="text-align: center;">
              <a href="${data.documentUrl || '#'}" class="button">Download Now</a>
            </p>
            
            <p style="font-size: 14px; color: #64748b;">If you want to keep this document, please download it before the expiry date or extend its retention period in your account settings.</p>
          </div>
          <div class="footer">
            <p><strong>OmniPDFs</strong> - Keeping You Informed</p>
          </div>
        </div>
      </body>
      </html>
    `,

    // 8. Email Verification
    emailVerification: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="UTF-8">${baseStyle}</head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="logo">✉️ OmniPDFs</h1>
          </div>
          <div class="content">
            <h1>Verify Your Email Address</h1>
            <p>Hi ${data.name || 'there'},</p>
            <p>Thanks for signing up! Please verify your email address to activate your account and access all features.</p>
            
            <p style="text-align: center;">
              <a href="${data.verificationUrl || '#'}" class="button">Verify Email Address</a>
            </p>
            
            <div class="info-box">
              <p style="margin: 0;"><strong>⏰ This verification link expires in ${data.expiryHours || '24'} hours</strong></p>
            </div>
            
            <p>Once verified, you'll be able to:</p>
            <ul>
              <li>Upload and process documents</li>
              <li>Access premium features</li>
              <li>Collaborate with team members</li>
              <li>Receive important notifications</li>
            </ul>
            
            <div class="divider"></div>
            
            <p style="font-size: 14px; color: #64748b;">If you didn't create an account with OmniPDFs, you can safely ignore this email.</p>
          </div>
          <div class="footer">
            <p>If the button doesn't work, copy and paste this link:</p>
            <p style="word-break: break-all; font-size: 12px;">${data.verificationUrl || '#'}</p>
          </div>
        </div>
      </body>
      </html>
    `,

    // 9. Subscription Confirmation
    subscriptionConfirmed: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="UTF-8">${baseStyle}</head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="logo">🎉 OmniPDFs</h1>
          </div>
          <div class="content">
            <h1>Subscription Activated!</h1>
            <p>Hi ${data.name || 'there'},</p>
            <p>Congratulations! Your <strong class="highlight">${data.planName || 'Premium'}</strong> subscription is now active.</p>
            
            <div class="info-box">
              <p><strong>Subscription Details:</strong></p>
              <p style="margin: 8px 0;">📦 <strong>Plan:</strong> ${data.planName || 'Premium'}</p>
              <p style="margin: 8px 0;">💰 <strong>Price:</strong> ${data.price || 'N/A'} / ${data.billingCycle || 'month'}</p>
              <p style="margin: 8px 0;">📅 <strong>Started:</strong> ${data.startDate || new Date().toLocaleDateString()}</p>
              <p style="margin: 8px 0;">🔄 <strong>Next billing:</strong> ${data.nextBillingDate || 'N/A'}</p>
            </div>
            
            <h2>What's Included:</h2>
            <ul>
              ${(data.features || [
                'Unlimited conversions',
                'AI-powered tools',
                'Priority support',
                'Advanced analytics',
                'Team collaboration'
              ]).map(f => `<li>${f}</li>`).join('')}
            </ul>
            
            <p style="text-align: center;">
              <a href="${data.dashboardUrl || '#'}" class="button">Go to Dashboard</a>
            </p>
            
            <p style="font-size: 14px; color: #64748b;">You can manage your subscription anytime from your account settings.</p>
          </div>
          <div class="footer">
            <p><strong>OmniPDFs</strong> - Premium Experience</p>
          </div>
        </div>
      </body>
      </html>
    `,

    // 10. Payment Receipt
    paymentReceipt: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="UTF-8">${baseStyle}</head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="logo">💳 OmniPDFs</h1>
          </div>
          <div class="content">
            <h1>Payment Receipt</h1>
            <p>Hi ${data.name || 'there'},</p>
            <p>Thank you for your payment. Here are the details of your transaction:</p>
            
            <div class="info-box">
              <p><strong>Receipt #${data.receiptNumber || 'N/A'}</strong></p>
              <p style="margin: 12px 0;">📅 <strong>Date:</strong> ${data.paymentDate || new Date().toLocaleDateString()}</p>
              <p style="margin: 8px 0;">💰 <strong>Amount:</strong> ${data.amount || 'N/A'}</p>
              <p style="margin: 8px 0;">📦 <strong>Description:</strong> ${data.description || 'Subscription'}</p>
              <p style="margin: 8px 0;">💳 <strong>Payment method:</strong> ${data.paymentMethod || 'N/A'}</p>
              <p style="margin: 8px 0;">✅ <strong>Status:</strong> <span class="success">Paid</span></p>
            </div>
            
            <p style="text-align: center;">
              <a href="${data.invoiceUrl || '#'}" class="button">Download Invoice</a>
            </p>
            
            <p>If you have any questions about this payment, please contact our billing team at <a href="mailto:billing@omnipdfs.com">billing@omnipdfs.com</a></p>
          </div>
          <div class="footer">
            <p><strong>OmniPDFs</strong></p>
            <p style="font-size: 12px; margin-top: 8px;">This is an automated receipt. Please keep it for your records.</p>
          </div>
        </div>
      </body>
      </html>
    `,

    // 11. Team Invitation
    teamInvite: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="UTF-8">${baseStyle}</head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="logo">🏢 OmniPDFs</h1>
          </div>
          <div class="content">
            <h1>Join ${data.teamName || 'the Team'} on OmniPDFs</h1>
            <p>Hi ${data.recipientName || 'there'},</p>
            <p><strong>${data.invitedBy || 'An administrator'}</strong> has invited you to join their team on OmniPDFs.</p>
            
            <div class="info-box">
              <p><strong>Team:</strong> ${data.teamName || 'N/A'}</p>
              <p style="margin: 8px 0;"><strong>Your role:</strong> <span class="badge">${data.role || 'Member'}</span></p>
              ${data.message ? `<p style="margin: 12px 0; padding: 12px; background: white; border-radius: 4px;"><em>"${data.message}"</em></p>` : ''}
            </div>
            
            <p>As a team member, you'll be able to:</p>
            <ul>
              <li>Access shared documents and projects</li>
              <li>Collaborate in real-time</li>
              <li>Use team workflows and templates</li>
              <li>Track team analytics and activity</li>
            </ul>
            
            <p style="text-align: center;">
              <a href="${data.acceptUrl || '#'}" class="button">Accept Invitation</a>
            </p>
            
            <p style="font-size: 14px; color: #64748b;">This invitation will expire in ${data.expiryDays || '7'} days.</p>
          </div>
          <div class="footer">
            <p><strong>OmniPDFs</strong> - Team Productivity</p>
          </div>
        </div>
      </body>
      </html>
    `,

    // 12. Activity Alert
    activityAlert: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="UTF-8">${baseStyle}</head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="logo">🔔 OmniPDFs</h1>
          </div>
          <div class="content">
            <h1>New Activity Alert</h1>
            <p>Hi ${data.name || 'there'},</p>
            <p>There's new activity on your account:</p>
            
            <div class="info-box">
              <p><strong>Activity:</strong> ${data.activityType || 'New Activity'}</p>
              <p style="margin: 8px 0;"><strong>By:</strong> ${data.activityBy || 'System'}</p>
              <p style="margin: 8px 0;"><strong>When:</strong> ${data.activityTime || new Date().toLocaleString()}</p>
              <p style="margin: 8px 0;"><strong>Document:</strong> ${data.documentName || 'N/A'}</p>
            </div>
            
            ${data.description ? `<p>${data.description}</p>` : ''}
            
            <p style="text-align: center;">
              <a href="${data.activityUrl || '#'}" class="button">View Details</a>
            </p>
            
            <p style="font-size: 14px; color: #64748b;">You're receiving this because you have activity notifications enabled. You can manage your notification preferences in account settings.</p>
          </div>
          <div class="footer">
            <p><strong>OmniPDFs</strong> - Stay Informed</p>
          </div>
        </div>
      </body>
      </html>
    `,

    // 13. OCR Complete
    ocrComplete: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="UTF-8">${baseStyle}</head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="logo">🔍 OmniPDFs</h1>
          </div>
          <div class="content">
            <h1>OCR Processing Complete ✅</h1>
            <p>Hi ${data.name || 'there'},</p>
            <p>Your OCR processing is complete! Text has been successfully extracted from your document.</p>
            
            <div class="info-box">
              <p><strong>Document:</strong> ${data.documentName || 'Untitled'}</p>
              <p style="margin: 8px 0;"><strong>Pages processed:</strong> ${data.pageCount || 'N/A'}</p>
              <p style="margin: 8px 0;"><strong>Confidence score:</strong> <span class="success">${data.confidenceScore || '95'}%</span></p>
              <p style="margin: 8px 0;"><strong>Processing time:</strong> ${data.processingTime || 'N/A'}</p>
            </div>
            
            <p style="text-align: center;">
              <a href="${data.resultUrl || '#'}" class="button">View Extracted Text</a>
            </p>
            
            <p>You can now search, edit, and use the extracted text in your documents.</p>
          </div>
          <div class="footer">
            <p><strong>OmniPDFs</strong> - AI-Powered OCR</p>
          </div>
        </div>
      </body>
      </html>
    `,

    // 14. Export Ready
    exportReady: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="UTF-8">${baseStyle}</head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="logo">📦 OmniPDFs</h1>
          </div>
          <div class="content">
            <h1>Your Export is Ready!</h1>
            <p>Hi ${data.name || 'there'},</p>
            <p>Great news! Your document export has been prepared and is ready for download.</p>
            
            <div class="info-box">
              <p><strong>Export Details:</strong></p>
              <p style="margin: 8px 0;">📄 <strong>Documents:</strong> ${data.documentCount || 'N/A'} file(s)</p>
              <p style="margin: 8px 0;">📦 <strong>Total size:</strong> ${data.totalSize || 'N/A'}</p>
              <p style="margin: 8px 0;">📁 <strong>Format:</strong> ${data.format || 'ZIP'}</p>
            </div>
            
            <p style="text-align: center;">
              <a href="${data.downloadUrl || '#'}" class="button">Download Export</a>
            </p>
            
            <p style="font-size: 14px; color: #64748b;">This download link will expire in ${data.expiryHours || '48'} hours.</p>
          </div>
          <div class="footer">
            <p><strong>OmniPDFs</strong> - Export Anytime</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  return templates[type] || templates.welcome;
};

// Helper function to send email using the templates
export const sendTransactionalEmail = async (type, recipientEmail, recipientName, data = {}) => {
  const { base44 } = await import('@/api/base44Client');
  
  const enrichedData = {
    ...data,
    name: recipientName,
    recipientName: recipientName,
  };
  
  const htmlContent = getEmailTemplate(type, enrichedData);
  
  const subjects = {
    welcome: '🎉 Welcome to OmniPDFs - Let\'s Get Started!',
    passwordReset: '🔐 Reset Your OmniPDFs Password',
    documentUploaded: '✅ Document Uploaded Successfully',
    conversionComplete: '⚡ Your Conversion is Ready!',
    documentShared: '🤝 New Document Shared with You',
    collaborationInvite: '👥 You\'re Invited to Collaborate',
    documentExpiring: '⚠️ Document Expiring Soon',
    emailVerification: '✉️ Verify Your Email Address',
    subscriptionConfirmed: '🎉 Subscription Activated!',
    paymentReceipt: '💳 Payment Receipt from OmniPDFs',
    teamInvite: '🏢 Team Invitation from OmniPDFs',
    activityAlert: '🔔 New Activity Alert',
    ocrComplete: '🔍 OCR Processing Complete',
    exportReady: '📦 Your Export is Ready',
  };
  
  await base44.integrations.Core.SendEmail({
    from_name: 'OmniPDFs',
    to: recipientEmail,
    subject: subjects[type] || 'Notification from OmniPDFs',
    body: htmlContent,
  });
};

export { getEmailTemplate };