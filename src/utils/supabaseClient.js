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

export const downloadFromSupabase = async (fileUrl) => {
  try {
    if (!fileUrl) throw new Error("No file URL provided");

    // get the path from the full URL
    const url = new URL(fileUrl);
    const path = url.pathname.split("/storage/v1/object/public/")[1];

    // remove any duplicate audio files in the path
    const cleanPath = path.replace("audio-files/", "");

    // get file data
    const { data, error } = await supabase.storage
      .from("audio-files")
      .download(cleanPath);

    if (error) {
      console.error("Supabase download error:", error.message);
      return null;
    }

    // create blob URL and trigger the download
    const blobUrl = URL.createObjectURL(data);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = cleanPath.split("/").pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);

    return true;
  } catch (error) {
    console.error("Download from Supabase failed:", error.message);
    return null;
  }
};
