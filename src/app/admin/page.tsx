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
  Users
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

  return (
    <div className="space-y-12">
      <div className="space-y-2">
        <h1 className="text-5xl font-black uppercase tracking-tighter italic">Dashboard</h1>
        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Store performance overview since launch</p>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="group border-none shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all rounded-3xl p-2 bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
               <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{stat.title}</CardTitle>
               <div className={cn("p-2.5 rounded-xl transition-transform group-hover:rotate-12", stat.bg, stat.color)}>
                 <stat.icon className="w-5 h-5" />
               </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black tracking-tighter uppercase">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Status Breakdown Section */}
        <div className="lg:col-span-1 space-y-6 flex flex-col h-full">
           <Card className="border-none shadow-sm rounded-3xl bg-white flex-grow">
              <CardHeader>
                <CardTitle className="text-xs font-black uppercase tracking-widest">Order Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                 {[
                   { label: "Pending Fulfillment", count: statusStats.pending, icon: Clock, color: "text-amber-500", bg: "bg-amber-50" },
                   { label: "Successfully Delivered", count: statusStats.delivered, icon: CheckCircle2, color: "text-success", bg: "bg-success/5" },
                   { label: "Canceled Orders", count: statusStats.canceled, icon: XSquare, color: "text-destructive", bg: "bg-destructive/5" },
                 ].map((s) => (
                   <div key={s.label} className="flex items-center gap-4">
                      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0", s.bg, s.color)}>
                         <s.icon className="w-6 h-6" />
                      </div>
                      <div className="flex-grow">
                         <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">{s.label}</p>
                         <h4 className="text-2xl font-black tracking-tighter uppercase">{s.count}</h4>
                      </div>
                   </div>
                 ))}
                 
              </CardContent>
           </Card>
        </div>

        {/* Recent Orders Table */}
        <div className="lg:col-span-2 space-y-6">
           <Card className="border-none shadow-sm rounded-3xl bg-white h-full">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-black uppercase tracking-widest">Recent Activity</CardTitle>
                <Link href="/admin/orders">
                  <Button variant="ghost" className="text-[10px] uppercase font-black tracking-widest hover:text-accent transition-colors">See all</Button>
                </Link>
              </CardHeader>
              <CardContent>
                 <Table>
                    <TableHeader className="bg-gray-50/50">
                       <TableRow className="border-none">
                          <TableHead className="text-[10px] uppercase font-black tracking-widest text-muted-foreground h-10">Order ID</TableHead>
                          <TableHead className="text-[10px] uppercase font-black tracking-widest text-muted-foreground h-10">Customer</TableHead>
                          <TableHead className="text-[10px] uppercase font-black tracking-widest text-muted-foreground h-10">Status</TableHead>
                          <TableHead className="text-[10px] uppercase font-black tracking-widest text-muted-foreground h-10 text-right">Amount</TableHead>
                       </TableRow>
                    </TableHeader>
                    <TableBody>
                       {orders.slice(0, 5).map((order) => (
                         <TableRow key={order.id} className="border-b border-border/40 hover:bg-gray-50/50 group transition-colors cursor-pointer">
                            <TableCell className="font-bold text-xs">#{order.id.slice(-6).toUpperCase()}</TableCell>
                            <TableCell>
                               <div className="space-y-0.5">
                                  <p className="font-black text-xs uppercase tracking-tight">{order.customerName}</p>
                                  <p className="text-[9px] text-muted-foreground font-medium uppercase tracking-widest">{order.customerPhone}</p>
                               </div>
                            </TableCell>
                            <TableCell>
                               <Badge className={cn(
                                 "rounded-lg border-none font-bold text-[9px] h-6 uppercase px-2 shadow-sm animate-in zoom-in duration-300",
                                 order.status === 'delivered' ? "bg-success text-white" : 
                                 order.status === 'pending' ? "bg-amber-500 text-white" : "bg-destructive text-white"
                               )}>
                                 {order.status}
                               </Badge>
                            </TableCell>
                            <TableCell className="text-right font-black text-sm tracking-tighter">
                               {order.totalAmount.toLocaleString()} MAD
                            </TableCell>
                         </TableRow>
                       ))}
                       {orders.length === 0 && (
                         <TableRow>
                            <TableCell colSpan={4} className="h-40 text-center text-xs font-black uppercase tracking-widest text-muted-foreground italic">
                               No orders logged yet. Start capturing details!
                            </TableCell>
                         </TableRow>
                       )}
                    </TableBody>
                 </Table>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
