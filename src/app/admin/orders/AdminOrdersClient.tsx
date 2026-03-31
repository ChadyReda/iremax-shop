"use client";

import { useState, useMemo } from "react";
import { updateOrderStatus } from "@/lib/actions/order";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, X, Check, Clock, Package, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type OrderStatus = "ALL" | "PENDING" | "PROCESSING" | "DELIVERED" | "CANCELLED";

interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  totalAmount: number;
  status: string | null;
  createdAt: string;
}

export default function AdminOrdersClient({ initialOrders }: { initialOrders: Order[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus>("ALL");
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [updating, setUpdating] = useState<string | null>(null);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch = !search || 
        order.customerName.toLowerCase().includes(search.toLowerCase()) ||
        order.customerPhone.includes(search) ||
        order.id.toLowerCase().includes(search.toLowerCase());
      
      const matchesStatus = statusFilter === "ALL" || 
        (statusFilter === "PENDING" && (!order.status || order.status === "PENDING" || order.status === "PROCESSING")) ||
        order.status?.toUpperCase() === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    setUpdating(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(null);
    }
  };

  const statusTabs: { label: string; value: OrderStatus; icon: any }[] = [
    { label: "All", value: "ALL", icon: Package },
    { label: "Pending", value: "PENDING", icon: Clock },
    { label: "Delivered", value: "DELIVERED", icon: Check },
    { label: "Cancelled", value: "CANCELLED", icon: XCircle },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <Badge className="bg-accent text-white rounded font-black uppercase text-[10px] tracking-widest px-3 h-6 border-none shadow-sm">Sales</Badge>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter italic leading-none">Orders</h1>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-border/40 p-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            placeholder="Search by name, phone, or order ID..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 sm:h-12 bg-white border border-border/60 rounded-xl pl-10 text-xs font-bold uppercase tracking-widest focus:ring-1 focus:ring-black focus:border-black transition-all"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-1">
          {statusTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all",
                statusFilter === tab.value 
                  ? "bg-black text-white" 
                  : "bg-gray-100 text-muted-foreground hover:bg-gray-200"
              )}
            >
              <tab.icon className="w-3 h-3" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-border/40 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50/80">
              <TableRow>
                <TableHead className="pl-4 sm:pl-8 text-[10px] uppercase font-black">Order Info</TableHead>
                <TableHead className="text-[10px] uppercase font-black">Customer</TableHead>
                <TableHead className="text-[10px] uppercase font-black">Amount</TableHead>
                <TableHead className="text-[10px] uppercase font-black text-center">Status</TableHead>
                <TableHead className="text-[10px] uppercase font-black text-right pr-4 sm:pr-10">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="pl-4 sm:pl-8 py-4">
                    <div className="space-y-1">
                      <p className="font-black text-xs sm:text-sm uppercase tracking-tight">#{order.id.slice(0, 8)}</p>
                      <p className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-black">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-bold text-xs uppercase">{order.customerName}</p>
                      <p className="text-[9px] sm:text-[10px] text-muted-foreground">{order.customerPhone}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-black text-sm uppercase tracking-tight text-accent">{order.totalAmount.toLocaleString()} MAD</p>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge className={cn(
                      "border-none font-black text-[9px] uppercase gap-1.5 px-2 sm:px-3",
                      order.status?.toUpperCase() === 'DELIVERED' ? "bg-success text-white" : 
                      order.status?.toUpperCase() === 'CANCELLED' || order.status?.toUpperCase() === 'CANCELED' ? "bg-destructive text-white" :
                      "bg-amber-500 text-white"
                    )}>
                      {order.status || 'PENDING'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-4 sm:pr-10">
                    <div className="flex items-center justify-end gap-1.5 sm:gap-2">
                      {(!order.status || order.status === 'PENDING' || order.status === 'PROCESSING') && (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleStatusUpdate(order.id, 'PROCESSING')}
                            disabled={updating === order.id}
                            className="h-8 text-[9px] uppercase font-black"
                          >
                            Process
                          </Button>
                          <Button 
                            variant="default" 
                            size="sm" 
                            onClick={() => handleStatusUpdate(order.id, 'DELIVERED')}
                            disabled={updating === order.id}
                            className="h-8 text-[9px] uppercase font-black bg-success hover:bg-success/90"
                          >
                            Deliver
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleStatusUpdate(order.id, 'CANCELLED')}
                            disabled={updating === order.id}
                            className="h-8 text-[9px] uppercase font-black text-destructive hover:text-destructive"
                          >
                            Cancel
                          </Button>
                        </>
                      )}
                      {order.status?.toUpperCase() === 'DELIVERED' && (
                        <span className="text-[8px] uppercase font-black text-success">Completed</span>
                      )}
                      {order.status?.toUpperCase() === 'CANCELLED' && (
                        <span className="text-[8px] uppercase font-black text-destructive">Cancelled</span>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredOrders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-muted-foreground font-medium text-sm">
                    No orders found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        <div className="p-4 border-t border-border/40 flex items-center justify-between">
          <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">
            Showing {filteredOrders.length} of {orders.length} orders
          </p>
        </div>
      </div>
    </div>
  );
}