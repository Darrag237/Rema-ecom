import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Trash2 } from "lucide-react"

// Mock data for wishlist items
const wishlistItems = [
  {
    id: 1,
    name: "فستان صيفي أنيق",
    price: 299,
    image: "/placeholder.svg?height=400&width=300",
  },
  {
    id: 2,
    name: "بلوزة كاجوال",
    price: 149,
    image: "/placeholder.svg?height=400&width=300",
  },
  {
    id: 3,
    name: "بنطلون جينز عصري",
    price: 199,
    image: "/placeholder.svg?height=400&width=300",
  },
  {
    id: 4,
    name: "فستان سهرة فاخر",
    price: 499,
    image: "/placeholder.svg?height=400&width=300",
  },
]

export default function WishlistItems() {
  return (
    <div className="grid gap-4">
      {wishlistItems.map((item) => (
        <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
          <Image
            src={item.image || "/placeholder.svg"}
            alt={item.name}
            width={80}
            height={80}
            className="rounded-md object-cover"
          />
          <div className="flex-1">
            <h3 className="font-medium">{item.name}</h3>
            <p className="text-lg font-bold mt-1">{item.price} ر.س</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <ShoppingCart className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
