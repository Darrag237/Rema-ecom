import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

// Mock data for recent orders
const recentOrders = [
  {
    id: "ORD-001",
    customer: "سارة أحمد",
    date: "2023-05-01",
    status: "completed",
    total: "450.00",
  },
  {
    id: "ORD-002",
    customer: "محمد علي",
    date: "2023-05-02",
    status: "processing",
    total: "320.50",
  },
  {
    id: "ORD-003",
    customer: "فاطمة محمد",
    date: "2023-05-03",
    status: "shipped",
    total: "650.75",
  },
  {
    id: "ORD-004",
    customer: "أحمد خالد",
    date: "2023-05-04",
    status: "pending",
    total: "120.25",
  },
  {
    id: "ORD-005",
    customer: "نورة سعيد",
    date: "2023-05-05",
    status: "completed",
    total: "780.00",
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

export default function RecentOrdersTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>رقم الطلب</TableHead>
          <TableHead>العميل</TableHead>
          <TableHead>التاريخ</TableHead>
          <TableHead>الحالة</TableHead>
          <TableHead className="text-left">المبلغ</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {recentOrders.map((order) => (
          <TableRow key={order.id}>
            <TableCell className="font-medium">{order.id}</TableCell>
            <TableCell>{order.customer}</TableCell>
            <TableCell>{order.date}</TableCell>
            <TableCell>{getStatusBadge(order.status)}</TableCell>
            <TableCell className="text-left">{order.total} ر.س</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
