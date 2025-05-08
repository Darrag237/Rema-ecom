"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter } from "lucide-react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

export default function SearchProducts() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "")
  const [category, setCategory] = useState(searchParams.get("category") || "")
  const [minPrice, setMinPrice] = useState(Number.parseInt(searchParams.get("minPrice") || "0"))
  const [maxPrice, setMaxPrice] = useState(Number.parseInt(searchParams.get("maxPrice") || "1000"))
  const [priceRange, setPriceRange] = useState<[number, number]>([minPrice, maxPrice])
  const [selectedColors, setSelectedColors] = useState<string[]>(searchParams.getAll("color") || [])
  const [selectedSizes, setSelectedSizes] = useState<string[]>(searchParams.getAll("size") || [])

  // بيانات الفلاتر المتاحة (في التطبيق الحقيقي ستأتي من API)
  const availableCategories = [
    { id: "dresses", label: "فساتين" },
    { id: "t-shirts", label: "تيشيرتات" },
    { id: "pants", label: "بناطيل" },
    { id: "blouses", label: "بلوزات" },
    { id: "skirts", label: "تنانير" },
    { id: "jackets", label: "جاكيتات" },
  ]

  const availableColors = [
    { id: "black", label: "أسود", color: "bg-black" },
    { id: "white", label: "أبيض", color: "bg-white border" },
    { id: "red", label: "أحمر", color: "bg-red-500" },
    { id: "blue", label: "أزرق", color: "bg-blue-500" },
    { id: "green", label: "أخضر", color: "bg-green-500" },
    { id: "yellow", label: "أصفر", color: "bg-yellow-500" },
    { id: "purple", label: "بنفسجي", color: "bg-purple-500" },
    { id: "pink", label: "وردي", color: "bg-pink-500" },
  ]

  const availableSizes = [
    { id: "XS", label: "XS" },
    { id: "S", label: "S" },
    { id: "M", label: "M" },
    { id: "L", label: "L" },
    { id: "XL", label: "XL" },
    { id: "XXL", label: "XXL" },
  ]

  // تحديث الفلاتر من URL عند تحميل الصفحة
  useEffect(() => {
    setSearchQuery(searchParams.get("q") || "")
    setCategory(searchParams.get("category") || "")
    setMinPrice(Number.parseInt(searchParams.get("minPrice") || "0"))
    setMaxPrice(Number.parseInt(searchParams.get("maxPrice") || "1000"))
    setPriceRange([
      Number.parseInt(searchParams.get("minPrice") || "0"),
      Number.parseInt(searchParams.get("maxPrice") || "1000"),
    ])
    setSelectedColors(searchParams.getAll("color") || [])
    setSelectedSizes(searchParams.getAll("size") || [])
  }, [searchParams])

  // تنفيذ البحث
  const handleSearch = () => {
    const params = new URLSearchParams()

    if (searchQuery) params.set("q", searchQuery)
    if (category) params.set("category", category)
    params.set("minPrice", priceRange[0].toString())
    params.set("maxPrice", priceRange[1].toString())

    selectedColors.forEach((color) => params.append("color", color))
    selectedSizes.forEach((size) => params.append("size", size))

    router.push(`/products?${params.toString()}`)
  }

  // تحديث الفلاتر
  const handleColorToggle = (colorId: string) => {
    setSelectedColors((prev) => (prev.includes(colorId) ? prev.filter((id) => id !== colorId) : [...prev, colorId]))
  }

  const handleSizeToggle = (sizeId: string) => {
    setSelectedSizes((prev) => (prev.includes(sizeId) ? prev.filter((id) => id !== sizeId) : [...prev, sizeId]))
  }

  const handleCategoryChange = (categoryId: string) => {
    setCategory(categoryId === category ? "" : categoryId)
  }

  // إعادة تعيين الفلاتر
  const resetFilters = () => {
    setCategory("")
    setPriceRange([0, 1000])
    setSelectedColors([])
    setSelectedSizes([])
  }

  return (
    <div className="mb-8">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="ابحث عن منتجات..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              الفلاتر
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="overflow-y-auto">
            <SheetHeader>
              <SheetTitle>فلترة المنتجات</SheetTitle>
              <SheetDescription>استخدم الفلاتر لتضييق نطاق البحث</SheetDescription>
            </SheetHeader>

            <div className="mt-6 space-y-6">
              {/* فلتر التصنيفات */}
              <div>
                <h3 className="text-lg font-medium mb-3">التصنيفات</h3>
                <div className="space-y-2">
                  {availableCategories.map((cat) => (
                    <div key={cat.id} className="flex items-center space-x-2 space-x-reverse">
                      <Checkbox
                        id={`category-${cat.id}`}
                        checked={category === cat.id}
                        onCheckedChange={() => handleCategoryChange(cat.id)}
                      />
                      <Label htmlFor={`category-${cat.id}`}>{cat.label}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* فلتر السعر */}
              <div>
                <h3 className="text-lg font-medium mb-3">السعر</h3>
                <div className="space-y-4">
                  <Slider min={0} max={1000} step={10} value={priceRange} onValueChange={setPriceRange} />
                  <div className="flex justify-between">
                    <span>{priceRange[0]} ر.س</span>
                    <span>{priceRange[1]} ر.س</span>
                  </div>
                </div>
              </div>

              {/* فلتر الألوان */}
              <div>
                <h3 className="text-lg font-medium mb-3">الألوان</h3>
                <div className="grid grid-cols-4 gap-2">
                  {availableColors.map((color) => (
                    <div key={color.id} className="flex flex-col items-center gap-1">
                      <button
                        className={`w-8 h-8 rounded-full ${color.color} ${
                          selectedColors.includes(color.id) ? "ring-2 ring-rose-500" : ""
                        }`}
                        title={color.label}
                        onClick={() => handleColorToggle(color.id)}
                      />
                      <span className="text-xs">{color.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* فلتر المقاسات */}
              <div>
                <h3 className="text-lg font-medium mb-3">المقاسات</h3>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((size) => (
                    <button
                      key={size.id}
                      className={`w-10 h-10 rounded-md flex items-center justify-center border ${
                        selectedSizes.includes(size.id) ? "border-rose-500 bg-rose-50 text-rose-600" : "border-gray-200"
                      }`}
                      onClick={() => handleSizeToggle(size.id)}
                    >
                      {size.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button className="flex-1 bg-rose-600 hover:bg-rose-700" onClick={handleSearch}>
                  تطبيق الفلاتر
                </Button>
                <Button variant="outline" onClick={resetFilters}>
                  إعادة تعيين
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <Button className="bg-rose-600 hover:bg-rose-700" onClick={handleSearch}>
          بحث
        </Button>
      </div>
    </div>
  )
}
