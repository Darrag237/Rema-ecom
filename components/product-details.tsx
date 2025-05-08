"use client"

import { useState } from "react"
import Image from "next/image"
import { Star, Minus, Plus, Heart, ShoppingCart, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

// Mock product data
const product = {
  id: "1",
  name: "فستان صيفي أنيق",
  price: 299,
  oldPrice: 399,
  description:
    "فستان صيفي أنيق مصنوع من القطن المريح، مثالي للمناسبات النهارية والإطلالات الصيفية المميزة. يتميز بتصميم عصري وألوان زاهية تناسب مختلف الأذواق.",
  rating: 4.5,
  reviewCount: 120,
  images: [
    "/placeholder.svg?height=600&width=400",
    "/placeholder.svg?height=600&width=400",
    "/placeholder.svg?height=600&width=400",
    "/placeholder.svg?height=600&width=400",
  ],
  colors: [
    { id: "black", name: "أسود", value: "#000000" },
    { id: "white", name: "أبيض", value: "#ffffff" },
    { id: "red", name: "أحمر", value: "#ff0000" },
    { id: "blue", name: "أزرق", value: "#0000ff" },
  ],
  sizes: ["S", "M", "L", "XL"],
  stock: 25,
  features: ["قماش قطني 100%", "مناسب للغسيل اليدوي والآلي", "تصميم عصري وأنيق", "متوفر بعدة ألوان ومقاسات"],
  specifications: {
    material: "قطن 100%",
    style: "كاجوال",
    pattern: "سادة",
    season: "صيف",
    careInstructions: "غسيل عند درجة حرارة 30 درجة مئوية",
  },
}

export default function ProductDetails({ productId }: { productId: string }) {
  const [mainImage, setMainImage] = useState(product.images[0])
  const [selectedColor, setSelectedColor] = useState(product.colors[0].id)
  const [selectedSize, setSelectedSize] = useState(product.sizes[1])
  const [quantity, setQuantity] = useState(1)

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1)
    }
  }

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <div className="relative overflow-hidden rounded-lg">
          <Image
            src={mainImage || "/placeholder.svg"}
            alt={product.name}
            width={600}
            height={800}
            className="w-full h-auto object-cover"
          />
          {product.oldPrice && (
            <Badge className="absolute top-4 right-4 bg-rose-500">
              خصم {Math.round((1 - product.price / product.oldPrice) * 100)}%
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-4 gap-2">
          {product.images.map((image, index) => (
            <button
              key={index}
              className={`rounded-md overflow-hidden border-2 ${
                mainImage === image ? "border-rose-500" : "border-transparent"
              }`}
              onClick={() => setMainImage(image)}
            >
              <Image
                src={image || "/placeholder.svg"}
                alt={`${product.name} - صورة ${index + 1}`}
                width={150}
                height={150}
                className="w-full h-auto object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.floor(product.rating)
                      ? "fill-amber-400 text-amber-400"
                      : i < product.rating
                        ? "fill-amber-400 text-amber-400"
                        : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              ({product.rating}) - {product.reviewCount} تقييم
            </span>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl font-bold">{product.price} ر.س</span>
            {product.oldPrice && <span className="text-lg text-gray-500 line-through">{product.oldPrice} ر.س</span>}
          </div>

          <p className="text-gray-600 mb-6">{product.description}</p>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2">اللون</h3>
            <div className="flex gap-2">
              {product.colors.map((color) => (
                <button
                  key={color.id}
                  className={`w-10 h-10 rounded-full border-2 ${
                    selectedColor === color.id ? "border-rose-500" : "border-gray-200"
                  }`}
                  style={{ backgroundColor: color.value }}
                  onClick={() => setSelectedColor(color.id)}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">المقاس</h3>
            <div className="flex gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  className={`w-12 h-12 rounded-md flex items-center justify-center border ${
                    selectedSize === size ? "border-rose-500 bg-rose-50 text-rose-600" : "border-gray-200"
                  }`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">الكمية</h3>
            <div className="flex items-center">
              <Button variant="outline" size="icon" onClick={decreaseQuantity} disabled={quantity <= 1}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center">{quantity}</span>
              <Button variant="outline" size="icon" onClick={increaseQuantity} disabled={quantity >= product.stock}>
                <Plus className="h-4 w-4" />
              </Button>
              <span className="mr-4 text-sm text-gray-500">{product.stock} قطعة متوفرة</span>
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button className="flex-1 bg-rose-600 hover:bg-rose-700">
            <ShoppingCart className="h-5 w-5 ml-2" />
            أضف إلى السلة
          </Button>
          <Button variant="outline" size="icon">
            <Heart className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon">
            <Share2 className="h-5 w-5" />
          </Button>
        </div>

        <Tabs defaultValue="features" className="mt-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="features">المميزات</TabsTrigger>
            <TabsTrigger value="specifications">المواصفات</TabsTrigger>
            <TabsTrigger value="shipping">الشحن والإرجاع</TabsTrigger>
          </TabsList>
          <TabsContent value="features" className="mt-4">
            <ul className="list-disc list-inside space-y-2">
              {product.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </TabsContent>
          <TabsContent value="specifications" className="mt-4">
            <div className="space-y-2">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="grid grid-cols-2 border-b py-2">
                  <span className="font-medium">
                    {key === "material"
                      ? "الخامة"
                      : key === "style"
                        ? "الستايل"
                        : key === "pattern"
                          ? "النقش"
                          : key === "season"
                            ? "الموسم"
                            : key === "careInstructions"
                              ? "تعليمات العناية"
                              : key}
                  </span>
                  <span>{value}</span>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="shipping" className="mt-4">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">الشحن</h4>
                <p>يتم شحن المنتجات خلال 2-5 أيام عمل داخل المملكة العربية السعودية.</p>
              </div>
              <div>
                <h4 className="font-medium">سياسة الإرجاع</h4>
                <p>يمكن إرجاع المنتج خلال 14 يومًا من تاريخ الاستلام إذا كان في حالته الأصلية.</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
