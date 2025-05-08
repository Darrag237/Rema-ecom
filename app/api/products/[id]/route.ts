import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import dbConnect from "@/lib/db"
import Product from "@/models/product"

// الحصول على منتج محدد
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    await dbConnect()

    const product = await Product.findById(id).populate("seller", "name").populate("reviews.user", "name")

    if (!product) {
      return NextResponse.json({ message: "المنتج غير موجود" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json({ message: "حدث خطأ أثناء جلب المنتج" }, { status: 500 })
  }
}

// تحديث منتج
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    const id = params.id

    // التحقق من تسجيل الدخول
    if (!session) {
      return NextResponse.json({ message: "غير مصرح لك بالوصول" }, { status: 401 })
    }

    await dbConnect()

    // البحث عن المنتج
    const product = await Product.findById(id)

    if (!product) {
      return NextResponse.json({ message: "المنتج غير موجود" }, { status: 404 })
    }

    // التحقق من صلاحيات المستخدم (المدير أو البائع نفسه)
    if (session.user.role !== "admin" && product.seller.toString() !== session.user.id) {
      return NextResponse.json({ message: "غير مصرح لك بتعديل هذا المنتج" }, { status: 403 })
    }

    const updateData = await request.json()

    // تحديث المنتج
    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })

    return NextResponse.json(updatedProduct)
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json({ message: "حدث خطأ أثناء تحديث المنتج" }, { status: 500 })
  }
}

// حذف منتج
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    const id = params.id

    // التحقق من تسجيل الدخول
    if (!session) {
      return NextResponse.json({ message: "غير مصرح لك بالوصول" }, { status: 401 })
    }

    await dbConnect()

    // البحث عن المنتج
    const product = await Product.findById(id)

    if (!product) {
      return NextResponse.json({ message: "المنتج غير موجود" }, { status: 404 })
    }

    // التحقق من صلاحيات المستخدم (المدير أو البائع نفسه)
    if (session.user.role !== "admin" && product.seller.toString() !== session.user.id) {
      return NextResponse.json({ message: "غير مصرح لك بحذف هذا المنتج" }, { status: 403 })
    }

    // حذف المنتج
    await Product.findByIdAndDelete(id)

    return NextResponse.json({ message: "تم حذف المنتج بنجاح" }, { status: 200 })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json({ message: "حدث خطأ أثناء حذف المنتج" }, { status: 500 })
  }
}
