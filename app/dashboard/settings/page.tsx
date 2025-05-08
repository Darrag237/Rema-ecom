import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import SettingsForm from "@/components/settings-form"

export default async function SettingsPage() {
  const session = await getServerSession(authOptions)

  // التحقق من تسجيل الدخول
  if (!session) {
    redirect("/login")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">إعدادات الحساب</h1>
        <p className="text-muted-foreground">إدارة إعدادات حسابك وتفضيلاتك</p>
      </div>

      <Separator />

      <SettingsForm />
    </div>
  )
}
