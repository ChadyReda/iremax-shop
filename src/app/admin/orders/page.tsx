import { getOrders, updateOrderStatus } from "@/lib/actions/order";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <Badge className="bg-accent text-white rounded font-black uppercase text-[10px] tracking-widest px-3 h-6 border-none shadow-sm">Sales</Badge>
          <h1 className="text-5xl font-black uppercase tracking-tighter italic leading-none">Order Management</h1>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-border/40 overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50/80">
            <TableRow>
              <TableHead className="pl-8 text-[10px] uppercase font-black">Order Info</TableHead>
              <TableHead className="text-[10px] uppercase font-black">Customer</TableHead>
              <TableHead className="text-[10px] uppercase font-black">Amount</TableHead>
              <TableHead className="text-[10px] uppercase font-black text-center">Status</TableHead>
              <TableHead className="text-[10px] uppercase font-black text-right pr-10">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders?.map((order: any) => (
              <TableRow key={order.id}>
                <TableCell className="pl-8 py-5">
                   <div className="space-y-1">
                     <p className="font-black text-sm uppercase tracking-tight">#{order.id.slice(0, 8)}</p>
                     <p className="text-[10px] text-muted-foreground uppercase font-black">{new Date(order.createdAt).toLocaleDateString()}</p>
                   </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <p className="font-bold text-xs uppercase">{order.customerName}</p>
                    <p className="text-[10px] text-muted-foreground">{order.customerPhone}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="font-black text-sm uppercase tracking-tight text-accent">${order.totalAmount || 0}</p>
                </TableCell>
                <TableCell className="text-center">
                  <Badge className="bg-muted text-muted-foreground border-none font-black text-[9px] uppercase gap-1.5 px-3">
                     {order.status || 'PENDING'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right pr-10">
                  <div className="flex items-center justify-end gap-2">
                     <form action={async () => {
                        "use server";
                        await updateOrderStatus(order.id, 'PROCESSING');
                     }}>
                        <Button variant="outline" size="sm" className="h-8 text-[9px] uppercase font-black">Process</Button>
                     </form>
                     <form action={async () => {
                        "use server";
                        await updateOrderStatus(order.id, 'DELIVERED');
                     }}>
                        <Button variant="default" size="sm" className="h-8 text-[9px] uppercase font-black bg-success hover:bg-success/90">Deliver</Button>
                     </form>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {(!orders || orders.length === 0) && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-20 text-muted-foreground font-medium text-sm">
                  No orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
