import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import dbConnect from "@/lib/db"
import User from "@/models/user"
import ProfileForm from "@/components/profile-form"
import { Separator } from "@/components/ui/separator"

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)

  // التحقق من تسجيل الدخول
  if (!session) {
    redirect("/login")
  }

  await dbConnect()

  // الحصول على بيانات المستخدم
  const user = await User.findById(session.user.id).select("-password")

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">الملف الشخصي</h1>
        <p className="text-muted-foreground">إدارة معلومات حسابك الشخصي</p>
      </div>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <ProfileForm user={JSON.parse(JSON.stringify(user))} />
        </div>
        <div>
          <div className="bg-muted p-6 rounded-lg">
            <h2 className="font-bold mb-4">معلومات الحساب</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">البريد الإلكتروني</p>
                <p className="font-medium">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">نوع الحساب</p>
                <p className="font-medium">
                  {user.role === "admin" ? "مدير" : user.role === "seller" ? "بائع" : "عميل"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">تاريخ الانضمام</p>
                <p className="font-medium">{new Date(user.createdAt).toLocaleDateString("ar-SA")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
