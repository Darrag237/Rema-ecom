import { NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import User from "@/models/user"

export async function POST(request: Request) {
  try {
    const { name, email, password, role = "customer" } = await request.json()

    // التحقق من البيانات
    if (!name || !email || !password) {
      return NextResponse.json({ message: "الرجاء إدخال جميع البيانات المطلوبة" }, { status: 400 })
    }

    await dbConnect()

    // التحقق من وجود المستخدم
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ message: "البريد الإلكتروني مستخدم بالفعل" }, { status: 400 })
    }

    // إنشاء مستخدم جديد
    const user = await User.create({
      name,
      email,
      password,
      role,
    })

    return NextResponse.json(
      {
        message: "تم إنشاء الحساب بنجاح",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("Error in register API:", error)
    return NextResponse.json({ message: "حدث خطأ أثناء إنشاء الحساب" }, { status: 500 })
  }
}
