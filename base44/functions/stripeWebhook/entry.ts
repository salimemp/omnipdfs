import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import Stripe from 'npm:stripe@17.5.0';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  
  const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
  
  if (!stripeKey || !webhookSecret) {
    return Response.json({ error: 'Stripe not configured' }, { status: 500 });
  }

  try {
    const stripe = new Stripe(stripeKey, { apiVersion: '2024-12-18.acacia' });
    
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    const event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      webhookSecret
    );

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.metadata?.user_id;
        
        if (userId) {
          const users = await base44.asServiceRole.entities.User.filter({ id: userId });
          if (users.length > 0) {
            await base44.asServiceRole.entities.User.update(userId, {
              subscription_tier: 'premium',
              subscription_status: 'active'
            });
          }
        }
        break;
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const customerId = subscription.customer;
        
        const users = await base44.asServiceRole.entities.User.filter({ 
          stripe_customer_id: customerId 
        });
        
        if (users.length > 0) {
          const status = subscription.status === 'active' ? 'active' : 'inactive';
          const tier = subscription.status === 'active' ? 'premium' : 'free';
          
          await base44.asServiceRole.entities.User.update(users[0].id, {
            subscription_status: status,
            subscription_tier: tier
          });
        }
        break;
      }
    }

    return Response.json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return Response.json({ 
      error: error.message 
    }, { status: 400 });
  }
});