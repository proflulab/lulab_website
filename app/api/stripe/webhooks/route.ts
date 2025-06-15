import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { sql } from '@/lib/db/connection';
import { stripe, Stripe } from '../../../../lib/stripe'

export async function POST(request: Request) {
  let event

  try {
    event = stripe.webhooks.constructEvent(
      await request.text(),
      (await headers()).get('stripe-signature') || '',
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    const errorMessage = (err as Error).message
    // On error, log and return the error message.
    if (err) console.log(err)
    console.log(`Error message: ${errorMessage}`)
    return NextResponse.json(
      { message: `Webhook Error: ${errorMessage}` },
      { status: 400 }
    )
  }

  const permittedEvents = ['checkout.session.completed']

  if (permittedEvents.includes(event.type)) {
    let data

    try {
      switch (event.type) {
        case 'checkout.session.completed':
          data = event.data.object
          console.log(`CheckoutSession status: ${data.payment_status}`)

          // 处理支付成功事件，保存订单信息
          await handleCheckoutSessionCompleted(data)
          break
        default:
          throw new Error(`Unhandled event: ${event.type}`)
      }
    } catch (error) {
      console.log(error)
      return NextResponse.json(
        { message: 'Webhook handler failed' },
        { status: 500 }
      )
    }
  }
  // Return a response to acknowledge receipt of the event.
  return NextResponse.json({ message: 'Received' }, { status: 200 })
}

// 处理结账会话完成事件


async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  try {
    const channelCode = session.metadata?.affiliate;
    let channelId = null;

    // 如果有渠道代码，查找对应的渠道ID
    if (channelCode) {
      const channelResult = await sql`
        SELECT id FROM channels WHERE code = ${channelCode}
      `;

      if (channelResult.length > 0) {
        channelId = channelResult[0].id;
      }
    }

    // 保存订单信息到数据库
    await sql`
      INSERT INTO orders (
        source,
        external_order_id,
        payment_session_id,
        payment_intent_id,
        channel_id,
        customer_email,
        amount,
        currency,
        status,
        metadata
      ) VALUES (
        'stripe',
        ${session.id},
        ${session.id},
        ${session.payment_intent},
        ${channelId},
        ${session.customer_details?.email},
        ${session.amount_total},
        ${session.currency},
        ${session.status},
        ${JSON.stringify(session)}
      )
    `;

    console.log(`Order saved for session ${session.id}`);
  } catch (error) {
    console.error('Error saving order:', error);
    throw error;
  }
}