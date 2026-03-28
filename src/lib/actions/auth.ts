"use server";

import { supabase } from "@/lib/supabase";

export async function registerUser(data: {
  name: string;
  email: string;
  phone: string;
  password?: string;
}) {
  // In a real app, you'd handle password hashing (e.g. with bcrypt) here.
  
  const { data: user, error } = await supabase
    .from('User')
    .insert({
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: data.password, // Storing password
      role: 'user'
    })

    .select()
    .single();

  if (error) {
    if (error.code === '23505') { // Unique violation
        throw new Error("A user with this email already exists.");
    }
    throw error;
  }

  return user;
}
