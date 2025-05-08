import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import dbConnect from "@/lib/db"
import Order from "@/models/order"
import Cart from "@/models/cart"
import Product from "@/models/product"

// الحصول على طلبات المستخدم
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    // التحقق من تسجيل الدخول
    if (!session) {
      return NextResponse.json({ message: "يجب تسجيل الدخول للوصول إلى الطلبات" }, { status: 401 })
    }

    await dbConnect()

    let orders

    // المدير يمكنه رؤية جميع الطلبات
    if (session.user.role === "admin") {
      orders = await Order.find({}).sort({ createdAt: -1 })
    }
    // البائع يمكنه رؤية الطلبات التي تحتوي على منتجاته فقط
    else if (session.user.role === "seller") {
      // البحث عن الطلبات التي تحتوي على منتجات البائع
      orders = await Order.find({
        "orderItems.product": { $in: await getSellerProducts(session.user.id) },
      }).sort({ createdAt: -1 })
    }
    // المستخدم العادي يمكنه رؤية طلباته فقط
    else {
      orders = await Order.find({ user: session.user.id }).sort({ createdAt: -1 })
    }

    return NextResponse.json(orders)
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ message: "حدث خطأ أثناء جلب الطلبات" }, { status: 500 })
  }
}

// إنشاء طلب جديد
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    // التحقق من تسجيل الدخول
    if (!session) {
      return NextResponse.json({ message: "يجب تسجيل الدخول لإنشاء طلب" }, { status: 401 })
    }

    const { shippingAddress, paymentMethod } = await request.json()

    // التحقق من البيانات
    if (!shippingAddress || !paymentMethod) {
      return NextResponse.json({ message: "الرجاء إدخال جميع البيانات المطلوبة" }, { status: 400 })
    }

    await dbConnect()

    // البحث عن سلة التسوق للمستخدم
    const cart = await Cart.findOne({ user: session.user.id })

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ message: "سلة التسوق فارغة" }, { status: 400 })
    }

    // التحقق من توفر المنتجات والكميات
    for (const item of cart.items) {
      const product = await Product.findById(item.product)

      if (!product) {
        return NextResponse.json({ message: `المنتج ${item.name} غير موجود` }, { status: 400 })
      }

      const selectedSize = product.sizes.find((s) => s.name === item.size)

      if (!selectedSize || selectedSize.inventory < item.quantity) {
        return NextResponse.json({ message: `الكمية المطلوبة من المنتج ${item.name} غير متوفرة` }, { status: 400 })
      }
    }

    // حساب إجمالي سعر المنتجات
    const itemsPrice = cart.items.reduce((total, item) => total + item.price * item.quantity, 0)

    // حساب سعر الشحن (مثال: 50 ريال للطلبات أقل من 500 ريال، ومجاني للطلبات الأكبر)
    const shippingPrice = itemsPrice < 500 ? 50 : 0

    // حساب الضريبة (مثال: 15%)
    const taxPrice = itemsPrice * 0.15

    // حساب إجمالي الطلب
    const totalPrice = itemsPrice + shippingPrice + taxPrice

    // إنشاء الطلب
    const order = await Order.create({
      user: session.user.id,
      orderItems: cart.items,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      status: "pending",
    })

    // تحديث المخزون
    for (const item of cart.items) {
      const product = await Product.findById(item.product)

      if (product) {
        const sizeIndex = product.sizes.findIndex((s) => s.name === item.size)

        if (sizeIndex !== -1) {
          product.sizes[sizeIndex].inventory -= item.quantity
          product.totalInventory -= item.quantity
          await product.save()
        }
      }
    }

    // تفريغ سلة التسوق
    cart.items = []
    await cart.save()

    return NextResponse.json({ message: "تم إنشاء الطلب بنجاح", order }, { status: 201 })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ message: "حدث خطأ أثناء إنشاء الطلب" }, { status: 500 })
  }
}

// دالة مساعدة للحصول على منتجات البائع
async function getSellerProducts(sellerId: string) {
  const products = await Product.find({ seller: sellerId })
  return products.map((product) => product._id)
}
