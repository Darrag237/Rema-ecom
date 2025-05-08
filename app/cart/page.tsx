import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import CartItems from "@/components/cart-items"
import CartSummary from "@/components/cart-summary"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function CartPage() {
  const session = await getServerSession(authOptions)

  // التحقق من تسجيل الدخول
  if (!session) {
    redirect("/login")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">سلة التسوق</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CartItems />
        </div>
        <div>
          <CartSummary />
          <div className="mt-4">
            <Button asChild className="w-full bg-rose-600 hover:bg-rose-700">
              <Link href="/checkout">متابعة الشراء</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
