import config from "@/app/lib/config.json";
import { NextRequest } from "next/server";
import { FrameRequest } from "@coinbase/onchainkit/frame";
import { getResponse } from "@repo/utils/getResponse";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

const questionIndex = 0;
const questionNum = config.questions.length;
const questions = config.questions;
const finalThumbnailText = config.finalThumbnailText;
const prompt = config.prompt;
export async function POST(req: NextRequest): Promise<Response> {
  const body: FrameRequest = await req.json();
  const { searchParams } = new URL(req.url);
  return getResponse(
    body,
    questions,
    finalThumbnailText,
    questionNum,
    questionIndex,
    searchParams,
    prompt
  );
}
