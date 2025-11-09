import Stripe from 'stripe';

if (!process.env.STRIPE_API_KEY) {
  throw new Error('STRIPE_API_KEY is not set in environment variables');
}

export const stripe = new Stripe(process.env.STRIPE_API_KEY, {
  apiVersion: '2024-04-10',
  typescript: true,
});

