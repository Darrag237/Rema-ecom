import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShoppingBag, Heart, ShoppingCart, Clock } from "lucide-react"
import CustomerOrdersTable from "@/components/customer-orders-table"
import WishlistItems from "@/components/wishlist-items"

export default function CustomerDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">حسابي</h1>
        <p className="text-muted-foreground">مرحباً بك في حسابك الشخصي</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">طلباتي</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground mt-1">3 طلبات في الطريق</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">المفضلة</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground mt-1">منتجات في قائمة المفضلة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">سلة التسوق</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground mt-1">منتجات في سلة التسوق</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">آخر طلب</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">قيد التوصيل</div>
            <p className="text-xs text-muted-foreground mt-1">تم الطلب منذ 3 أيام</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="orders">
        <TabsList>
          <TabsTrigger value="orders">طلباتي</TabsTrigger>
          <TabsTrigger value="wishlist">المفضلة</TabsTrigger>
        </TabsList>
        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>طلباتي</CardTitle>
              <CardDescription>قائمة بجميع طلباتك السابقة</CardDescription>
            </CardHeader>
            <CardContent>
              <CustomerOrdersTable />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="wishlist" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>المفضلة</CardTitle>
              <CardDescription>المنتجات التي أضفتها إلى قائمة المفضلة</CardDescription>
            </CardHeader>
            <CardContent>
              <WishlistItems />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
