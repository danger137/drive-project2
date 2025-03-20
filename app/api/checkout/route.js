import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const { email, paymentMethodId, priceId } = await req.json();

  try {
    // Create a customer in Stripe
    const customer = await stripe.customers.create({
      payment_method: paymentMethodId,
      email: email,
      invoice_settings: { default_payment_method: paymentMethodId },
    });

    // Create a subscription
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      expand: ['latest_invoice.payment_intent'],
    });

    return new Response(JSON.stringify(subscription), { status: 200 });
  } catch (error) {
    console.error('Subscription creation failed:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
