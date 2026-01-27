import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { prompt } = await req.json();

    const result = await base44.integrations.Core.GenerateImage({
      prompt: prompt || "Modern minimalist logo for OmniPDF document management app. A sleek geometric icon combining a document/paper shape with abstract flowing lines representing collaboration and AI. Use gradient colors of violet purple and cyan blue. Clean, professional, tech-forward design. White background. Simple and memorable icon that works at small sizes. Vector style illustration, flat design, no text."
    });

    return Response.json({ url: result.url });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});