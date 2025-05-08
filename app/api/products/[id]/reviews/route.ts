import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import dbConnect from "@/lib/db"
import Product from "@/models/product"

// إضافة تقييم جديد للمنتج
export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    const productId = params.id

    // التحقق من تسجيل الدخول
    if (!session) {
      return NextResponse.json({ message: "يجب تسجيل الدخول لإضافة تقييم" }, { status: 401 })
    }

    const { rating, title, comment } = await request.json()

    // التحقق من البيانات
    if (!rating || !title || !comment) {
      return NextResponse.json({ message: "الرجاء إدخال جميع بيانات التقييم" }, { status: 400 })
    }

    await dbConnect()

    // البحث عن المنتج
    const product = await Product.findById(productId)

    if (!product) {
      return NextResponse.json({ message: "المنتج غير موجود" }, { status: 404 })
    }

    // التحقق مما إذا كان المستخدم قد قام بتقييم المنتج من قبل
    const alreadyReviewed = product.reviews.find((review) => review.user.toString() === session.user.id)

    if (alreadyReviewed) {
      return NextResponse.json({ message: "لقد قمت بتقييم هذا المنتج من قبل" }, { status: 400 })
    }

    // إنشاء التقييم الجديد
    const review = {
      user: session.user.id,
      rating: Number(rating),
      title,
      comment,
      createdAt: Date.now(),
    }

    // إضافة التقييم إلى المنتج
    product.reviews.push(review)

    // حساب متوسط التقييم
    const totalReviews = product.reviews.length
    const sumRatings = product.reviews.reduce((sum, item) => sum + item.rating, 0)
    product.averageRating = sumRatings / totalReviews

    // حفظ المنتج
    await product.save()

    return NextResponse.json({ message: "تم إضافة التقييم بنجاح" }, { status: 201 })
  } catch (error) {
    console.error("Error adding review:", error)
    return NextResponse.json({ message: "حدث خطأ أثناء إضافة التقييم" }, { status: 500 })
  }
}
