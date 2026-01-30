import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const documents = await base44.entities.Document.filter({ created_by: user.email });
    const conversions = await base44.entities.ConversionJob.filter({ created_by: user.email });
    const activities = await base44.entities.ActivityLog.filter({ created_by: user.email });

    const totalFiles = documents.length;
    const totalConversions = conversions.filter(c => c.status === 'completed').length;
    const totalStorage = documents.reduce((sum, doc) => sum + (doc.file_size || 0), 0);
    
    const recentActivity = activities
      .sort((a, b) => new Date(b.created_date) - new Date(a.created_date))
      .slice(0, 10);

    const userStatus = user.role === 'admin' ? 'premium' : 'free';
    const storageLimit = userStatus === 'premium' ? 100 * 1024 * 1024 * 1024 : 5 * 1024 * 1024 * 1024; // 100GB vs 5GB

    return Response.json({
      success: true,
      statistics: {
        total_files: totalFiles,
        total_conversions: totalConversions,
        total_storage: totalStorage,
        storage_limit: storageLimit,
        storage_percentage: (totalStorage / storageLimit) * 100,
        status: userStatus,
        recent_activity: recentActivity
      }
    });

  } catch (error) {
    console.error('User statistics error:', error);
    return Response.json({ 
      error: error.message || 'Failed to fetch statistics' 
    }, { status: 500 });
  }
});