import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import dbConnect from "@/lib/db"
import Product from "@/models/product"

// الحصول على المنتجات ذات المخزون المنخفض
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

    const { searchParams } = new URL(request.url)
    const threshold = Number.parseInt(searchParams.get("threshold") || "10")

    await dbConnect()

    const query: any = {}

    // البائع يمكنه رؤية منتجاته فقط
    if (session.user.role === "seller") {
      query.seller = session.user.id
    }

    // البحث عن المنتجات ذات المخزون المنخفض
    const lowStockProducts = await Product.find(query)
      .populate("seller", "name")
      .then((products) =>
        products.filter((product) => {
          // فلترة المنتجات التي لديها مقاس واحد على الأقل بمخزون منخفض
          return product.sizes.some((size) => size.inventory <= threshold)
        }),
      )

    // تنسيق البيانات للعرض
    const formattedProducts = lowStockProducts.map((product) => {
      const lowStockSizes = product.sizes
        .filter((size) => size.inventory <= threshold)
        .map((size) => ({
          name: size.name,
          inventory: size.inventory,
        }))

      return {
        id: product._id,
        name: product.name,
        image: product.images[0],
        seller: product.seller,
        totalInventory: product.totalInventory,
        lowStockSizes,
      }
    })

    return NextResponse.json(formattedProducts)
  } catch (error) {
    console.error("Error fetching low stock products:", error)
    return NextResponse.json({ message: "حدث خطأ أثناء جلب المنتجات ذات المخزون المنخفض" }, { status: 500 })
  }
}
