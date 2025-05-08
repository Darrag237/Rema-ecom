import Link from "next/link"
import Image from "next/image"
import { Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// Mock data - would be fetched from API in real implementation
const getProducts = (type: string) => {
  return [
    {
      id: 1,
      name: "فستان صيفي أنيق",
      price: 299,
      image: "/placeholder.svg?height=400&width=300",
      rating: 4.5,
      category: "dresses",
      isNew: type === "latest",
      isOffer: type === "offers",
    },
    {
      id: 2,
      name: "بلوزة كاجوال",
      price: 149,
      image: "/placeholder.svg?height=400&width=300",
      rating: 4.2,
      category: "blouses",
      isNew: type === "latest",
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
      isOffer: type === "offers",
    },
    {
      id: 4,
      name: "فستان سهرة فاخر",
      price: 499,
      image: "/placeholder.svg?height=400&width=300",
      rating: 4.9,
      category: "dresses",
      isNew: type === "latest",
      isOffer: false,
    },
  ].filter((product) => {
    if (type === "dresses") return product.category === "dresses"
    return true
  })
}

export default function FeaturedProducts({ type }: { type: "latest" | "dresses" | "offers" }) {
  const products = getProducts(type)

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <Link key={product.id} href={`/products/${product.id}`} className="group">
          <div className="relative overflow-hidden rounded-lg mb-3">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              width={300}
              height={400}
              className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute top-2 right-2 flex flex-col gap-2">
              {product.isNew && <Badge className="bg-emerald-500">جديد</Badge>}
              {product.isOffer && <Badge className="bg-rose-500">خصم</Badge>}
            </div>
          </div>
          <h3 className="font-medium text-lg mb-1 group-hover:text-rose-600 transition-colors">{product.name}</h3>
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
          <p className="font-bold text-lg">{product.price} ر.س</p>
        </Link>
      ))}
    </div>
  )
}
