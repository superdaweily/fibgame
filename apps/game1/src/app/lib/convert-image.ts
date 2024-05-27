import fetch from "node-fetch";
import { s3Upload } from "@/app/lib/aws-s3";

export async function convertAndSaveImage(imageUrl: string) {
  try {
    const response = await fetch(imageUrl);
    let fileBuffer;
    if (response.ok) {
      fileBuffer = await response.buffer(); // Ensure we await this to get the buffer
    } else {
      throw new Error("Failed to fetch the image");
    }

    const fileName = `image-${Date.now()}.jpg`;
    const s3Image = await s3Upload(fileBuffer!, fileName!);

    return { url: s3Image.url };
  } catch (error) {
    console.error("Error converting and saving image:", error);
    return null;
  }
}
