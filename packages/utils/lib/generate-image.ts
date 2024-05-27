import * as fal from "@fal-ai/serverless-client";

fal.config({
  credentials: process.env.FAL_API_KEY,
});

export const generateImage = async (prompt: string) => {
  try {
    const result = (await fal.subscribe("fal-ai/stable-cascade", {
      input: {
        model_name: "stabilityai/stable-diffusion-xl-base-1.0",
        prompt: prompt,
        loras: [],
        embeddings: [],
        controlnets: [],
        ip_adapter: [],
        image_size: "square_hd",
        num_inference_steps: 30,
        guidance_scale: 7.5,
        image_format: "png",
        num_images: 1,
        tile_width: 4096,
        tile_height: 4096,
        tile_stride_width: 2048,
        tile_stride_height: 2048,
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
