import Link from "next/link"
import Image from "next/image"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"

// Mock data for related products
const relatedProducts = [
  {
    id: 2,
    name: "بلوزة كاجوال",
    price: 149,
    image: "/placeholder.svg?height=400&width=300",
    rating: 4.2,
  },
  {
    id: 4,
    name: "فستان سهرة فاخر",
    price: 499,
    image: "/placeholder.svg?height=400&width=300",
    rating: 4.9,
  },
  {
    id: 6,
    name: "تنورة قصيرة",
    price: 159,
    image: "/placeholder.svg?height=400&width=300",
    rating: 4.3,
  },
  {
    id: 8,
    name: "بلوزة حريرية",
    price: 229,
    image: "/placeholder.svg?height=400&width=300",
    rating: 4.4,
  },
]

export default function RelatedProducts({ productId }: { productId: string }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {relatedProducts.map((product) => (
        <div key={product.id} className="group border rounded-lg overflow-hidden">
          <div className="relative overflow-hidden">
            <Link href={`/products/${product.id}`}>
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                width={300}
                height={400}
                className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </Link>
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
  )
}
