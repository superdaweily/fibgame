import Jimp from "jimp";
import fetch from "node-fetch";
import fs from "fs";

export const convertAndSaveImage = async (imageUrl: string) => {
  try {
    // Fetch the image from the provided URL
    const response = await fetch(imageUrl);
    const imageData = await response.buffer();

    // Convert the fetched image data from JPEG to JPG format using Jimp
    const image = await Jimp.read(imageData);
    const outputPath = `./public/images/${Date.now()}.jpg`;

    // Save the converted JPG image data to the backend (Next.js public directory)
    await image.writeAsync(outputPath);

    // Return the URL of the saved JPG image
    return { url: `${process.env.BASE_SITE_URL}/${outputPath}` };
  } catch (error) {
    console.error("Error converting and saving image:", error);
    return null;
  }
};
