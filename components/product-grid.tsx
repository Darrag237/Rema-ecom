import Link from "next/link"
import Image from "next/image"
import { Star, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// Mock data for products
const products = [
  {
    id: 1,
    name: "فستان صيفي أنيق",
    price: 299,
    image: "/placeholder.svg?height=400&width=300",
    rating: 4.5,
    category: "dresses",
    isNew: true,
    isOffer: false,
  },
  {
    id: 2,
    name: "بلوزة كاجوال",
    price: 149,
    image: "/placeholder.svg?height=400&width=300",
    rating: 4.2,
    category: "blouses",
    isNew: true,
    isOffer: false,
  },
  {
    id: 3,
    name: "بنطلون جينز عصري",
    price: 199,
    image: "/placeholder.svg?height=400&width=300",
    rating: 4.7,
    category: "pants",
    isNew: false,
    isOffer: true,
  },
  {
    id: 4,
    name: "فستان سهرة فاخر",
    price: 499,
    image: "/placeholder.svg?height=400&width=300",
    rating: 4.9,
    category: "dresses",
    isNew: false,
    isOffer: false,
  },
  {
    id: 5,
    name: "تيشيرت قطني",
    price: 89,
    image: "/placeholder.svg?height=400&width=300",
    rating: 4.0,
    category: "t-shirts",
    isNew: false,
    isOffer: true,
  },
  {
    id: 6,
    name: "تنورة قصيرة",
    price: 159,
    image: "/placeholder.svg?height=400&width=300",
    rating: 4.3,
    category: "skirts",
    isNew: true,
    isOffer: false,
  },
  {
    id: 7,
    name: "جاكيت جينز",
    price: 259,
    image: "/placeholder.svg?height=400&width=300",
    rating: 4.6,
    category: "jackets",
    isNew: false,
    isOffer: false,
  },
  {
    id: 8,
    name: "بلوزة حريرية",
    price: 229,
    image: "/placeholder.svg?height=400&width=300",
    rating: 4.4,
    category: "blouses",
    isNew: false,
    isOffer: true,
  },
]

export default function ProductGrid() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-muted-foreground">
            عرض 1-{products.length} من {products.length} منتج
          </p>
        </div>
        <div>
          <select className="border rounded-md p-2">
            <option value="newest">الأحدث</option>
            <option value="price-asc">السعر: من الأقل للأعلى</option>
            <option value="price-desc">السعر: من الأعلى للأقل</option>
            <option value="rating">التقييم</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="group border rounded-lg overflow-hidden">
            <div className="relative overflow-hidden">
              <Link href={`/products/${product.id}`}>
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  width={300}
                  height={400}
                  className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </Link>
              <div className="absolute top-2 right-2 flex flex-col gap-2">
                {product.isNew && <Badge className="bg-emerald-500">جديد</Badge>}
                {product.isOffer && <Badge className="bg-rose-500">خصم</Badge>}
              </div>
              <Button variant="ghost" size="icon" className="absolute top-2 left-2 bg-white/80 hover:bg-white">
                <Heart className="h-5 w-5" />
              </Button>
            </div>

            <div className="p-4">
              <Link href={`/products/${product.id}`}>
                <h3 className="font-medium text-lg mb-1 group-hover:text-rose-600 transition-colors">{product.name}</h3>
              </Link>
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating)
                        ? "fill-amber-400 text-amber-400"
                        : i < product.rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="text-sm text-gray-600 mr-1">({product.rating})</span>
              </div>
              <div className="flex items-center justify-between">
                <p className="font-bold text-lg">{product.price} ر.س</p>
                <Button size="sm" className="bg-rose-600 hover:bg-rose-700">
                  أضف للسلة
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
