require("dotenv").config();
import AWS from "aws-sdk";

// Create an instance of AWS.S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  region: process.env.AWS_REGION!,
  s3ForcePathStyle: true,
  signatureVersion: "v4",
});
const bucketName = process.env.AWS_S3_BUCKET!;

// Function to upload a file to S3
export const s3Upload = async (fileBuffer: Buffer, fileName: string) => {
  console.log("bucket:", bucketName);
  // Set up the parameters for the S3 upload
  const params: AWS.S3.PutObjectRequest = {
    Bucket: bucketName,
    Key: `images/${fileName}`, // Constructing the file key
    Body: fileBuffer,
    ContentType: "image/jpeg",
  };

  try {
    // Upload the file to S3
    const response = await s3.upload(params).promise();

    return {
      url: response.Location,
    };
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    throw new Error("Failed to upload file to S3");
  }
};
