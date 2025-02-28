import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);

export const uploadToSupabase = async (file, folder = "uploads") => {
  try {
    if (!file) throw new Error("No file provided");

    // make filename safe for url
    const safeFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");

    // create a unique filename
    const uniqueFileName = `${folder}/${Date.now()}-${safeFileName}`;

    // upload the file
    const { data, error } = await supabase.storage
      .from("audio-files")
      .upload(uniqueFileName, file);

    // if there is an error, log it and return null
    if (error) {
      console.error("Supabase upload error:", error.message);
      return null;
    }

    // form the url for the uploaded file
    const publicUrl = `${supabaseUrl}/storage/v1/object/public/audio-files/${data.path}`;
    console.log("Uploaded File URL:", publicUrl);
    return publicUrl;
  } catch (error) {
    console.error("Upload to Supabase failed:", error.message);
    return null;
  }
};
