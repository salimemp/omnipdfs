import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, sessionData } = await req.json();

    if (action === 'verify_session') {
      const {
        deviceFingerprint,
        os,
        browser,
        deviceType,
        ipAddress,
        location,
        screenResolution
      } = sessionData;

      // Find existing sessions for this user
      const existingSessions = await base44.entities.UserSession.filter({ 
        user_email: user.email,
        is_active: true 
      });

      let needsVerification = false;
      let reason = '';

      if (existingSessions.length > 0) {
        const lastSession = existingSessions[0];

        // Check for significant changes
        if (lastSession.device_fingerprint !== deviceFingerprint) {
          needsVerification = true;
          reason = 'Different device detected';
        } else if (lastSession.ip_address !== ipAddress) {
          needsVerification = true;
          reason = 'Different IP address detected';
        } else if (lastSession.os !== os) {
          needsVerification = true;
          reason = 'Different operating system detected';
        } else if (lastSession.location?.country !== location?.country) {
          needsVerification = true;
          reason = 'Different location detected';
        }
      }

      // Create or update session
      const sessionToken = crypto.randomUUID();
      
      if (needsVerification) {
        // Mark old sessions as requiring verification
        for (const session of existingSessions) {
          await base44.entities.UserSession.update(session.id, {
            verification_required: true,
            is_active: false
          });
        }

        // Create new session requiring verification
        const newSession = await base44.entities.UserSession.create({
          user_email: user.email,
          device_fingerprint: deviceFingerprint,
          os,
          browser,
          device_type: deviceType,
          ip_address: ipAddress,
          location,
          screen_resolution: screenResolution,
          is_verified: false,
          verification_required: true,
          session_token: sessionToken
        });

        // Log suspicious activity
        await base44.entities.ActivityLog.create({
          action: 'security_alert',
          document_name: 'Session Verification',
          details: {
            reason,
            user_email: user.email,
            old_device: existingSessions[0]?.device_fingerprint,
            new_device: deviceFingerprint,
            old_ip: existingSessions[0]?.ip_address,
            new_ip: ipAddress
          }
        });

        return Response.json({
          success: true,
          needsVerification: true,
          reason,
          sessionId: newSession.id
        });
      }

      // Update existing session or create new one
      if (existingSessions.length > 0) {
        await base44.entities.UserSession.update(existingSessions[0].id, {
          last_verified_date: new Date().toISOString(),
          is_verified: true,
          verification_required: false
        });

        return Response.json({
          success: true,
          needsVerification: false,
          sessionId: existingSessions[0].id
        });
      }

      // First time login - create session
      const newSession = await base44.entities.UserSession.create({
        user_email: user.email,
        device_fingerprint: deviceFingerprint,
        os,
        browser,
        device_type: deviceType,
        ip_address: ipAddress,
        location,
        screen_resolution: screenResolution,
        is_verified: true,
        verification_required: false,
        last_verified_date: new Date().toISOString(),
        session_token: sessionToken
      });

      return Response.json({
        success: true,
        needsVerification: false,
        sessionId: newSession.id,
        isFirstTime: true
      });
    }

    if (action === 'confirm_verification') {
      const { sessionId } = sessionData;

      await base44.entities.UserSession.update(sessionId, {
        is_verified: true,
        verification_required: false,
        is_active: true,
        last_verified_date: new Date().toISOString()
      });

      return Response.json({ success: true });
    }

    if (action === 'get_sessions') {
      const sessions = await base44.entities.UserSession.filter({ 
        user_email: user.email 
      });

      return Response.json({ success: true, sessions });
    }

    if (action === 'revoke_session') {
      const { sessionId } = sessionData;

      await base44.entities.UserSession.update(sessionId, {
        is_active: false
      });

      return Response.json({ success: true });
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('Session verification error:', error);
    return Response.json({ 
      error: error.message || 'Verification failed' 
    }, { status: 500 });
  }
});