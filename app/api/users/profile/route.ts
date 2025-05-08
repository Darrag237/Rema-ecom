import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import dbConnect from "@/lib/db"
import User from "@/models/user"
import bcrypt from "bcryptjs"

// تحديث الملف الشخصي للمستخدم
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    // التحقق من تسجيل الدخول
    if (!session) {
      return NextResponse.json({ message: "يجب تسجيل الدخول للوصول إلى هذه البيانات" }, { status: 401 })
    }

    const { name, currentPassword, newPassword } = await request.json()

    await dbConnect()

    // البحث عن المستخدم
    const user = await User.findById(session.user.id)

    if (!user) {
      return NextResponse.json({ message: "المستخدم غير موجود" }, { status: 404 })
    }

    // تحديث الاسم
    if (name) {
      user.name = name
    }

    // تحديث كلمة المرور إذا تم توفيرها
    if (currentPassword && newPassword) {
      // التحقق من كلمة المرور الحالية
      const isPasswordValid = await user.comparePassword(currentPassword)

      if (!isPasswordValid) {
        return NextResponse.json({ message: "كلمة المرور الحالية غير صحيحة" }, { status: 400 })
      }

      // التحقق من طول كلمة المرور الجديدة
      if (newPassword.length < 6) {
        return NextResponse.json({ message: "يجب أن تكون كلمة المرور الجديدة 6 أحرف على الأقل" }, { status: 400 })
      }

      // تشفير كلمة المرور الجديدة
      const salt = await bcrypt.genSalt(10)
      user.password = await bcrypt.hash(newPassword, salt)
    }

    // حفظ التغييرات
    await user.save()

    return NextResponse.json({ message: "تم تحديث الملف الشخصي بنجاح" })
  } catch (error) {
    console.error("Error updating profile:", error)
    return NextResponse.json({ message: "حدث خطأ أثناء تحديث الملف الشخصي" }, { status: 500 })
  }
}
