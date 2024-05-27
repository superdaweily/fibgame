import { NextRequest, NextResponse } from "next/server";
import {
  FrameRequest,
  getFrameHtmlResponse,
  getFrameMessage,
} from "@coinbase/onchainkit/frame";
import { saveImage } from "@repo/utils/save-image";
import { convertAndSaveImage } from "@/app/lib/convert-image";
import { finalThumbnailText } from "@/app/lib/config.json";

export async function POST(req: NextRequest) {
  const body: FrameRequest = await req.json();
  const allowFramegear = process.env.NODE_ENV !== "production";
  const { isValid, message } = await getFrameMessage(body, {
    allowFramegear,
  });
  const state = JSON.parse(decodeURIComponent(message?.state.serialized!));
  const imageUrl = state.imgUrl;
  const placeholder = "Describe something..";
  const fid = message?.interactor.fid;
  const res_pinna: any = await saveImage(imageUrl, fid);
  if (res_pinna.msg == "Success") {
    return new NextResponse(
      getFrameHtmlResponse({
        buttons: [
          {
            action: "link",
            label: `Share on Warpcast`,
            target: `https://warpcast.com/~/compose?text=${placeholder}%0A${imageUrl}`,
          },
        ],
        image: {
          src: `${process.env.SITE_URL}/og?title=${finalThumbnailText}`,
        },
      })
    );
  } else {
    return new NextResponse(JSON.stringify({ error: "Sever error" }), {
      status: 500,
    });
  }
}

export const dynamic = "force-dynamic";
