export const saveImage = async (imgUrl: string, fid: any) => {
  try {
    const body = {
      pinataContent: {
        imgUrl: imgUrl,
        fid: fid,
      },
      pinataMetadata: {
        name: "fib",
      },
      pinataOptions: {
        cidVersion: 1,
      },
    };

    const options = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PINATA_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    };

    const res = await fetch(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      options
    );
    if (res.ok) {
      // const data = await res.json();

      return { msg: "Success" };
    } else {
      return { msg: "Error" };
    }
  } catch (error: any) {
    console.error("Error generating image:", error);
    // Server error
    return { msg: "Failed" };
  }
};
