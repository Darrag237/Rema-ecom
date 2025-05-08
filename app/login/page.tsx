import LoginForm from "@/components/login-form"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import Image from "next/image"

export default async function LoginPage() {
  const session = await getServerSession(authOptions)

  // Redirect to dashboard if already logged in
  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="flex-1 bg-rose-100 hidden md:block relative">
        <Image src="/placeholder.svg?height=1080&width=1080" alt="Rima Fashion" fill className="object-cover" />
        <div className="absolute inset-0 bg-rose-500/20 flex items-center justify-center">
          <div className="text-center p-8 bg-white/80 rounded-lg backdrop-blur-sm">
            <h1 className="text-4xl font-bold text-rose-600 mb-2">Rima</h1>
            <p className="text-xl">متجر الأزياء النسائية الأول</p>
          </div>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">مرحباً بك في Rima</h1>
            <p className="text-gray-600">سجل دخولك للاستمتاع بتجربة تسوق فريدة</p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
