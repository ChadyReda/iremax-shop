import { getProducts } from "@/lib/actions/product";
import { getOrders as getAllOrders } from "@/lib/actions/order";
import { 
  ShoppingCart, 
  Package, 
  TrendingUp, 
  Activity, 
  Clock, 
  CheckCircle2, 
  XSquare, 
  ChevronRight,
  TrendingDown,
  Users,
  ArrowRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default async function AdminDashboard() {
  const orders = await getAllOrders();
  const products = await getProducts();
  
  const stats = [
    { title: "Total Revenue", value: `${orders.reduce((acc, o) => acc + o.totalAmount, 0).toLocaleString()} MAD`, icon: Activity, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Total Orders", value: orders.length, icon: ShoppingCart, color: "text-accent", bg: "bg-accent/10" },
    { title: "Inventory", value: products.length, icon: Package, color: "text-amber-500", bg: "bg-amber-50" },
    { title: "Customers", value: new Set(orders.map(o => o.customerPhone)).size, icon: Users, color: "text-success", bg: "bg-success/10" },
  ];

  const statusStats = {
     pending: orders.filter(o => !o.status || o.status.toUpperCase() === 'PENDING' || o.status.toUpperCase() === 'PROCESSING').length,
     delivered: orders.filter(o => o.status?.toUpperCase() === 'DELIVERED').length,
     canceled: orders.filter(o => o.status?.toUpperCase() === 'CANCELLED' || o.status?.toUpperCase() === 'CANCELED').length,
  };

  const recentProducts = products.slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter italic">Dashboard</h1>
        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Store performance</p>
      </div>

      {/* Hero Stats - Responsive Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="group border-none shadow-sm hover:shadow-md hover:-translate-y-1 transition-all rounded-2xl p-3 sm:p-4 bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
               <CardTitle className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-muted-foreground">{stat.title}</CardTitle>
               <div className={cn("p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl transition-transform group-hover:rotate-12", stat.bg, stat.color)}>
                 <stat.icon className="w-3 h-3 sm:w-5 sm:h-5" />
               </div>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-3xl font-black tracking-tighter uppercase truncate">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">
        {/* Status Breakdown */}
        <div className="lg:col-span-1 space-y-6 flex flex-col h-full">
           <Card className="border-none shadow-sm rounded-2xl sm:rounded-3xl bg-white flex-grow">
              <CardHeader>
                <CardTitle className="text-xs font-black uppercase tracking-widest">Order Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
                 {[
                   { label: "Pending", count: statusStats.pending, icon: Clock, color: "text-amber-500", bg: "bg-amber-50" },
                   { label: "Delivered", count: statusStats.delivered, icon: CheckCircle2, color: "text-success", bg: "bg-success/5" },
                   { label: "Canceled", count: statusStats.canceled, icon: XSquare, color: "text-destructive", bg: "bg-destructive/5" },
                 ].map((s) => (
                   <div key={s.label} className="flex items-center gap-3 sm:gap-4">
                      <div className={cn("w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0", s.bg, s.color)}>
                         <s.icon className="w-4 h-4 sm:w-6 sm:h-6" />
                      </div>
                      <div className="flex-grow">
                         <p className="text-[8px] sm:text-[10px] uppercase font-black tracking-widest text-muted-foreground">{s.label}</p>
                         <h4 className="text-xl sm:text-2xl font-black tracking-tighter uppercase">{s.count}</h4>
                      </div>
                   </div>
                 ))}
              </CardContent>
           </Card>
        </div>

        {/* Recent Orders Table */}
        <div className="lg:col-span-2 space-y-6">
           <Card className="border-none shadow-sm rounded-2xl sm:rounded-3xl bg-white h-full">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-black uppercase tracking-widest">Recent Orders</CardTitle>
                <Link href="/admin/orders">
                  <Button variant="ghost" size="sm" className="text-[10px] uppercase font-black tracking-widest hover:text-accent transition-colors gap-1">
                    See all <ArrowRight className="w-3 h-3" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                 <div className="overflow-x-auto">
                 <Table>
                    <TableHeader className="bg-gray-50/50">
                       <TableRow className="border-none">
                          <TableHead className="text-[8px] sm:text-[10px] uppercase font-black tracking-widest text-muted-foreground h-10">Order</TableHead>
                          <TableHead className="text-[8px] sm:text-[10px] uppercase font-black tracking-widest text-muted-foreground h-10">Customer</TableHead>
                          <TableHead className="text-[8px] sm:text-[10px] uppercase font-black tracking-widest text-muted-foreground h-10">Status</TableHead>
                          <TableHead className="text-[8px] sm:text-[10px] uppercase font-black tracking-widest text-muted-foreground h-10 text-right">Amount</TableHead>
                       </TableRow>
                    </TableHeader>
                    <TableBody>
                       {orders.slice(0, 5).map((order) => (
                         <TableRow key={order.id} className="border-b border-border/40 hover:bg-gray-50/50 group transition-colors cursor-pointer">
                            <TableCell className="font-bold text-xs">#{order.id.slice(-6).toUpperCase()}</TableCell>
                            <TableCell>
                               <div className="space-y-0.5">
                                  <p className="font-black text-xs uppercase tracking-tight truncate max-w-[120px]">{order.customerName}</p>
                                  <p className="text-[9px] text-muted-foreground font-medium uppercase tracking-widest">{order.customerPhone}</p>
                               </div>
                            </TableCell>
                            <TableCell>
                               <Badge className={cn(
                                 "rounded-lg border-none font-bold text-[8px] sm:text-[9px] h-5 sm:h-6 uppercase px-1.5 sm:px-2 shadow-sm",
                                 order.status?.toUpperCase() === 'DELIVERED' ? "bg-success text-white" : 
                                 order.status?.toUpperCase() === 'CANCELLED' || order.status?.toUpperCase() === 'CANCELED' ? "bg-destructive text-white" : "bg-amber-500 text-white"
                               )}>
                                 {order.status || 'PENDING'}
                               </Badge>
                            </TableCell>
                            <TableCell className="text-right font-black text-sm tracking-tighter">
                               {order.totalAmount.toLocaleString()} MAD
                            </TableCell>
                         </TableRow>
                       ))}
                       {orders.length === 0 && (
                         <TableRow>
                            <TableCell colSpan={4} className="h-20 sm:h-40 text-center text-xs font-black uppercase tracking-widest text-muted-foreground">
                               No orders yet
                            </TableCell>
                         </TableRow>
                       )}
                    </TableBody>
                 </Table>
                 </div>
              </CardContent>
           </Card>
           
           {/* Recent Products */}
           <Card className="border-none shadow-sm rounded-2xl sm:rounded-3xl bg-white">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-black uppercase tracking-widest">Recent Products</CardTitle>
                <Link href="/admin/products">
                  <Button variant="ghost" size="sm" className="text-[10px] uppercase font-black tracking-widest hover:text-accent transition-colors gap-1">
                    Manage <ArrowRight className="w-3 h-3" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                 <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-2">
                    {recentProducts.map((product) => (
                      <Link key={product.id} href={`/product/${product.slug}`} target="_blank" className="shrink-0">
                         <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-gray-100 border border-border/40 shadow-sm hover:scale-105 transition-transform">
                            <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                         </div>
                         <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-tight mt-2 truncate max-w-[90px]">{product.title}</p>
                         <p className="text-[8px] sm:text-[9px] text-muted-foreground font-bold">{product.price.toLocaleString()} MAD</p>
                      </Link>
                    ))}
                    {recentProducts.length === 0 && (
                      <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">No products yet</p>
                    )}
                 </div>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
