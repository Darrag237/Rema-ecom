import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import dbConnect from "@/lib/db"
import Product from "@/models/product"

// الحصول على جميع المنتجات مع إمكانية الفلترة والبحث
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    // استخراج معلمات البحث والفلترة
    const query = searchParams.get("query") || ""
    const category = searchParams.get("category") || ""
    const minPrice = searchParams.get("minPrice") || "0"
    const maxPrice = searchParams.get("maxPrice") || "100000"
    const sort = searchParams.get("sort") || "createdAt"
    const order = searchParams.get("order") || "desc"
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    await dbConnect()

    // بناء استعلام البحث
    const searchQuery: any = {}

    // البحث في الاسم والوصف
    if (query) {
      searchQuery.$or = [{ name: { $regex: query, $options: "i" } }, { description: { $regex: query, $options: "i" } }]
    }

    // فلترة حسب التصنيف
    if (category) {
      searchQuery.category = category
    }

    // فلترة حسب السعر
    searchQuery.price = {
      $gte: Number.parseInt(minPrice),
      $lte: Number.parseInt(maxPrice),
    }

    // فلترة المنتجات النشطة فقط
    searchQuery.isActive = true

    // حساب عدد المنتجات الإجمالي
    const totalProducts = await Product.countDocuments(searchQuery)

    // الحصول على المنتجات مع الترتيب والصفحات
    const products = await Product.find(searchQuery)
      .sort({ [sort]: order === "asc" ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("seller", "name")

    return NextResponse.json({
      products,
      pagination: {
        total: totalProducts,
        page,
        limit,
        pages: Math.ceil(totalProducts / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ message: "حدث خطأ أثناء جلب المنتجات" }, { status: 500 })
  }
}

// إضافة منتج جديد
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    // التحقق من تسجيل الدخول والصلاحيات
    if (!session) {
      return NextResponse.json({ message: "غير مصرح لك بالوصول" }, { status: 401 })
    }

    // التحقق من صلاحيات المستخدم (مدير أو بائع فقط)
    if (session.user.role !== "admin" && session.user.role !== "seller") {
      return NextResponse.json({ message: "غير مصرح لك بإضافة منتجات" }, { status: 403 })
    }

    const productData = await request.json()

    await dbConnect()

    // إضافة معرف البائع
    productData.seller = session.user.id

    // إنشاء المنتج
    const product = await Product.create(productData)

    return NextResponse.json(product, { status: 201 })
  } catch (error: any) {
    console.error("Error creating product:", error)
    return NextResponse.json({ message: "حدث خطأ أثناء إنشاء المنتج", error: error.message }, { status: 500 })
  }
}
