import { getOrders, updateOrderStatus } from "@/lib/actions/order";
import AdminOrdersClient from "./AdminOrdersClient";

export default async function AdminOrdersPage() {
  const orders = await getOrders();
  return <AdminOrdersClient initialOrders={orders} />;
}