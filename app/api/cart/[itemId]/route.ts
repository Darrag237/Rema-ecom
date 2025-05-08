import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import dbConnect from "@/lib/db"
import Cart from "@/models/cart"

// حذف منتج من سلة التسوق
export async function DELETE(request: Request, { params }: { params: { itemId: string } }) {
  try {
    const session = await getServerSession(authOptions)
    const itemId = params.itemId

    // التحقق من تسجيل الدخول
    if (!session) {
      return NextResponse.json({ message: "يجب تسجيل الدخول لحذف منتج من سلة التسوق" }, { status: 401 })
    }

    await dbConnect()

    // البحث عن سلة التسوق للمستخدم
    const cart = await Cart.findOne({ user: session.user.id })

    if (!cart) {
      return NextResponse.json({ message: "سلة التسوق غير موجودة" }, { status: 404 })
    }

    // حذف العنصر من السلة
    cart.items = cart.items.filter((item) => item._id.toString() !== itemId)

    // حفظ السلة
    await cart.save()

    return NextResponse.json({ message: "تم حذف المنتج من سلة التسوق بنجاح", cart }, { status: 200 })
  } catch (error) {
    console.error("Error removing from cart:", error)
    return NextResponse.json({ message: "حدث خطأ أثناء حذف المنتج من سلة التسوق" }, { status: 500 })
  }
}
