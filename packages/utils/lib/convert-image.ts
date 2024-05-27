import Jimp from "jimp";
import fetch from "node-fetch";
import fs from "fs";

export const convertAndSaveImage = async (imageUrl: string) => {
  try {
    // Fetch the image from the provided URL
    const response = await fetch(imageUrl);
    const imageBuffer = await response.buffer();

    // Load the image using Jimp
    const image = await Jimp.read(imageBuffer);

    // Convert the image to JPEG format
    const jpgImage = await image.quality(100).getBufferAsync(Jimp.MIME_JPEG);

    // Save the converted JPEG image data to the backend (Next.js public directory)
    const outputPath = `./public/images/${Date.now()}.jpg`;
    fs.writeFileSync(outputPath, jpgImage);

    // Return the URL of the saved JPEG image
    return {
      url: `${process.env.SITE_URL}/${outputPath.replace("./public/", "")}`,
    };
  } catch (error) {
    console.error("Error converting and saving image:", error);
    return null;
  }
};
