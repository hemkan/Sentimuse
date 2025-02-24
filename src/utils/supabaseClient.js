import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);

export const uploadToSupabase = async (file, folder = "uploads") => {
  try {
    if (!file) throw new Error("No file provided");

    const uniqueFileName = `${folder}/${Date.now()}-${file.name}`;

    const { data, error } = await supabase.storage
      .from("audio-files")
      .upload(uniqueFileName, file);

    if (error) {
      console.error("Supabase upload error:", error.message);
      return null;
    }

    const publicUrl = supabase.storage
      .from("audio-files")
      .getPublicUrl(data.path);
    if (!publicUrl) {
      throw new Error("Failed to get public URL");
    }

    console.log("Uploaded File URL:", publicUrl);
    return publicUrl;
  } catch (error) {
    console.error("Upload to Supabase failed:", error.message);
    return null;
  }
};
