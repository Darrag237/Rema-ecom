import { NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import Product from "@/models/product"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q") || ""
    const category = searchParams.get("category") || ""
    const minPrice = searchParams.get("minPrice") || "0"
    const maxPrice = searchParams.get("maxPrice") || "100000"
    const colors = searchParams.getAll("color") || []
    const sizes = searchParams.getAll("size") || []
    const sort = searchParams.get("sort") || "createdAt"
    const order = searchParams.get("order") || "desc"
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    await dbConnect()

    // بناء استعلام البحث
    const searchQuery: any = { isActive: true }

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

    // فلترة حسب الألوان
    if (colors.length > 0) {
      searchQuery["colors.name"] = { $in: colors }
    }

    // فلترة حسب المقاسات
    if (sizes.length > 0) {
      searchQuery["sizes.name"] = { $in: sizes }
    }

    // حساب عدد المنتجات الإجمالي
    const totalProducts = await Product.countDocuments(searchQuery)

    // الحصول على المنتجات مع الترتيب والصفحات
    const products = await Product.find(searchQuery)
      .sort({ [sort]: order === "asc" ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("seller", "name")

    // الحصول على الفلاتر المتاحة
    const allProducts = await Product.find({ isActive: true })

    // استخراج جميع الألوان المتاحة
    const availableColors = Array.from(
      new Set(allProducts.flatMap((product) => product.colors.map((color) => color.name))),
    )

    // استخراج جميع المقاسات المتاحة
    const availableSizes = Array.from(new Set(allProducts.flatMap((product) => product.sizes.map((size) => size.name))))

    // استخراج جميع التصنيفات المتاحة
    const availableCategories = Array.from(new Set(allProducts.map((product) => product.category)))

    return NextResponse.json({
      products,
      filters: {
        colors: availableColors,
        sizes: availableSizes,
        categories: availableCategories,
        priceRange: {
          min: Math.min(...allProducts.map((product) => product.price)),
          max: Math.max(...allProducts.map((product) => product.price)),
        },
      },
      pagination: {
        total: totalProducts,
        page,
        limit,
        pages: Math.ceil(totalProducts / limit),
      },
    })
  } catch (error) {
    console.error("Error searching products:", error)
    return NextResponse.json({ message: "حدث خطأ أثناء البحث عن المنتجات" }, { status: 500 })
  }
}
