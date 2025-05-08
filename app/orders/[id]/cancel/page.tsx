import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { XCircle, ArrowRight, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"

export default async function OrderCancelPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  // التحقق من تسجيل الدخول
  if (!session) {
    redirect("/login")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto text-center">
        <div className="mb-6 flex justify-center">
          <div className="bg-red-100 p-4 rounded-full">
            <XCircle className="h-16 w-16 text-red-600" />
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-2">تم إلغاء عملية الدفع</h1>
        <p className="text-muted-foreground mb-6">
          لم يتم اكتمال عملية الدفع الخاصة بك. يمكنك المحاولة مرة أخرى أو اختيار طريقة دفع أخرى.
        </p>

        <div className="bg-muted p-6 rounded-lg mb-8">
          <h2 className="font-bold mb-4">ماذا يمكنني أن أفعل الآن؟</h2>

          <div className="space-y-4 text-right">
            <div className="flex items-center">
              <ArrowRight className="h-5 w-5 ml-2 text-primary" />
              <p>العودة إلى سلة التسوق ومحاولة الدفع مرة أخرى</p>
            </div>
            <div className="flex items-center">
              <ArrowRight className="h-5 w-5 ml-2 text-primary" />
              <p>اختيار طريقة دفع مختلفة مثل الدفع عند الاستلام</p>
            </div>
            <div className="flex items-center">
              <ArrowRight className="h-5 w-5 ml-2 text-primary" />
              <p>التواصل مع خدمة العملاء إذا كنت تواجه مشكلة في الدفع</p>
            </div>
          </div>

          <Separator className="my-6" />

          <p className="text-sm text-muted-foreground">
            ملاحظة: لم يتم خصم أي مبلغ من حسابك. إذا تم خصم أي مبلغ، فسيتم رده خلال 5-7 أيام عمل.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-rose-600 hover:bg-rose-700">
            <Link href="/cart">
              <ShoppingBag className="ml-2 h-4 w-4" />
              العودة إلى سلة التسوق
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
