import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShoppingBag, DollarSign, TrendingUp, Star } from "lucide-react"
import RecentOrdersTable from "@/components/recent-orders-table"
import SalesChart from "@/components/sales-chart"
import SellerProductsTable from "@/components/seller-products-table"

export default function SellerDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">لوحة تحكم البائع</h1>
        <p className="text-muted-foreground">مرحباً بك في لوحة تحكم متجر Rima</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المبيعات</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5,678 ر.س</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <TrendingUp className="h-4 w-4 text-emerald-500 mr-1" />
              <span className="text-emerald-500 font-medium">+8.3%</span> مقارنة بالشهر الماضي
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">عدد الطلبات</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <TrendingUp className="h-4 w-4 text-emerald-500 mr-1" />
              <span className="text-emerald-500 font-medium">+5.7%</span> مقارنة بالشهر الماضي
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">تقييم المنتجات</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.7 / 5</div>
            <p className="text-xs text-muted-foreground mt-1">بناءً على 156 تقييم</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="products">
        <TabsList>
          <TabsTrigger value="products">منتجاتي</TabsTrigger>
          <TabsTrigger value="orders">الطلبات</TabsTrigger>
          <TabsTrigger value="sales">المبيعات</TabsTrigger>
        </TabsList>
        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>منتجاتي</CardTitle>
              <CardDescription>قائمة بالمنتجات التي تقوم ببيعها</CardDescription>
            </CardHeader>
            <CardContent>
              <SellerProductsTable />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>أحدث الطلبات</CardTitle>
              <CardDescription>قائمة بأحدث الطلبات المستلمة لمنتجاتك</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentOrdersTable />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>تحليل المبيعات</CardTitle>
              <CardDescription>إجمالي مبيعات منتجاتك خلال الـ 30 يوم الماضية</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <SalesChart />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
