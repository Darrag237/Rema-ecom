import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import dbConnect from "@/lib/db"
import Cart from "@/models/cart"
import CheckoutForm from "@/components/checkout-form"
import { Separator } from "@/components/ui/separator"

export default async function CheckoutPage() {
  const session = await getServerSession(authOptions)

  // التحقق من تسجيل الدخول
  if (!session) {
    redirect("/login")
  }

  await dbConnect()

  // الحصول على سلة التسوق للمستخدم
  const cart = await Cart.findOne({ user: session.user.id })

  // التحقق من وجود منتجات في السلة
  if (!cart || cart.items.length === 0) {
    redirect("/cart")
  }

  // حساب إجمالي سلة التسوق
  const cartTotal = cart.items.reduce((total, item) => total + item.price * item.quantity, 0)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">إتمام الطلب</h1>
      <p className="text-muted-foreground mb-6">أكمل بيانات الشحن والدفع لإتمام طلبك</p>

      <Separator className="mb-8" />

      <CheckoutForm cartItems={cart.items} cartTotal={cartTotal} />
    </div>
  )
}
