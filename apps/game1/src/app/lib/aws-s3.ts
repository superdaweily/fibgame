require("dotenv").config();
import AWS from "aws-sdk";

// Create an instance of AWS.S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  region: process.env.AWS_REGION!,
  s3ForcePathStyle: true,
  // endpoint: "https://s3.amazonaws.com",
  signatureVersion: "v4",
});
const bucketName = process.env.AWS_S3_BUCKET!;

// Function to fetch user assets from S3
export const fetchUserAssetFromS3 = async (fileName: string) => {
  const key = `images/${fileName}`; // Assuming the image is stored in the "images/" directory

  try {
    // Generate a presigned URL for the image
    const url = await s3.getSignedUrlPromise("getObject", {
      Bucket: bucketName,
      Key: key,
      Expires: 3600, // URL expires in 1 hour, adjust as needed
    });

    return {
      url: url, // Presigned URL
    };
  } catch (error) {
    console.error("Error fetching the asset from S3:", error);
    throw new Error("Failed to fetch the asset");
  }
};
// Function to upload a file to S3
export const s3Upload = async (imageData: Buffer, fileName: string) => {
  // Set up the parameters for the S3 upload
  const params: AWS.S3.PutObjectRequest = {
    Bucket: bucketName,
    Key: `images/${fileName}`, // Constructing the file key
    Body: imageData,
    ContentType: "image/jpeg",
  };

  try {
    // Upload the file to S3
    const response = await s3.upload(params).promise();

    return {
      url: response.Location, // URL of the uploaded file
    };
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    throw new Error("Failed to upload file to S3");
  }
};
