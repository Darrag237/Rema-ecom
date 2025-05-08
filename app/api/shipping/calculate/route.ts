import { NextResponse } from "next/server"

// حساب تكلفة الشحن بناءً على المدينة والوزن
export async function POST(request: Request) {
  try {
    const { city, weight, subtotal } = await request.json()

    // التحقق من البيانات
    if (!city || !weight) {
      return NextResponse.json({ message: "الرجاء إدخال جميع البيانات المطلوبة" }, { status: 400 })
    }

    // الشحن المجاني للطلبات التي تزيد عن 500 ريال
    if (subtotal >= 500) {
      return NextResponse.json({ shippingCost: 0, freeShipping: true })
    }

    // حساب تكلفة الشحن بناءً على المدينة والوزن
    let baseCost = 0

    // تحديد التكلفة الأساسية حسب المدينة
    switch (city.toLowerCase()) {
      case "الرياض":
      case "جدة":
      case "الدمام":
        baseCost = 30
        break
      case "مكة":
      case "المدينة":
      case "الطائف":
        baseCost = 40
        break
      default:
        baseCost = 50
    }

    // إضافة تكلفة إضافية بناءً على الوزن
    const weightCost = Math.ceil(weight) * 2

    const totalShippingCost = baseCost + weightCost

    return NextResponse.json({
      shippingCost: totalShippingCost,
      freeShipping: false,
      estimatedDelivery: {
        min: 3,
        max: 7,
      },
    })
  } catch (error) {
    console.error("Error calculating shipping:", error)
    return NextResponse.json({ message: "حدث خطأ أثناء حساب تكلفة الشحن" }, { status: 500 })
  }
}
