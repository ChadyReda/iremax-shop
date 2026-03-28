"use server";

import { supabaseAdmin } from "../supabase";

/**
 * Upload an image to a Supabase bucket using the service role client (bypasses RLS).
 * This must be called from the server.
 * @param formData The form data containing the 'file' and 'bucket' fields.
 * @returns The public URL of the uploaded image.
 */
export async function uploadImageAction(formData: FormData): Promise<string> {
  const file = formData.get("file") as File;
  const bucket = formData.get("bucket") as string;

  if (!file) {
    throw new Error("No file provided");
  }

  if (!bucket) {
    throw new Error("No bucket specified");
  }

  const fileExt = file.name.split(".").pop();
  const fileName = `${Math.random().toString(36).substring(2, 11)}_${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;

  // Use the admin client to bypass RLS policies
  const { data, error } = await supabaseAdmin.storage
    .from(bucket)
    .upload(filePath, file);

  if (error) {
    console.error("Supabase Storage Error:", error);
    throw new Error(`Error uploading image: ${error.message}`);
  }

  const { data: { publicUrl } } = supabaseAdmin.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return publicUrl;
}
