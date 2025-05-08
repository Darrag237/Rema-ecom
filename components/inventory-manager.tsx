"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { AlertCircle, Save, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Size {
  name: string
  inventory: number
}

interface Product {
  id: string
  name: string
  image: string
  sizes: Size[]
  totalInventory: number
}

export default function InventoryManager({ productId }: { productId: string }) {
  const { toast } = useToast()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [inventory, setInventory] = useState<Record<string, number>>({})

  // جلب بيانات المنتج
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        setError("")

        const response = await fetch(`/api/products/${productId}`)

        if (!response.ok) {
          throw new Error("فشل في جلب بيانات المنتج")
        }

        const data = await response.json()

        setProduct({
          id: data._id,
          name: data.name,
          image: data.images[0],
          sizes: data.sizes,
          totalInventory: data.totalInventory,
        })

        // تهيئة حالة المخزون
        const inventoryState: Record<string, number> = {}
        data.sizes.forEach((size: Size) => {
          inventoryState[size.name] = size.inventory
        })

        setInventory(inventoryState)
      } catch (error: any) {
        console.error("Error fetching product:", error)
        setError(error.message || "حدث خطأ أثناء جلب بيانات المنتج")
      } finally {
        setLoading(false)
      }
    }

    if (productId) {
      fetchProduct()
    }
  }, [productId])

  // تحديث قيمة المخزون
  const handleInventoryChange = (sizeName: string, value: string) => {
    const numValue = Number.parseInt(value)

    if (isNaN(numValue) || numValue < 0) return

    setInventory((prev) => ({
      ...prev,
      [sizeName]: numValue,
    }))
  }

  // حفظ التغييرات
  const saveInventory = async () => {
    try {
      setSaving(true)
      setError("")

      // تحويل البيانات إلى التنسيق المطلوب للـ API
      const sizeUpdates = Object.entries(inventory).map(([sizeName, newInventory]) => ({
        sizeName,
        newInventory,
      }))

      const response = await fetch("/api/inventory/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          sizeUpdates,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "فشل في تحديث المخزون")
      }

      const data = await response.json()

      // تحديث بيانات المنتج
      setProduct((prev) => {
        if (!prev) return null

        return {
          ...prev,
          sizes: data.product.sizes,
          totalInventory: data.product.totalInventory,
        }
      })

      toast({
        title: "تم تحديث المخزون بنجاح",
        description: "تم حفظ التغييرات بنجاح",
      })
    } catch (error: any) {
      console.error("Error updating inventory:", error)
      setError(error.message || "حدث خطأ أثناء تحديث المخزون")

      toast({
        title: "خطأ",
        description: error.message || "حدث خطأ أثناء تحديث المخزون",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-rose-600" />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!product) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>لم يتم العثور على المنتج</AlertDescription>
      </Alert>
    )
  }

  // حساب إجمالي المخزون الجديد
  const newTotalInventory = Object.values(inventory).reduce((sum, value) => sum + value, 0)

  // التحقق من وجود تغييرات
  const hasChanges = product.sizes.some((size) => inventory[size.name] !== size.inventory)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">{product.name}</h2>
        <Badge variant={newTotalInventory > 0 ? "outline" : "destructive"}>
          {newTotalInventory > 0 ? `المخزون: ${newTotalInventory}` : "نفذت الكمية"}
        </Badge>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>المقاس</TableHead>
            <TableHead>المخزون الحالي</TableHead>
            <TableHead>المخزون الجديد</TableHead>
            <TableHead>الحالة</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {product.sizes.map((size) => (
            <TableRow key={size.name}>
              <TableCell className="font-medium">{size.name}</TableCell>
              <TableCell>{size.inventory}</TableCell>
              <TableCell>
                <Input
                  type="number"
                  min="0"
                  value={inventory[size.name]}
                  onChange={(e) => handleInventoryChange(size.name, e.target.value)}
                  className="w-24"
                />
              </TableCell>
              <TableCell>
                {inventory[size.name] === 0 ? (
                  <Badge variant="destructive">نفذت الكمية</Badge>
                ) : inventory[size.name] <= 5 ? (
                  <Badge variant="outline" className="text-amber-500 border-amber-500">
                    كمية منخفضة
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-emerald-500 border-emerald-500">
                    متوفر
                  </Badge>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-end">
        <Button onClick={saveInventory} disabled={!hasChanges || saving} className="bg-rose-600 hover:bg-rose-700">
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              جاري الحفظ...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              حفظ التغييرات
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
