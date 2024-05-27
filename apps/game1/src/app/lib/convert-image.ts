import sharp from "sharp";
// import fetch from 'node-fetch';
import { join } from "path";
import fs from "fs";

export async function convertAndSaveImage(imageUrl: string) {
  try {
    const response = await fetch(imageUrl);
    const imageData = await response.arrayBuffer();
    const jpgData = await sharp(imageData).toFormat("jpeg").toBuffer();
    const outputPath = `./images/${Date.now()}.jpg`;
    fs.writeFileSync(outputPath, jpgData);
    const fullUrl = join(process.env.SITE_URL!, outputPath);
    return { url: fullUrl };
  } catch (error) {
    console.error("Error converting and saving image:", error);
    return null;
  }
}
