import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import ProductDetails from "@/components/product-details"
import ProductReviews from "@/components/product-reviews"
import RelatedProducts from "@/components/related-products"

export default async function ProductPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  // Redirect to login if not authenticated (Private Store)
  if (!session) {
    redirect("/login")
  }

  // In a real app, fetch product data based on params.id

  return (
    <div className="container mx-auto px-4 py-8">
      <ProductDetails productId={params.id} />

      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">تقييمات المنتج</h2>
        <ProductReviews productId={params.id} />
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">منتجات مشابهة</h2>
        <RelatedProducts productId={params.id} />
      </div>
    </div>
  )
}
