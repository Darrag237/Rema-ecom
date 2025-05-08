"use client"

import { useState } from "react"
import Image from "next/image"
import { Minus, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

// Mock data for cart items
const initialCartItems = [
  {
    id: 1,
    name: "فستان صيفي أنيق",
    price: 299,
    image: "/placeholder.svg?height=400&width=300",
    color: "أزرق",
    size: "M",
    quantity: 1,
  },
  {
    id: 3,
    name: "بنطلون جينز عصري",
    price: 199,
    image: "/placeholder.svg?height=400&width=300",
    color: "أسود",
    size: "L",
    quantity: 2,
  },
  {
    id: 5,
    name: "تيشيرت قطني",
    price: 89,
    image: "/placeholder.svg?height=400&width=300",
    color: "أبيض",
    size: "S",
    quantity: 1,
  },
]

export default function CartItems() {
  const [cartItems, setCartItems] = useState(initialCartItems)

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return

    setCartItems(cartItems.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
  }

  const removeItem = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id))
  }

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <h2 className="text-xl font-medium mb-2">سلة التسوق فارغة</h2>
        <p className="text-gray-500 mb-6">لم تقم بإضافة أي منتجات إلى سلة التسوق بعد</p>
        <Button className="bg-rose-600 hover:bg-rose-700">تصفح المنتجات</Button>
      </div>
    )
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="bg-muted p-4 font-medium">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-6">المنتج</div>
          <div className="col-span-2 text-center">السعر</div>
          <div className="col-span-2 text-center">الكمية</div>
          <div className="col-span-2 text-center">المجموع</div>
        </div>
      </div>

      <div className="divide-y">
        {cartItems.map((item) => (
          <div key={item.id} className="p-4">
            <div className="grid grid-cols-12 gap-4 items-center">
              <div className="col-span-6">
                <div className="flex items-center gap-4">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="rounded-md object-cover"
                  />
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <div className="text-sm text-gray-500 mt-1">
                      <p>اللون: {item.color}</p>
                      <p>المقاس: {item.size}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-span-2 text-center">{item.price} ر.س</div>

              <div className="col-span-2">
                <div className="flex items-center justify-center">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-10 text-center">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="col-span-2 text-center font-medium">{item.price * item.quantity} ر.س</div>

              <div className="col-span-12 flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700"
                  onClick={() => removeItem(item.id)}
                >
                  <Trash2 className="h-4 w-4 ml-1" />
                  إزالة
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
