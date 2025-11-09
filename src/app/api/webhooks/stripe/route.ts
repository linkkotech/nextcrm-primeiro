import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('STRIPE_WEBHOOK_SECRET is not set');
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    );
  }

  let event: Stripe.Event;

  try {
    // Verificar a assinatura do evento
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    const error = err as Error;
    console.error('Webhook signature verification failed:', error.message);
    return NextResponse.json(
      { error: `Webhook Error: ${error.message}` },
      { status: 400 }
    );
  }

  // Processar o evento baseado no tipo
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Buscar o workspace pelo client_reference_id ou metadata
        const workspaceId = session.client_reference_id || 
          (session.metadata?.workspaceId as string | undefined);

        if (!workspaceId) {
          console.error('No workspace ID found in checkout session');
          // Retornar 200 para evitar retentativas do Stripe
          return NextResponse.json({ received: true });
        }

        // Buscar a subscription e customer do Stripe
        const subscriptionId = session.subscription as string | null;
        const customerId = session.customer as string | null;

        if (!subscriptionId || !customerId) {
          console.error('Missing subscription or customer ID in checkout session');
          return NextResponse.json({ received: true });
        }

        // Buscar a subscription para obter o price_id
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const priceId = subscription.items.data[0]?.price.id;

        // Atualizar o workspace com os dados do Stripe
        await prisma.workspace.update({
          where: { id: workspaceId },
          data: {
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscriptionId,
            stripePriceId: priceId || null,
            stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
          },
        });

        console.log(`Workspace ${workspaceId} updated with Stripe subscription ${subscriptionId}`);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = invoice.subscription as string | null;

        if (!subscriptionId) {
          console.error('No subscription ID found in invoice');
          return NextResponse.json({ received: true });
        }

        // Buscar a subscription para obter o current_period_end
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);

        // Atualizar o workspace com a nova data de término do período
        await prisma.workspace.update({
          where: { stripeSubscriptionId: subscriptionId },
          data: {
            stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
          },
        });

        console.log(`Updated current_period_end for subscription ${subscriptionId}`);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const subscriptionId = subscription.id;

        // Limpar os campos de assinatura do workspace
        await prisma.workspace.updateMany({
          where: { stripeSubscriptionId: subscriptionId },
          data: {
            stripeSubscriptionId: null,
            stripePriceId: null,
            stripeCurrentPeriodEnd: null,
            // Manter o stripeCustomerId para possível reativação futura
          },
        });

        console.log(`Cleared subscription data for subscription ${subscriptionId}`);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    // Sempre retornar 200 OK para o Stripe
    return NextResponse.json({ received: true });
  } catch (error) {
    // Logar o erro mas ainda retornar 200 para evitar retentativas
    console.error('Error processing webhook:', error);
    return NextResponse.json({ received: true });
  }
}

