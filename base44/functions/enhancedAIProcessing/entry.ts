import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import { GoogleGenerativeAI } from 'npm:@google/generative-ai@0.21.0';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, fileUrl, options = {} } = await req.json();

    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) {
      return Response.json({ error: 'Gemini API key not configured' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    let fileData;
    if (fileUrl) {
      const fileResponse = await fetch(fileUrl);
      const fileBuffer = await fileResponse.arrayBuffer();
      const base64 = btoa(String.fromCharCode(...new Uint8Array(fileBuffer)));
      const mimeType = fileResponse.headers.get('content-type') || 'application/pdf';
      
      fileData = {
        inlineData: { mimeType, data: base64 }
      };
    }

    let result;

    switch (action) {
      case 'extract_data': {
        const prompt = `Extract structured data from this PDF document. Return a JSON object with:
- title: Document title
- date: Document date if present
- entities: List of names, organizations, locations mentioned
- key_data: Important numbers, dates, or facts
- document_type: Type of document (invoice, contract, report, etc.)`;
        
        result = await model.generateContent([fileData, prompt]);
        break;
      }

      case 'compare_documents': {
        const { secondFileUrl } = options;
        if (!secondFileUrl) {
          throw new Error('Second file URL required for comparison');
        }
        
        const file2Response = await fetch(secondFileUrl);
        const file2Buffer = await file2Response.arrayBuffer();
        const base64_2 = btoa(String.fromCharCode(...new Uint8Array(file2Buffer)));
        
        const prompt = `Compare these two documents and provide:
- Similarities: What content is shared
- Differences: What has changed
- Added content: New sections or information
- Removed content: What was removed
- Summary: Overall comparison summary`;
        
        result = await model.generateContent([
          fileData,
          { inlineData: { mimeType: 'application/pdf', data: base64_2 } },
          prompt
        ]);
        break;
      }

      case 'generate_questions': {
        const prompt = `Based on this document, generate 10 insightful questions that:
- Test comprehension of key concepts
- Explore deeper implications
- Challenge assumptions
- Encourage critical thinking
Return as a JSON array of question objects with "question" and "difficulty" (easy/medium/hard) fields.`;
        
        result = await model.generateContent([fileData, prompt]);
        break;
      }

      case 'create_outline': {
        const prompt = `Create a detailed outline of this document with:
- Main sections and subsections
- Key points under each section
- Page numbers if available
- Estimated importance (high/medium/low) for each section
Format as hierarchical JSON structure.`;
        
        result = await model.generateContent([fileData, prompt]);
        break;
      }

      case 'sentiment_analysis': {
        const prompt = `Analyze the sentiment and tone of this document:
- Overall sentiment (positive/negative/neutral)
- Tone (formal/informal/persuasive/informative)
- Key emotional triggers
- Target audience
- Writing style characteristics`;
        
        result = await model.generateContent([fileData, prompt]);
        break;
      }

      default:
        return Response.json({ error: 'Invalid action' }, { status: 400 });
    }

    const response = result.response;
    const text = response.text();

    return Response.json({ 
      success: true, 
      result: text,
      action 
    });

  } catch (error) {
    console.error('Enhanced AI processing error:', error);
    return Response.json({ 
      error: error.message || 'Failed to process document' 
    }, { status: 500 });
  }
});