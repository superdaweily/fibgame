import sharp from "sharp";
// import fetch from 'node-fetch';
import fs from "fs";

export const convertAndSaveImage = async (imageUrl: string) => {
  try {
    // Fetch the image from the provided URL
    const response = await fetch(imageUrl);
    const imageData = await response.arrayBuffer();

    // Convert the fetched image data from JPEG to JPG format using Sharp
    const jpgData = await sharp(Buffer.from(imageData)).jpeg().toBuffer();

    // Save the converted JPG image data to the backend (Next.js public directory)
    const outputPath = `./public/images/${Date.now()}.jpg`;
    fs.writeFileSync(outputPath, jpgData);

    // Return the URL of the saved JPG image
    return { url: `${process.env.NEXT_PUBLIC_SITE_URL}/${outputPath}` };
  } catch (error) {
    console.error("Error converting and saving image:", error);
    return null;
  }
};
