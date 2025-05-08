import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import Stripe from "stripe"
import dbConnect from "@/lib/db"
import Order from "@/models/order"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    // التحقق من تسجيل الدخول
    if (!session) {
      return NextResponse.json({ message: "يجب تسجيل الدخول لإتمام عملية الدفع" }, { status: 401 })
    }

    const { orderId } = await request.json()

    if (!orderId) {
      return NextResponse.json({ message: "الرجاء تحديد الطلب" }, { status: 400 })
    }

    await dbConnect()

    // البحث عن الطلب
    const order = await Order.findById(orderId)

    if (!order) {
      return NextResponse.json({ message: "الطلب غير موجود" }, { status: 404 })
    }

    // التحقق من صلاحيات المستخدم
    if (order.user.toString() !== session.user.id) {
      return NextResponse.json({ message: "غير مصرح لك بالوصول إلى هذا الطلب" }, { status: 403 })
    }

    // التحقق من أن الطلب لم يتم دفعه بالفعل
    if (order.isPaid) {
      return NextResponse.json({ message: "تم دفع هذا الطلب بالفعل" }, { status: 400 })
    }

    // إنشاء جلسة دفع Stripe
    const lineItems = order.orderItems.map((item) => ({
      price_data: {
        currency: "sar",
        product_data: {
          name: item.name,
          images: [item.image],
          metadata: {
            productId: item.product.toString(),
            color: item.color,
            size: item.size,
          },
        },
        unit_amount: Math.round(item.price * 100), // تحويل إلى هللات
      },
      quantity: item.quantity,
    }))

    // إضافة الشحن والضريبة
    if (order.shippingPrice > 0) {
      lineItems.push({
        price_data: {
          currency: "sar",
          product_data: {
            name: "رسوم الشحن",
          },
          unit_amount: Math.round(order.shippingPrice * 100),
        },
        quantity: 1,
      })
    }

    if (order.taxPrice > 0) {
      lineItems.push({
        price_data: {
          currency: "sar",
          product_data: {
            name: "ضريبة القيمة المضافة (15%)",
          },
          unit_amount: Math.round(order.taxPrice * 100),
        },
        quantity: 1,
      })
    }

    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/orders/${orderId}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/orders/${orderId}/cancel`,
      metadata: {
        orderId: orderId,
        userId: session.user.id,
      },
    })

    return NextResponse.json({ url: stripeSession.url })
  } catch (error) {
    console.error("Error creating payment session:", error)
    return NextResponse.json({ message: "حدث خطأ أثناء إنشاء جلسة الدفع" }, { status: 500 })
  }
}
