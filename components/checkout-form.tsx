"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

export default function CheckoutForm({ cartItems, cartTotal }: { cartItems: any[]; cartTotal: number }) {
  const router = useRouter()
  const { toast } = useToast()

  const [loading, setLoading] = useState(false)
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "السعودية",
    phoneNumber: "",
  })
  const [paymentMethod, setPaymentMethod] = useState("stripe")
  const [shippingCost, setShippingCost] = useState(0)
  const [estimatedDelivery, setEstimatedDelivery] = useState({ min: 3, max: 7 })

  // حساب إجمالي الطلب
  const subtotal = cartTotal
  const taxAmount = subtotal * 0.15
  const totalAmount = subtotal + shippingCost + taxAmount

  // تحديث عنوان الشحن
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setShippingAddress((prev) => ({ ...prev, [name]: value }))
  }

  // حساب تكلفة الشحن عند تغيير المدينة
  const calculateShipping = async (city: string) => {
    if (!city) return

    try {
      setLoading(true)

      // حساب الوزن التقريبي للمنتجات (0.5 كجم لكل منتج)
      const weight = cartItems.reduce((total, item) => total + item.quantity * 0.5, 0)

      const response = await fetch("/api/shipping/calculate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          city,
          weight,
          subtotal,
        }),
      })

      if (!response.ok) {
        throw new Error("فشل في حساب تكلفة الشحن")
      }

      const data = await response.json()
      setShippingCost(data.shippingCost)

      if (data.estimatedDelivery) {
        setEstimatedDelivery(data.estimatedDelivery)
      }
    } catch (error) {
      console.error("Error calculating shipping:", error)
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حساب تكلفة الشحن",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // إنشاء الطلب
  const createOrder = async () => {
    // التحقق من البيانات
    if (
      !shippingAddress.fullName ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.postalCode ||
      !shippingAddress.phoneNumber
    ) {
      toast({
        title: "خطأ",
        description: "الرجاء إدخال جميع بيانات الشحن",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shippingAddress,
          paymentMethod,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "فشل في إنشاء الطلب")
      }

      const data = await response.json()

      // إذا كانت طريقة الدفع هي Stripe، قم بتوجيه المستخدم إلى صفحة الدفع
      if (paymentMethod === "stripe") {
        await processStripePayment(data.order._id)
      } else {
        // الدفع عند الاستلام
        toast({
          title: "تم إنشاء الطلب بنجاح",
          description: "سيتم التواصل معك قريبًا لتأكيد الطلب",
        })
        router.push(`/orders/${data.order._id}/success`)
      }
    } catch (error: any) {
      console.error("Error creating order:", error)
      toast({
        title: "خطأ",
        description: error.message || "حدث خطأ أثناء إنشاء الطلب",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // معالجة الدفع باستخدام Stripe
  const processStripePayment = async (orderId: string) => {
    try {
      setPaymentLoading(true)

      const response = await fetch("/api/payment/stripe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "فشل في إنشاء جلسة الدفع")
      }

      const data = await response.json()

      // توجيه المستخدم إلى صفحة الدفع
      window.location.href = data.url
    } catch (error: any) {
      console.error("Error processing payment:", error)
      toast({
        title: "خطأ",
        description: error.message || "حدث خطأ أثناء معالجة الدفع",
        variant: "destructive",
      })
      setPaymentLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h2 className="text-xl font-bold mb-4">عنوان الشحن</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="fullName">الاسم الكامل</Label>
            <Input
              id="fullName"
              name="fullName"
              value={shippingAddress.fullName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="address">العنوان</Label>
            <Input id="address" name="address" value={shippingAddress.address} onChange={handleInputChange} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">المدينة</Label>
              <Input
                id="city"
                name="city"
                value={shippingAddress.city}
                onChange={(e) => {
                  handleInputChange(e)
                  calculateShipping(e.target.value)
                }}
                required
              />
            </div>
            <div>
              <Label htmlFor="postalCode">الرمز البريدي</Label>
              <Input
                id="postalCode"
                name="postalCode"
                value={shippingAddress.postalCode}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="phoneNumber">رقم الهاتف</Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              value={shippingAddress.phoneNumber}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <Separator className="my-6" />

        <h2 className="text-xl font-bold mb-4">طريقة الدفع</h2>
        <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
          <div className="flex items-center space-x-2 space-x-reverse">
            <RadioGroupItem value="stripe" id="stripe" />
            <Label htmlFor="stripe">بطاقة ائتمان (Visa / Mastercard)</Label>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse">
            <RadioGroupItem value="cod" id="cod" />
            <Label htmlFor="cod">الدفع عند الاستلام</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <div className="border rounded-lg p-6 sticky top-4">
          <h2 className="text-xl font-bold mb-6">ملخص الطلب</h2>

          <div className="space-y-4 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600">المجموع الفرعي</span>
              <span>{subtotal} ر.س</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">الشحن</span>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <span>{shippingCost} ر.س</span>}
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">الضريبة (15%)</span>
              <span>{taxAmount.toFixed(2)} ر.س</span>
            </div>
            <div className="border-t pt-4 flex justify-between font-bold">
              <span>المجموع</span>
              <span>{totalAmount.toFixed(2)} ر.س</span>
            </div>
          </div>

          {shippingAddress.city && (
            <div className="mb-6 text-sm">
              <p>
                التوصيل المتوقع: {estimatedDelivery.min}-{estimatedDelivery.max} أيام عمل
              </p>
            </div>
          )}

          <Button
            className="w-full bg-rose-600 hover:bg-rose-700"
            onClick={createOrder}
            disabled={loading || paymentLoading}
          >
            {loading || paymentLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                جاري المعالجة...
              </>
            ) : (
              "إتمام الطلب"
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
