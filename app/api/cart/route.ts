import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import dbConnect from "@/lib/db"
import Cart from "@/models/cart"
import Product from "@/models/product"

// الحصول على سلة التسوق للمستخدم الحالي
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    // التحقق من تسجيل الدخول
    if (!session) {
      return NextResponse.json({ message: "يجب تسجيل الدخول للوصول إلى سلة التسوق" }, { status: 401 })
    }

    await dbConnect()

    // البحث عن سلة التسوق للمستخدم
    let cart = await Cart.findOne({ user: session.user.id })

    // إنشاء سلة جديدة إذا لم تكن موجودة
    if (!cart) {
      cart = await Cart.create({
        user: session.user.id,
        items: [],
      })
    }

    return NextResponse.json(cart)
  } catch (error) {
    console.error("Error fetching cart:", error)
    return NextResponse.json({ message: "حدث خطأ أثناء جلب سلة التسوق" }, { status: 500 })
  }
}

// إضافة منتج إلى سلة التسوق
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    // التحقق من تسجيل الدخول
    if (!session) {
      return NextResponse.json({ message: "يجب تسجيل الدخول لإضافة منتج إلى سلة التسوق" }, { status: 401 })
    }

    const { productId, color, size, quantity } = await request.json()

    // التحقق من البيانات
    if (!productId || !color || !size || !quantity) {
      return NextResponse.json({ message: "الرجاء إدخال جميع البيانات المطلوبة" }, { status: 400 })
    }

    await dbConnect()

    // البحث عن المنتج
    const product = await Product.findById(productId)

    if (!product) {
      return NextResponse.json({ message: "المنتج غير موجود" }, { status: 404 })
    }

    // التحقق من توفر المقاس
    const selectedSize = product.sizes.find((s) => s.name === size)

    if (!selectedSize) {
      return NextResponse.json({ message: "المقاس غير متوفر" }, { status: 400 })
    }

    // التحقق من توفر الكمية
    if (selectedSize.inventory < quantity) {
      return NextResponse.json({ message: "الكمية المطلوبة غير متوفرة" }, { status: 400 })
    }

    // البحث عن سلة التسوق للمستخدم
    let cart = await Cart.findOne({ user: session.user.id })

    // إنشاء سلة جديدة إذا لم تكن موجودة
    if (!cart) {
      cart = await Cart.create({
        user: session.user.id,
        items: [],
      })
    }

    // التحقق مما إذا كان المنتج موجودًا بالفعل في السلة بنفس اللون والمقاس
    const existingItemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId && item.color === color && item.size === size,
    )

    if (existingItemIndex > -1) {
      // تحديث الكمية إذا كان المنتج موجودًا بالفعل
      cart.items[existingItemIndex].quantity += quantity
    } else {
      // إضافة المنتج إلى السلة
      cart.items.push({
        product: productId,
        name: product.name,
        price: product.price,
        color,
        size,
        quantity,
        image: product.images[0],
      })
    }

    // حفظ السلة
    await cart.save()

    return NextResponse.json({ message: "تمت إضافة المنتج إلى سلة التسوق بنجاح", cart }, { status: 200 })
  } catch (error) {
    console.error("Error adding to cart:", error)
    return NextResponse.json({ message: "حدث خطأ أثناء إضافة المنتج إلى سلة التسوق" }, { status: 500 })
  }
}

// تحديث سلة التسوق
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    // التحقق من تسجيل الدخول
    if (!session) {
      return NextResponse.json({ message: "يجب تسجيل الدخول لتحديث سلة التسوق" }, { status: 401 })
    }

    const { cartItemId, quantity } = await request.json()

    // التحقق من البيانات
    if (!cartItemId || !quantity) {
      return NextResponse.json({ message: "الرجاء إدخال جميع البيانات المطلوبة" }, { status: 400 })
    }

    await dbConnect()

    // البحث عن سلة التسوق للمستخدم
    const cart = await Cart.findOne({ user: session.user.id })

    if (!cart) {
      return NextResponse.json({ message: "سلة التسوق غير موجودة" }, { status: 404 })
    }

    // البحث عن العنصر في السلة
    const cartItem = cart.items.id(cartItemId)

    if (!cartItem) {
      return NextResponse.json({ message: "المنتج غير موجود في سلة التسوق" }, { status: 404 })
    }

    // التحقق من توفر الكمية
    const product = await Product.findById(cartItem.product)

    if (!product) {
      return NextResponse.json({ message: "المنتج غير موجود" }, { status: 404 })
    }

    const selectedSize = product.sizes.find((s) => s.name === cartItem.size)

    if (!selectedSize || selectedSize.inventory < quantity) {
      return NextResponse.json({ message: "الكمية المطلوبة غير متوفرة" }, { status: 400 })
    }

    // تحديث الكمية
    cartItem.quantity = quantity

    // حفظ السلة
    await cart.save()

    return NextResponse.json({ message: "تم تحديث سلة التسوق بنجاح", cart }, { status: 200 })
  } catch (error) {
    console.error("Error updating cart:", error)
    return NextResponse.json({ message: "حدث خطأ أثناء تحديث سلة التسوق" }, { status: 500 })
  }
}
