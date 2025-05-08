import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import Image from "next/image"

// Mock data for seller products
const sellerProducts = [
  {
    id: "PROD-001",
    name: "فستان صيفي أنيق",
    image: "/placeholder.svg?height=400&width=300",
    category: "فساتين",
    price: "299.00",
    stock: 25,
    status: "active",
  },
  {
    id: "PROD-002",
    name: "بلوزة كاجوال",
    image: "/placeholder.svg?height=400&width=300",
    category: "بلوزات",
    price: "149.00",
    stock: 42,
    status: "active",
  },
  {
    id: "PROD-003",
    name: "بنطلون جينز عصري",
    image: "/placeholder.svg?height=400&width=300",
    category: "بناطيل",
    price: "199.00",
    stock: 18,
    status: "active",
  },
  {
    id: "PROD-004",
    name: "فستان سهرة فاخر",
    image: "/placeholder.svg?height=400&width=300",
    category: "فساتين",
    price: "499.00",
    stock: 5,
    status: "low_stock",
  },
  {
    id: "PROD-005",
    name: "تيشيرت قطني",
    image: "/placeholder.svg?height=400&width=300",
    category: "تيشيرتات",
    price: "89.00",
    stock: 0,
    status: "out_of_stock",
  },
]

// Helper function to get status badge color
const getStatusBadge = (status: string, stock: number) => {
  if (status === "out_of_stock" || stock === 0) {
    return <Badge variant="destructive">نفذت الكمية</Badge>
  } else if (status === "low_stock" || stock < 10) {
    return (
      <Badge variant="outline" className="text-amber-500 border-amber-500">
        كمية منخفضة
      </Badge>
    )
  } else {
    return (
      <Badge variant="outline" className="text-emerald-500 border-emerald-500">
        متوفر
      </Badge>
    )
  }
}

export default function SellerProductsTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>المنتج</TableHead>
          <TableHead>التصنيف</TableHead>
          <TableHead>السعر</TableHead>
          <TableHead>المخزون</TableHead>
          <TableHead>الحالة</TableHead>
          <TableHead className="text-left">الإجراءات</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sellerProducts.map((product) => (
          <TableRow key={product.id}>
            <TableCell>
              <div className="flex items-center gap-3">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  width={40}
                  height={40}
                  className="rounded-md object-cover"
                />
                <span className="font-medium">{product.name}</span>
              </div>
            </TableCell>
            <TableCell>{product.category}</TableCell>
            <TableCell>{product.price} ر.س</TableCell>
            <TableCell>{product.stock}</TableCell>
            <TableCell>{getStatusBadge(product.status, product.stock)}</TableCell>
            <TableCell className="text-left">
              <div className="flex gap-2">
                <Button variant="ghost" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
