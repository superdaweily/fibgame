import * as fal from "@fal-ai/serverless-client";

fal.config({
  credentials: process.env.FAL_API_KEY,
});

export const generateImage = async (prompt: string) => {
  try {
    const result = (await fal.subscribe("fal-ai/stable-cascade", {
      input: {
        prompt,
        first_stage_steps: "30",
        second_stage_steps: "10",
        guidance_scale: "9",
        sync_mode: true,
        image_size: "square_hd",
        image_type: "image/jpg",
      },
    })) as any;

    if (result.images && result.images.length > 0) {
      const image = result.images[0].url;

      return { imageUrl: image, msg: "Success" };
    } else {
      // No image generated
      return { imageUrl: "", msg: "No image generated" };
    }
  } catch (error) {
    console.error("Error generating image:", error);
    // Server error
    return { imageUrl: "", msg: "Server error!" };
  }
};
