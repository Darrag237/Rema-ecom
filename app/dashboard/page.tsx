import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import AdminDashboard from "@/components/admin-dashboard"
import SellerDashboard from "@/components/seller-dashboard"
import CustomerDashboard from "@/components/customer-dashboard"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  // Render different dashboard based on user role
  switch (session.user.role) {
    case "admin":
      return <AdminDashboard />
    case "seller":
      return <SellerDashboard />
    case "customer":
      return <CustomerDashboard />
    default:
      return <CustomerDashboard />
  }
}
