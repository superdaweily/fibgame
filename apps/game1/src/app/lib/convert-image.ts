import { s3Upload } from "./aws-s3";

export async function convertAndSaveImage(imageUrl: string) {
  try {
    const imageData = (await fetch(imageUrl)) as any;
    const fileName = `image-${Date.now()}.jpg`;
    const s3Image = await s3Upload(imageData, fileName);
    return { url: s3Image.url };
  } catch (error) {
    console.error("Error converting and saving image:", error);
    return null;
  }
}
