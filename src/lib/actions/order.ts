"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function createOrder(data: {
  userId?: string;
  customerName: string;
  customerPhone: string;
  whatsappNumber: string;
  customerAddress: string;
  totalAmount: number;
  items: { 
    productId: string; 
    quantity: number; 
    price: number; 
    title: string; 
    image: string; 
  }[];
}) {
  // 1. Create the order
  const { data: order, error: orderError } = await supabase
    .from('Order')
    .insert({
      userId: data.userId,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      whatsappNumber: data.whatsappNumber,
      customerAddress: data.customerAddress,
      totalAmount: data.totalAmount,
    })
    .select()
    .single();

  if (orderError) throw orderError;

  // 2. Create order items
  const orderItemsData = data.items.map(item => ({
    orderId: order.id,
    productId: item.productId,
    title: item.title,
    image: item.image,
    quantity: item.quantity,
    price: item.price
  }));

  const { error: itemsError } = await supabase
    .from('OrderItem')
    .insert(orderItemsData);

  if (itemsError) {
    console.error("Error creating order items:", itemsError);
    throw itemsError;
  }

  revalidatePath("/admin/orders");
  revalidatePath("/profile");
  return order;
}


export async function updateOrderStatus(orderId: string, status: string) {
  const { data: order, error } = await supabase
    .from('Order')
    .update({ status })
    .eq('id', orderId)
    .select()
    .single();

  if (error) throw error;
  revalidatePath("/admin/orders");
  return order;
}

export async function getOrders() {
  const { data, error } = await supabase
    .from('Order')
    .select('*, items:OrderItem(*, product:Product(*))')
    .order('createdAt', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getUserOrders(userId: string) {
  const { data, error } = await supabase
    .from('Order')
    .select('*, items:OrderItem(*, product:Product(*))')
    .eq('userId', userId)
    .order('createdAt', { ascending: false });

  if (error) throw error;
  return data;
}

