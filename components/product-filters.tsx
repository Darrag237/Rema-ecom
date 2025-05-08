"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

// Mock data for filters
const categories = [
  { id: "dresses", label: "فساتين" },
  { id: "t-shirts", label: "تيشيرتات" },
  { id: "pants", label: "بناطيل" },
  { id: "blouses", label: "بلوزات" },
  { id: "skirts", label: "تنانير" },
  { id: "jackets", label: "جاكيتات" },
]

const sizes = [
  { id: "xs", label: "XS" },
  { id: "s", label: "S" },
  { id: "m", label: "M" },
  { id: "l", label: "L" },
  { id: "xl", label: "XL" },
  { id: "xxl", label: "XXL" },
]

const colors = [
  { id: "black", label: "أسود", color: "bg-black" },
  { id: "white", label: "أبيض", color: "bg-white border" },
  { id: "red", label: "أحمر", color: "bg-red-500" },
  { id: "blue", label: "أزرق", color: "bg-blue-500" },
  { id: "green", label: "أخضر", color: "bg-green-500" },
  { id: "yellow", label: "أصفر", color: "bg-yellow-500" },
  { id: "purple", label: "بنفسجي", color: "bg-purple-500" },
  { id: "pink", label: "وردي", color: "bg-pink-500" },
]

export default function ProductFilters() {
  const [priceRange, setPriceRange] = useState([0, 1000])

  return (
    <div className="sticky top-4 space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">الفلاتر</h3>
      </div>

      <Accordion type="multiple" defaultValue={["categories", "price", "sizes", "colors"]}>
        <AccordionItem value="categories">
          <AccordionTrigger>التصنيفات</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox id={`category-${category.id}`} />
                  <Label htmlFor={`category-${category.id}`}>{category.label}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price">
          <AccordionTrigger>السعر</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <Slider defaultValue={[0, 1000]} max={1000} step={10} value={priceRange} onValueChange={setPriceRange} />
              <div className="flex justify-between">
                <span>{priceRange[0]} ر.س</span>
                <span>{priceRange[1]} ر.س</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="sizes">
          <AccordionTrigger>المقاسات</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {sizes.map((size) => (
                <div key={size.id} className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox id={`size-${size.id}`} />
                  <Label htmlFor={`size-${size.id}`}>{size.label}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="colors">
          <AccordionTrigger>الألوان</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-4 gap-2">
              {colors.map((color) => (
                <div key={color.id} className="flex flex-col items-center gap-1">
                  <button className={`w-8 h-8 rounded-full ${color.color}`} title={color.label} />
                  <span className="text-xs">{color.label}</span>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
