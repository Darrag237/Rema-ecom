"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export default function CartSummary() {
  const [couponCode, setCouponCode] = useState("")
  const [couponApplied, setCouponApplied] = useState(false)

  // Mock cart summary data
  const summary = {
    subtotal: 786,
    shipping: 50,
    discount: couponApplied ? 78.6 : 0,
    total: couponApplied ? 757.4 : 836,
  }

  const applyCoupon = () => {
    if (couponCode.toLowerCase() === "discount10") {
      setCouponApplied(true)
    }
  }

  return (
    <div className="border rounded-lg p-6 sticky top-4">
      <h2 className="text-xl font-bold mb-6">ملخص الطلب</h2>

      <div className="space-y-4 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-600">المجموع الفرعي</span>
          <span>{summary.subtotal} ر.س</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">الشحن</span>
          <span>{summary.shipping} ر.س</span>
        </div>
        {couponApplied && (
          <div className="flex justify-between text-green-600">
            <span>الخصم (10%)</span>
            <span>- {summary.discount} ر.س</span>
          </div>
        )}
        <div className="border-t pt-4 flex justify-between font-bold">
          <span>المجموع</span>
          <span>{summary.total} ر.س</span>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <div className="flex gap-2 mb-4">
            <Input placeholder="كود الخصم" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} />
            <Button variant="outline" onClick={applyCoupon} disabled={couponApplied}>
              تطبيق
            </Button>
          </div>
          {couponApplied && <div className="text-sm text-green-600">تم تطبيق كود الخصم بنجاح!</div>}
        </div>
      </div>

      <div className="mt-6 text-sm text-gray-500">
        <p>طرق الدفع المتاحة:</p>
        <div className="flex gap-2 mt-2">
          <div className="border rounded p-2 w-12 h-8 flex items-center justify-center bg-white">
            <span className="font-bold text-blue-600">Visa</span>
          </div>
          <div className="border rounded p-2 w-12 h-8 flex items-center justify-center bg-white">
            <span className="font-bold text-red-600">MC</span>
          </div>
          <div className="border rounded p-2 w-12 h-8 flex items-center justify-center bg-white">
            <span className="font-bold">Mada</span>
          </div>
        </div>
      </div>
    </div>
  )
}
