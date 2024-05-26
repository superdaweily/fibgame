import {
  FrameRequest,
  getFrameHtmlResponse,
  getFrameMessage,
} from "@coinbase/onchainkit/frame";

import { NextResponse } from "next/server";
import { generateImage } from "../lib/generate-image";
import { saveImage } from "../lib/save-image";
import { generateFinalPrompt } from "../lib/generate-prompt";
import { addCast } from "../lib/add-cast";

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
  const { isValid, message } = await getFrameMessage(body, {
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
    console.log(finalPrompt);
    const fal_res = await generateImage(finalPrompt);
    if (fal_res.msg == "Success") {
      return new NextResponse(
        getFrameHtmlResponse({
          buttons: [
            {
              label: `Save`,
            },
          ],
          image: {
            src: `${fal_res.imageUrl}`,
            aspectRatio: "1:1",
          },
          postUrl: `${
            process.env.SITE_URL
          }/api/generate?questionIndex=${index + 1}&questionNum=${num}`,
          state: {
            imgUrl: fal_res.imageUrl,
          },
        })
      );
    } else if (!fal_res?.imageUrl) {
      return new NextResponse(JSON.stringify({ error: "Server error" }), {
        status: 500,
      });
    } else {
      return new NextResponse(JSON.stringify({ error: "Unexpected error" }), {
        status: 500,
      });
    }
  } else if (index == num + 2) {
    // save image step
    const state = JSON.parse(decodeURIComponent(message?.state.serialized!));
    const imgUrl = state.imgUrl;
    const fid = message?.interactor.fid;
    const res_pinna: any = await saveImage(imgUrl, fid);
    if (res_pinna.msg == "Success") {
      return new NextResponse(
        getFrameHtmlResponse({
          buttons: [
            {
              label: `Share on Warpcast`,
            },
          ],
          image: {
            src: `${process.env.SITE_URL}/og?title=${finalThumbnailText}`,
          },
          postUrl: `${
            process.env.SITE_URL
          }/api/generate?title=${finalThumbnailText}&questionIndex=${index + 1}&questionNum=${num}&imgUrl=${encodeURI(imgUrl)}`,
          state: {
            msg: message?.input,
            imgUrl: imgUrl,
          },
        })
      );
    } else {
      return new NextResponse(JSON.stringify({ error: "Sever error" }), {
        status: 500,
      });
    }
  } else if (index == num + 3) {
    return new NextResponse(
      getFrameHtmlResponse({
        buttons: [
          {
            label: `Cast`,
            target: "https://warpcast.com/~/compose?text=Hello%20world!",
          },
        ],
        input: { text: "Write a notes." },
        image: {
          src: imageUrl,
        },
        state: {
          msg: message?.input,
        },
      })
    );
  } else if (index == num + 4) {
    const state = JSON.parse(decodeURIComponent(message?.state.serialized!));
    const imgUrl = state.imgUrl;
    const msg = state.msg;
    const fid: number = message?.interactor.fid!;
    console.log("fid", fid);
    //share on warpcast
    addCast();

    // const options = {
    //   method: "POST",
    //   headers: {
    //     Authorization: `Bearer ${process.env.PINATA_API_KEY}`,
    //     "Content-Type": "application/json",
    //   },
    //   body: `{"castAddBody":{"text":"${msg}","parentUrl":${process.env.PARENT_URL},"embeds":[{"url":"<string>","castId":{"fid":123,"hash":"<string>"}}],,"mentions":[123],"mentionsPositions":[],"parentCastId":{"fid":${process.env.FID}}},"signerId":${process.env.PRIVATE_KEY}}`,
    // };

    // fetch("https://api.pinata.cloud/v3/farcaster/casts", options)
    //   .then((response) => response.json())
    //   .then((response) => console.log(response))
    //   .catch((err) => console.error(err));

    const title = "Thanks for your cast!";
    const data: any = {
      image: {
        src: `${process.env.SITE_URL}/og?title=${encodeURI(title)}`,
      },
      state: {},
    };
    return new NextResponse(getFrameHtmlResponse(data));
  } else {
    return new NextResponse(JSON.stringify({ error: "Unexpected error" }), {
      status: 500,
    });
  }
}
