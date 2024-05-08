import { getFrameMetadata } from "@coinbase/onchainkit/frame";
import { Metadata } from "next";

const frameMetadata = getFrameMetadata({
  buttons: [
    {
      action: "post",
      label: "Play FIB",
    },
  ],
  image: `${process.env.SITE_URL}/thumbnail.png`,
  postUrl: `${process.env.SITE_URL}/api/generate`,
});

export const metadata: Metadata = {
  manifest: "/manifest.json",
  openGraph: {
    title: "FIB - fill in the basket!",
    description: "LFG",
    images: [`${process.env.SITE_URL}/thumbnail.png`],
  },
  other: {
    ...frameMetadata,
  },
};

export default function Home() {
  return (
    <div className="h-screen flex justify-center items-center bg-black rounded-sm">
      <img className="rounded-lg" src="/thumbnail.png" alt="" />
    </div>
  );
}
