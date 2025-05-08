import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import dbConnect from "@/lib/db"
import Product from "@/models/product"

// تحديث مخزون المنتج
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    // التحقق من تسجيل الدخول والصلاحيات
    if (!session) {
      return NextResponse.json({ message: "غير مصرح لك بالوصول" }, { status: 401 })
    }

    // التحقق من صلاحيات المستخدم (مدير أو بائع فقط)
    if (session.user.role !== "admin" && session.user.role !== "seller") {
      return NextResponse.json({ message: "غير مصرح لك بتحديث المخزون" }, { status: 403 })
    }

    const { productId, sizeUpdates } = await request.json()

    // التحقق من البيانات
    if (!productId || !sizeUpdates || !Array.isArray(sizeUpdates)) {
      return NextResponse.json({ message: "الرجاء إدخال جميع البيانات المطلوبة" }, { status: 400 })
    }

    await dbConnect()

    // البحث عن المنتج
    const product = await Product.findById(productId)

    if (!product) {
      return NextResponse.json({ message: "المنتج غير موجود" }, { status: 404 })
    }

    // التحقق من صلاحيات المستخدم (المدير أو البائع نفسه)
    if (session.user.role !== "admin" && product.seller.toString() !== session.user.id) {
      return NextResponse.json({ message: "غير مصرح لك بتحديث مخزون هذا المنتج" }, { status: 403 })
    }

    // تحديث المخزون لكل مقاس
    for (const update of sizeUpdates) {
      const { sizeName, newInventory } = update

      // التحقق من البيانات
      if (!sizeName || typeof newInventory !== "number" || newInventory < 0) {
        return NextResponse.json({ message: "بيانات تحديث المخزون غير صالحة" }, { status: 400 })
      }

      // البحث عن المقاس وتحديثه
      const sizeIndex = product.sizes.findIndex((size) => size.name === sizeName)

      if (sizeIndex === -1) {
        return NextResponse.json({ message: `المقاس ${sizeName} غير موجود` }, { status: 400 })
      }

      product.sizes[sizeIndex].inventory = newInventory
    }

    // إعادة حساب إجمالي المخزون
    product.totalInventory = product.sizes.reduce((total, size) => total + size.inventory, 0)

    // حفظ المنتج
    await product.save()

    return NextResponse.json({ message: "تم تحديث المخزون بنجاح", product }, { status: 200 })
  } catch (error) {
    console.error("Error updating inventory:", error)
    return NextResponse.json({ message: "حدث خطأ أثناء تحديث المخزون" }, { status: 500 })
  }
}
