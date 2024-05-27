require("dotenv").config();
import AWS from "aws-sdk";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  region: process.env.AWS_REGION!,
  s3ForcePathStyle: true,
  signatureVersion: "v4",
});
const bucketName = process.env.AWS_S3_BUCKET!;

export const s3Upload = async (fileBuffer: Buffer, fileName: string) => {
  console.log("Bucket:", bucketName);
  const params: AWS.S3.PutObjectRequest = {
    Bucket: bucketName,
    Key: `images/${fileName}`,
    Body: fileBuffer,
    ContentType: "image/jpeg",
  };

  try {
    const response = await s3.upload(params).promise();

    return {
      url: response.Location,
    };
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    throw new Error("Failed to upload file to S3");
  }
};
