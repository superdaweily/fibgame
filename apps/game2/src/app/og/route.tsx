import { ImageResponse } from "next/og";
import { ImageResponseComponent } from "@repo/ui/image-response";
import config from "@/app/lib/config.json";
export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  try {
    const title = searchParams.has("title")
      ? searchParams.get("title")?.slice(0, 100)
      : "Default Title";

    const description = searchParams.has("description")
      ? searchParams.get("description")?.slice(0, 100)
      : "";
    return new ImageResponse(
      (
        <ImageResponseComponent
          title={title}
          description={description}
          style={config.style}
        />
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
