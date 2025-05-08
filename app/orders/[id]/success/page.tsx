import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import dbConnect from "@/lib/db"
import Order from "@/models/order"
import { CheckCircle, Truck, Clock, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { formatDate } from "@/lib/utils"

export default async function OrderSuccessPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  // التحقق من تسجيل الدخول
  if (!session) {
    redirect("/login")
  }

  await dbConnect()

  // الحصول على الطلب
  const order = await Order.findById(params.id)

  // التحقق من وجود الطلب وملكيته
  if (!order || (order.user.toString() !== session.user.id && session.user.role !== "admin")) {
    redirect("/dashboard")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto text-center">
        <div className="mb-6 flex justify-center">
          <div className="bg-green-100 p-4 rounded-full">
            <CheckCircle className="h-16 w-16 text-green-600" />
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-2">تم تأكيد طلبك بنجاح!</h1>
        <p className="text-muted-foreground mb-6">
          شكراً لك على طلبك. لقد تم استلام طلبك وسيتم معالجته في أقرب وقت ممكن.
        </p>

        <div className="bg-muted p-6 rounded-lg mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="font-bold">رقم الطلب</h2>
              <p className="text-muted-foreground">{order._id}</p>
            </div>
            <div>
              <h2 className="font-bold">تاريخ الطلب</h2>
              <p className="text-muted-foreground">{formatDate(order.createdAt)}</p>
            </div>
          </div>

          <Separator className="mb-4" />

          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="bg-primary/10 p-2 rounded-full mr-3">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">حالة الطلب</h3>
                <p className="text-sm text-muted-foreground">
                  {order.status === "pending"
                    ? "قيد الانتظار"
                    : order.status === "processing"
                      ? "قيد المعالجة"
                      : order.status === "shipped"
                        ? "تم الشحن"
                        : order.status === "delivered"
                          ? "تم التوصيل"
                          : "ملغي"}
                </p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="bg-primary/10 p-2 rounded-full mr-3">
                <Truck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">التوصيل المتوقع</h3>
                <p className="text-sm text-muted-foreground">خلال 3-7 أيام عمل</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-muted p-6 rounded-lg mb-8">
          <h2 className="font-bold mb-4">ملخص الطلب</h2>

          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span>المجموع الفرعي</span>
              <span>{order.itemsPrice} ر.س</span>
            </div>
            <div className="flex justify-between">
              <span>الشحن</span>
              <span>{order.shippingPrice} ر.س</span>
            </div>
            <div className="flex justify-between">
              <span>الضريبة</span>
              <span>{order.taxPrice} ر.س</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between font-bold">
              <span>المجموع</span>
              <span>{order.totalPrice} ر.س</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/dashboard/orders">
              عرض طلباتي
              <ArrowRight className="mr-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/products">متابعة التسوق</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
