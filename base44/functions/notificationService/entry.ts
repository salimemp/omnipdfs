import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, notificationData } = await req.json();

    switch (action) {
      case 'send':
        // Send notification
        const { type, title, message, recipients } = notificationData;
        
        if (!type || !title || !message) {
          return Response.json({ 
            error: 'Type, title, and message are required' 
          }, { status: 400 });
        }

        // Send email notification if enabled
        if (recipients && recipients.length > 0) {
          for (const recipient of recipients) {
            try {
              await base44.integrations.Core.SendEmail({
                to: recipient,
                subject: `[OmniPDFs] ${title}`,
                body: `
                  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #8b5cf6;">${title}</h2>
                    <p>${message}</p>
                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
                    <p style="color: #6b7280; font-size: 12px;">
                      You received this notification from OmniPDFs. 
                      <a href="https://omnipdfs.com/settings">Manage notification preferences</a>
                    </p>
                  </div>
                `
              });
            } catch (error) {
              console.error(`Failed to send email to ${recipient}:`, error);
            }
          }
        }

        // Log notification
        await base44.entities.ActivityLog.create({
          action: 'notification',
          details: {
            type,
            title,
            message,
            recipientCount: recipients?.length || 0
          }
        });

        return Response.json({
          success: true,
          message: 'Notification sent successfully'
        });

      case 'broadcast':
        // Broadcast to all users
        const { broadcastTitle, broadcastMessage, broadcastType } = notificationData;
        
        const users = await base44.asServiceRole.entities.User.list();
        let sentCount = 0;

        for (const recipient of users) {
          try {
            await base44.integrations.Core.SendEmail({
              to: recipient.email,
              subject: `[OmniPDFs] ${broadcastTitle}`,
              body: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                  <h2 style="color: #8b5cf6;">${broadcastTitle}</h2>
                  <p>${broadcastMessage}</p>
                </div>
              `
            });
            sentCount++;
          } catch (error) {
            console.error(`Failed to broadcast to ${recipient.email}:`, error);
          }
        }

        return Response.json({
          success: true,
          message: `Broadcast sent to ${sentCount} users`
        });

      case 'schedule':
        // Schedule notification for later
        const { scheduleTime, scheduleData } = notificationData;
        
        // In production, use a job queue or scheduler
        return Response.json({
          success: true,
          message: 'Notification scheduled',
          scheduledFor: scheduleTime
        });

      default:
        return Response.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('Notification service error:', error);
    return Response.json({ 
      error: error.message || 'Notification service failed' 
    }, { status: 500 });
  }
});