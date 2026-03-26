import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, timeRange = '30d' } = await req.json();

    if (action === 'get_insights') {
      const documents = await base44.entities.Document.filter({ created_by: user.email });
      const activities = await base44.entities.ActivityLog.filter({ created_by: user.email });
      const conversions = await base44.entities.ConversionJob.filter({ created_by: user.email });

      const now = new Date();
      const daysAgo = parseInt(timeRange);
      const startDate = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));

      const recentDocs = documents.filter(d => new Date(d.created_date) > startDate);
      const recentActivities = activities.filter(a => new Date(a.created_date) > startDate);
      const recentConversions = conversions.filter(c => new Date(c.created_date) > startDate);

      // Calculate metrics
      const totalDocs = recentDocs.length;
      const totalConversions = recentConversions.length;
      const successfulConversions = recentConversions.filter(c => c.status === 'completed').length;
      const conversionRate = totalConversions > 0 ? (successfulConversions / totalConversions * 100).toFixed(1) : 0;

      // File type distribution
      const fileTypes = {};
      recentDocs.forEach(doc => {
        fileTypes[doc.file_type] = (fileTypes[doc.file_type] || 0) + 1;
      });

      // Activity distribution
      const activityTypes = {};
      recentActivities.forEach(act => {
        activityTypes[act.action] = (activityTypes[act.action] || 0) + 1;
      });

      // Daily activity trend
      const dailyActivity = {};
      for (let i = 0; i < daysAgo; i++) {
        const date = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000));
        const dateStr = date.toISOString().split('T')[0];
        dailyActivity[dateStr] = 0;
      }
      recentActivities.forEach(act => {
        const dateStr = new Date(act.created_date).toISOString().split('T')[0];
        if (dailyActivity[dateStr] !== undefined) {
          dailyActivity[dateStr]++;
        }
      });

      // Generate AI insights
      const prompt = `Analyze this document management data and provide 3-4 actionable insights:
      - Total documents: ${totalDocs}
      - Total conversions: ${totalConversions}
      - Success rate: ${conversionRate}%
      - File types: ${JSON.stringify(fileTypes)}
      - Activities: ${JSON.stringify(activityTypes)}
      
      Provide brief, actionable insights about usage patterns, efficiency, and recommendations.`;

      const aiResponse = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            insights: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  impact: { type: "string", enum: ["high", "medium", "low"] }
                }
              }
            }
          }
        }
      });

      return Response.json({
        success: true,
        metrics: {
          totalDocuments: totalDocs,
          totalConversions,
          successRate: conversionRate,
          fileTypes,
          activityTypes,
          dailyActivity: Object.entries(dailyActivity).map(([date, count]) => ({ date, count }))
        },
        insights: aiResponse.insights || []
      });
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('AI Analytics error:', error);
    return Response.json({ 
      error: error.message || 'Analytics failed' 
    }, { status: 500 });
  }
});