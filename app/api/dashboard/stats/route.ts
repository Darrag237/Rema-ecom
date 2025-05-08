import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import dbConnect from "@/lib/db"
import Order from "@/models/order"
import Product from "@/models/product"
import User from "@/models/user"

// الحصول على إحصائيات لوحة التحكم
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    // التحقق من تسجيل الدخول والصلاحيات
    if (!session) {
      return NextResponse.json({ message: "غير مصرح لك بالوصول" }, { status: 401 })
    }

    // التحقق من صلاحيات المستخدم (مدير أو بائع فقط)
    if (session.user.role !== "admin" && session.user.role !== "seller") {
      return NextResponse.json({ message: "غير مصرح لك بالوصول إلى هذه البيانات" }, { status: 403 })
    }

    await dbConnect()

    const { searchParams } = new URL(request.url)
    const period = searchParams.get("period") || "month" // day, week, month, year

    // تحديد نطاق التاريخ
    const now = new Date()
    const startDate = new Date()

    switch (period) {
      case "day":
        startDate.setDate(now.getDate() - 1)
        break
      case "week":
        startDate.setDate(now.getDate() - 7)
        break
      case "month":
        startDate.setMonth(now.getMonth() - 1)
        break
      case "year":
        startDate.setFullYear(now.getFullYear() - 1)
        break
      default:
        startDate.setMonth(now.getMonth() - 1)
    }

    // استعلام مختلف حسب دور المستخدم
    const orderQuery: any = {
      createdAt: { $gte: startDate },
    }

    const productQuery: any = {}

    // البائع يمكنه رؤية إحصائيات منتجاته فقط
    if (session.user.role === "seller") {
      productQuery.seller = session.user.id

      // الحصول على معرفات منتجات البائع
      const sellerProducts = await Product.find({ seller: session.user.id }).select("_id")
      const sellerProductIds = sellerProducts.map((product) => product._id)

      // تحديث استعلام الطلبات ليشمل فقط الطلبات التي تحتوي على منتجات البائع
      orderQuery["orderItems.product"] = { $in: sellerProductIds }
    }

    // الإحصائيات العامة
    const totalOrders = await Order.countDocuments(orderQuery)
    const totalProducts = await Product.countDocuments(productQuery)

    // إجمالي المبيعات
    const orders = await Order.find(orderQuery)
    let totalSales = 0

    if (session.user.role === "admin") {
      // المدير يرى إجمالي المبيعات لجميع الطلبات
      totalSales = orders.reduce((sum, order) => sum + order.totalPrice, 0)
    } else {
      // البائع يرى إجمالي المبيعات لمنتجاته فقط
      totalSales = orders.reduce((sum, order) => {
        // حساب مجموع مبيعات منتجات البائع في كل طلب
        const sellerItemsTotal = order.orderItems
          .filter(
            (item) => productQuery.seller && item.product && item.product.toString() === productQuery.seller.toString(),
          )
          .reduce((itemSum, item) => itemSum + item.price * item.quantity, 0)

        return sum + sellerItemsTotal
      }, 0)
    }

    // إحصائيات إضافية للمدير فقط
    let additionalStats = {}

    if (session.user.role === "admin") {
      const totalUsers = await User.countDocuments({})
      const totalCustomers = await User.countDocuments({ role: "customer" })
      const totalSellers = await User.countDocuments({ role: "seller" })

      // توزيع الطلبات حسب الحالة
      const pendingOrders = await Order.countDocuments({ ...orderQuery, status: "pending" })
      const processingOrders = await Order.countDocuments({ ...orderQuery, status: "processing" })
      const shippedOrders = await Order.countDocuments({ ...orderQuery, status: "shipped" })
      const deliveredOrders = await Order.countDocuments({ ...orderQuery, status: "delivered" })
      const cancelledOrders = await Order.countDocuments({ ...orderQuery, status: "cancelled" })

      additionalStats = {
        users: {
          total: totalUsers,
          customers: totalCustomers,
          sellers: totalSellers,
        },
        orderStatus: {
          pending: pendingOrders,
          processing: processingOrders,
          shipped: shippedOrders,
          delivered: deliveredOrders,
          cancelled: cancelledOrders,
        },
      }
    }

    // بيانات المبيعات على مدار الفترة
    const salesData = await getSalesData(orderQuery, period)

    return NextResponse.json({
      totalOrders,
      totalProducts,
      totalSales,
      salesData,
      ...additionalStats,
    })
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json({ message: "حدث خطأ أثناء جلب إحصائيات لوحة التحكم" }, { status: 500 })
  }
}

// دالة مساعدة للحصول على بيانات المبيعات على مدار الفترة
async function getSalesData(orderQuery: any, period: string) {
  const orders = await Order.find(orderQuery).sort({ createdAt: 1 })

  // تنسيق البيانات حسب الفترة
  const salesMap = new Map()

  orders.forEach((order) => {
    let dateKey
    const orderDate = new Date(order.createdAt)

    switch (period) {
      case "day":
        // تنسيق بالساعة
        dateKey = `${orderDate.getHours()}:00`
        break
      case "week":
        // تنسيق باليوم
        dateKey = orderDate.toLocaleDateString("ar-SA", { weekday: "long" })
        break
      case "month":
        // تنسيق باليوم من الشهر
        dateKey = orderDate.getDate().toString()
        break
      case "year":
        // تنسيق بالشهر
        dateKey = orderDate.toLocaleDateString("ar-SA", { month: "long" })
        break
      default:
        dateKey = orderDate.getDate().toString()
    }

    if (salesMap.has(dateKey)) {
      salesMap.set(dateKey, salesMap.get(dateKey) + order.totalPrice)
    } else {
      salesMap.set(dateKey, order.totalPrice)
    }
  })

  // تحويل البيانات إلى مصفوفة
  return Array.from(salesMap.entries()).map(([date, total]) => ({
    date,
    total,
  }))
}
