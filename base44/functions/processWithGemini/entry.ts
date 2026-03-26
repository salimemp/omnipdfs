import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import { GoogleGenerativeAI } from 'npm:@google/generative-ai@0.21.0';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { prompt, fileUrl, action } = await req.json();

    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) {
      return Response.json({ error: 'Gemini API key not configured' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    let result;

    if (fileUrl) {
      // Fetch file and convert to base64
      const fileResponse = await fetch(fileUrl);
      const fileBuffer = await fileResponse.arrayBuffer();
      const base64 = btoa(String.fromCharCode(...new Uint8Array(fileBuffer)));
      
      const mimeType = fileResponse.headers.get('content-type') || 'application/pdf';

      result = await model.generateContent([
        {
          inlineData: {
            mimeType,
            data: base64,
          },
        },
        prompt || getPromptForAction(action),
      ]);
    } else {
      result = await model.generateContent(prompt || getPromptForAction(action));
    }

    const response = result.response;
    const text = response.text();

    return Response.json({ 
      success: true, 
      result: text,
      action 
    });

  } catch (error) {
    console.error('Gemini processing error:', error);
    return Response.json({ 
      error: error.message || 'Failed to process with Gemini' 
    }, { status: 500 });
  }
});

function getPromptForAction(action) {
  const prompts = {
    summarize: 'Provide a concise summary of this document, highlighting the key points and main ideas.',
    translate: 'Translate this document to the target language while preserving formatting and meaning.',
    extract: 'Extract all important information, facts, and data from this document in a structured format.',
    analyze: 'Analyze this document and provide insights, themes, and important observations.',
    'auto-tag': 'Generate relevant tags and keywords for this document based on its content.',
  };
  
  return prompts[action] || 'Analyze and process this document.';
}