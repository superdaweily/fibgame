import {
  FrameRequest,
  getFrameHtmlResponse,
  getFrameMessage,
} from "@coinbase/onchainkit/frame";

import { NextResponse } from "next/server";
import { generateImage } from "../lib/generate-image";
import { generateFinalPrompt } from "../lib/generate-prompt";
import { saveImage } from "../lib/save-image";

export async function getResponse(
  body: FrameRequest,
  questions: string[],
  finalThumbnailText: string,
  questionNum: number,
  questionIndex: number,
  searchParams: any,
  prompt: string
): Promise<NextResponse> {
  const allowFramegear = process.env.NODE_ENV !== "production";
  const { message } = await getFrameMessage(body, {
    allowFramegear,
  });
  const index: number = searchParams.has("questionIndex")
    ? Number(searchParams.get("questionIndex"))
    : 0;
  const num = searchParams.has("questionNum")
    ? Number(searchParams.get("questionNum"))
    : 0;
  const imageUrl = searchParams.has("imgUrl") ? searchParams.get("imgUrl") : "";
  if (questionIndex == 0 && !searchParams.get("questionIndex")) {
    return new NextResponse(
      getFrameHtmlResponse({
        buttons: [
          {
            label: `Next`,
            action: "post",
          },
        ],
        input: { text: "Write your option" },
        image: {
          src: `${process.env.SITE_URL}/og?title=${questions[questionIndex]}`,
        },
        postUrl: `${
          process.env.SITE_URL
        }/api/generate?title=${questions[questionIndex]}&questionIndex=${questionIndex + 1}&questionNum=${questionNum}`,
        state: {},
      })
    );
  } else if (index < num) {
    const data: any = {
      buttons: [
        {
          label: `Next`,
          action: "post",
        },
      ],
      input: { text: "Write your option" },
      image: {
        src: `${process.env.SITE_URL}/og?title=${questions[index]}`,
      },
      postUrl: `${
        process.env.SITE_URL
      }/api/generate?title=${questions[index]}&questionIndex=${index + 1}&questionNum=${num}`,
      state: {},
    };

    if (index > 1) {
      data.state = JSON.parse(decodeURIComponent(message?.state.serialized!));
    }
    data.state[index] = message?.input;
    return new NextResponse(getFrameHtmlResponse(data));
  } else if (index == num) {
    const title = "Ready to make a story!";
    const data: any = {
      buttons: [
        {
          label: `Generate image`,
          action: "post",
        },
      ],
      image: {
        src: `${process.env.SITE_URL}/og?title=${encodeURI(title)}`,
      },
      postUrl: `${
        process.env.SITE_URL
      }/api/generate?questionIndex=${index + 1}&questionNum=${num}`,
      state: {},
    };
    data.state = JSON.parse(decodeURIComponent(message?.state.serialized!));
    data.state[index] = message?.input;
    return new NextResponse(getFrameHtmlResponse(data));
  } else if (index == num + 1) {
    // generate image
    const keys = JSON.parse(decodeURIComponent(message?.state.serialized!));
    const finalPrompt = await generateFinalPrompt(prompt, keys);
    const fal_res = await generateImage(finalPrompt);
    if (fal_res.msg == "Success") {
      return new NextResponse(
        getFrameHtmlResponse({
          buttons: [
            {
              label: `Save image`,
              action: "post",
            },
          ],
          image: {
            src: `${fal_res.imageUrl}`,
            aspectRatio: "1:1",
          },
          postUrl: `${process.env.SITE_URL}/api/generate?questionIndex=${index + 1}&questionNum=${num}`,
          state: {
            imgUrl: fal_res.imageUrl,
          },
        })
      );
    } else {
      return new NextResponse(JSON.stringify({ error: "Unexpected error" }), {
        status: 500,
      });
    }
  } else if (index == num + 2) {
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
              target: `https://warpcast.com/~/compose?text=${placeholder}&embeds[]=${imageUrl}`,
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
  } else {
    return new NextResponse(JSON.stringify({ error: "Unexpected error" }), {
      status: 500,
    });
  }
}
