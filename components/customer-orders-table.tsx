import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"

// Mock data for customer orders
const customerOrders = [
  {
    id: "ORD-001",
    date: "2023-05-01",
    status: "completed",
    items: 3,
    total: "450.00",
  },
  {
    id: "ORD-002",
    date: "2023-05-10",
    status: "processing",
    items: 2,
    total: "320.50",
  },
  {
    id: "ORD-003",
    date: "2023-05-15",
    status: "shipped",
    items: 4,
    total: "650.75",
  },
  {
    id: "ORD-004",
    date: "2023-05-20",
    status: "pending",
    items: 1,
    total: "120.25",
  },
]

// Helper function to get status badge color
const getStatusBadge = (status: string) => {
  switch (status) {
    case "completed":
      return <Badge className="bg-emerald-500">مكتمل</Badge>
    case "processing":
      return <Badge className="bg-blue-500">قيد المعالجة</Badge>
    case "shipped":
      return <Badge className="bg-amber-500">تم الشحن</Badge>
    case "pending":
      return <Badge className="bg-slate-500">معلق</Badge>
    default:
      return <Badge>{status}</Badge>
  }
}

export default function CustomerOrdersTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>رقم الطلب</TableHead>
          <TableHead>التاريخ</TableHead>
          <TableHead>الحالة</TableHead>
          <TableHead>عدد المنتجات</TableHead>
          <TableHead>المبلغ</TableHead>
          <TableHead className="text-left">الإجراءات</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {customerOrders.map((order) => (
          <TableRow key={order.id}>
            <TableCell className="font-medium">{order.id}</TableCell>
            <TableCell>{order.date}</TableCell>
            <TableCell>{getStatusBadge(order.status)}</TableCell>
            <TableCell>{order.items}</TableCell>
            <TableCell>{order.total} ر.س</TableCell>
            <TableCell className="text-left">
              <Button variant="ghost" size="icon">
                <Eye className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
