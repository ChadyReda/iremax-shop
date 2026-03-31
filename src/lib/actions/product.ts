"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { Product } from "@/types/product";

interface CreateReviewParams {
  rating: number;
  comment: string;
  productId: string;
  userId: string;
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  userId: string;
  productId: string;
  createdAt: string;
  user?: {
    name: string;
    image: string;
  };
}

export async function createReview({ rating, comment, productId, userId }: CreateReviewParams) {
  try {
    const { data, error } = await supabase
      .from("Review")
      .insert([
        {
          rating,
          comment,
          userId,
          productId,
        },
      ])
      .select(`
        *,
        user:userId (
          name,
          image
        )
      `)
      .single();

    if (error) throw error;

    revalidatePath(`/product/${productId}`);
    return { success: true, data };
  } catch (error) {
    console.error("Error creating review:", error);
    return { success: false, error: "Failed to create review" };
  }
}

export async function getProductReviews(productId: string): Promise<Review[]> {
  try {
    const { data, error } = await supabase
      .from("Review")
      .select(`
        *,
        user:userId (
          name,
          image
        )
      `)
      .eq("productId", productId)
      .order("createdAt", { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
}

export async function getProductsByIds(ids: string[]) {
  if (!ids.length) return [];

  const { data, error } = await supabase
    .from("Product")
    .select("*, category:Category(*), collection:Collection(*)")
    .in("id", ids);

  if (error) throw error;

  return data;
}

export async function getProducts(options: {
  categoryId?: string;
  limit?: number;
  collectionSlug?: string;
  search?: string;
} = {}) {
  const { categoryId, limit, collectionSlug, search } = options;

  let query = supabase
    .from('Product')
    .select('*, category:Category(*), collection:Collection(*)')
    .order('createdAt', { ascending: false });

  if (categoryId) query = query.eq('categoryId', categoryId);
  if (collectionSlug) {
    const { data: collectionData } = await supabase
      .from('Collection')
      .select('id')
      .eq('slug', collectionSlug)
      .single();
    
    if (collectionData) {
      query = query.eq('collectionId', collectionData.id);
    }
  }
  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
  }
  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getCategories() {
  const { data, error } = await supabase
    .from('Category')
    .select('*')
    .order('name', { ascending: true });

  if (error) throw error;
  return data;
}

export async function getMainCategories() {
  const { data, error } = await supabase
    .from('Category')
    .select('*')
    .eq('isMain', true)
    .limit(3);

  if (error) throw error;
  return data;
}

export async function getCollections() {
  const { data, error } = await supabase
    .from('Collection')
    .select('*')
    .order('name', { ascending: true });

  if (error) throw error;
  return data;
}


export async function getProductBySlug(slug: string) {
  const { data, error } = await supabase
    .from('Product')
    .select('*, category:Category(*), collection:Collection(*), reviews:Review(*, user:User(*))')
    .eq('slug', slug)
    .single();

  if (error) throw error;
  return data;
}

export async function createProduct(productData: Partial<Product>) {
  const { data, error } = await supabase
    .from('Product')
    .insert(productData)
    .select()
    .single();

  if (error) throw error;

  revalidatePath("/admin/products");
  revalidatePath("/category/[slug]");
  return data;
}

export async function updateProduct(id: string, productData: Partial<Product>) {
  const { data, error } = await supabase
    .from('Product')
    .update(productData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  revalidatePath("/admin/products");
  revalidatePath("/product/[slug]");
  return data;
}

export async function deleteProduct(id: string) {
  // Delete related records first to avoid foreign key constraint errors
  await supabase.from('OrderItem').delete().eq('productId', id);
  await supabase.from('Review').delete().eq('productId', id);

  const { error } = await supabase
    .from('Product')
    .delete()
    .eq('id', id);

  if (error) throw error;

  revalidatePath("/admin/products");
}

// src/lib/actions/product.ts
export async function createCategory(data: Partial<any>) {
  if (data.isMain) {
    const { data: categories, error } = await supabase
      .from('Category')
      .select('*', { count: 'exact' })
      .eq('isMain', true)
    console.log(categories)
    if (error) throw error;

    if ((categories?.length ?? 0) >= 3) {
      return { error: "Only 3 categories can be shown on the home page" };
    }
  }

  const { data: category, error } = await supabase
    .from('Category')
    .insert(data)
    .select()
    .single();

  if (error) throw error;
  revalidatePath("/admin/categories");
  return { category };
}

// src/lib/actions/product.ts
export async function updateCategory(id: string, data: Partial<any>) {
  if (data.isMain) {
    // Count all categories that are main, excluding the one being updated
    const { data: categories, error } = await supabase
      .from('Category')
      .select('*', { count: 'exact' })
      .neq('id', id)
      .eq('isMain', true)

    if (error) throw error;

    console.log(categories)

    if ((categories?.length ?? 0) >= 3) {
      return { error: "Only 3 categories can be shown on the home page" };
    }
  }

  const { data: category, error } = await supabase
    .from('Category')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  revalidatePath("/admin/categories");
  return { category };
}

export async function deleteCategory(id: string) {
  const { error } = await supabase
    .from('Category')
    .delete()
    .eq('id', id);

  if (error) throw error;
  revalidatePath("/admin/categories");
}

export async function createCollection(data: Partial<any>) {
  const { data: collection, error } = await supabase
    .from('Collection')
    .insert(data)
    .select()
    .single();

  if (error) throw error;
  revalidatePath("/admin/collections");
  return collection;
}

export async function updateCollection(id: string, data: Partial<any>) {
  const { data: collection, error } = await supabase
    .from('Collection')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  revalidatePath("/admin/collections");
  return collection;
}

export async function deleteCollection(id: string) {
  const { error } = await supabase
    .from('Collection')
    .delete()
    .eq('id', id);

  if (error) throw error;
  revalidatePath("/admin/collections");
}


