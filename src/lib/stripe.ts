import Stripe from 'stripe';

if (!process.env.STRIPE_API_KEY) {
  throw new Error('STRIPE_API_KEY is not set in environment variables');
}

/**
 * Configures the shared Stripe SDK instance used across server modules.
 *
 * @example
 * ```ts
 * const customer = await stripe.customers.create({ email })
 * ```
 *
 * @throws {Stripe.errors.StripeError} When Stripe rejects API requests or credentials are invalid.
 * @returns {Stripe} A preconfigured Stripe client targeting the 2024-04-10 API version.
 */
export const stripe = new Stripe(process.env.STRIPE_API_KEY, {
  apiVersion: '2025-02-24.acacia',
  typescript: true,
});

