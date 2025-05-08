import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import ProductFilters from "@/components/product-filters"
import ProductGrid from "@/components/product-grid"

export default async function ProductsPage() {
  const session = await getServerSession(authOptions)

  // Redirect to login if not authenticated (Private Store)
  if (!session) {
    redirect("/login")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">تسوق منتجاتنا</h1>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-64 lg:w-72">
          <ProductFilters />
        </div>

        <div className="flex-1">
          <ProductGrid />
        </div>
      </div>
    </div>
  )
}
