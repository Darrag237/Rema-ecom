import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import FeaturedProducts from "@/components/featured-products"
import HeroSection from "@/components/hero-section"
import CategoriesSection from "@/components/categories-section"

export default async function Home() {
  const session = await getServerSession(authOptions)

  // Redirect to login if not authenticated (Private Store)
  if (!session) {
    redirect("/login")
  }

  return (
    <main className="min-h-screen">
      <HeroSection />
      <div className="container mx-auto px-4 py-8">
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">أحدث المنتجات</h2>
          <FeaturedProducts type="latest" />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">فساتين مميزة</h2>
          <FeaturedProducts type="dresses" />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">عروض خاصة</h2>
          <FeaturedProducts type="offers" />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">تسوق حسب الفئة</h2>
          <CategoriesSection />
        </section>
      </div>
    </main>
  )
}
