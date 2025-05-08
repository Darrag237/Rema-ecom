import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import dbConnect from "@/lib/db"
import Order from "@/models/order"
import Product from "@/models/product"

// الحصول على طلب محدد
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    const orderId = params.id

    // التحقق من تسجيل الدخول
    if (!session) {
      return NextResponse.json({ message: "يجب تسجيل الدخول للوصول إلى الطلب" }, { status: 401 })
    }

    await dbConnect()

    // البحث عن الطلب
    const order = await Order.findById(orderId)

    if (!order) {
      return NextResponse.json({ message: "الطلب غير موجود" }, { status: 404 })
    }

    // التحقق من صلاحيات المستخدم
    if (session.user.role !== "admin" && session.user.role !== "seller" && order.user.toString() !== session.user.id) {
      return NextResponse.json({ message: "غير مصرح لك بالوصول إلى هذا الطلب" }, { status: 403 })
    }

    // إذا كان المستخدم بائعًا، تحقق مما إذا كان الطلب يحتوي على منتجاته
    if (session.user.role === "seller") {
      const sellerProducts = await getSellerProducts(session.user.id)
      const hasSellerProduct = order.orderItems.some((item) => sellerProducts.includes(item.product.toString()))

      if (!hasSellerProduct) {
        return NextResponse.json({ message: "غير مصرح لك بالوصول إلى هذا الطلب" }, { status: 403 })
      }
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error("Error fetching order:", error)
    return NextResponse.json({ message: "حدث خطأ أثناء جلب الطلب" }, { status: 500 })
  }
}

// تحديث حالة الطلب
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    const orderId = params.id

    // التحقق من تسجيل الدخول
    if (!session) {
      return NextResponse.json({ message: "يجب تسجيل الدخول لتحديث الطلب" }, { status: 401 })
    }

    // التحقق من صلاحيات المستخدم (المدير فقط)
    if (session.user.role !== "admin") {
      return NextResponse.json({ message: "غير مصرح لك بتحديث حالة الطلب" }, { status: 403 })
    }

    const { status, trackingNumber, isPaid, isDelivered } = await request.json()

    await dbConnect()

    // البحث عن الطلب
    const order = await Order.findById(orderId)

    if (!order) {
      return NextResponse.json({ message: "الطلب غير موجود" }, { status: 404 })
    }

    // تحديث حالة الطلب
    if (status) order.status = status
    if (trackingNumber) order.trackingNumber = trackingNumber

    // تحديث حالة الدفع
    if (isPaid !== undefined) {
      order.isPaid = isPaid
      if (isPaid) order.paidAt = new Date()
    }

    // تحديث حالة التوصيل
    if (isDelivered !== undefined) {
      order.isDelivered = isDelivered
      if (isDelivered) order.deliveredAt = new Date()
    }

    // حفظ الطلب
    await order.save()

    return NextResponse.json({ message: "تم تحديث الطلب بنجاح", order }, { status: 200 })
  } catch (error) {
    console.error("Error updating order:", error)
    return NextResponse.json({ message: "حدث خطأ أثناء تحديث الطلب" }, { status: 500 })
  }
}

// دالة مساعدة للحصول على منتجات البائع
async function getSellerProducts(sellerId: string) {
  const products = await Product.find({ seller: sellerId })
  return products.map((product) => product._id.toString())
}
