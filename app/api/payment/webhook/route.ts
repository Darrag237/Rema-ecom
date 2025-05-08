import { NextResponse } from "next/server"
import { headers } from "next/headers"
import Stripe from "stripe"
import dbConnect from "@/lib/db"
import Order from "@/models/order"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(request: Request) {
  try {
    const body = await request.text()
    const signature = headers().get("stripe-signature") as string

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, endpointSecret!)
    } catch (error: any) {
      console.error(`Webhook signature verification failed: ${error.message}`)
      return NextResponse.json({ message: "Webhook signature verification failed" }, { status: 400 })
    }

    // معالجة الأحداث المختلفة من Stripe
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session

      // تحديث حالة الطلب
      await handleSuccessfulPayment(session)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Error processing webhook:", error)
    return NextResponse.json({ message: "حدث خطأ أثناء معالجة webhook" }, { status: 500 })
  }
}

// دالة لمعالجة الدفع الناجح
async function handleSuccessfulPayment(session: Stripe.Checkout.Session) {
  const orderId = session.metadata?.orderId

  if (!orderId) {
    console.error("No order ID found in session metadata")
    return
  }

  await dbConnect()

  // البحث عن الطلب وتحديثه
  const order = await Order.findById(orderId)

  if (!order) {
    console.error(`Order not found: ${orderId}`)
    return
  }

  // تحديث حالة الدفع
  order.isPaid = true
  order.paidAt = new Date()
  order.status = "processing"
  order.paymentResult = {
    id: session.id,
    status: session.payment_status,
    update_time: new Date().toISOString(),
    email_address: session.customer_details?.email || "",
  }

  await order.save()

  console.log(`Payment successful for order: ${orderId}`)
}
