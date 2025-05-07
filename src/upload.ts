import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// AWS S3 config
const REGION = "us-east-1"; // Change to your AWS region
const BUCKET_NAME = 'example-bucket';
const OBJECT_KEY = "example-data.json"; // S3 key (file name)

// Sample JSON object
const data = {
  userId: 123,
  name: "Susan",
  active: true,
};

async function uploadJsonToS3() {
  const s3 = new S3Client({ region: REGION });

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: OBJECT_KEY,
    Body: JSON.stringify(data, null, 2),
    ContentType: "application/json",
  });

  try {
    const response = await s3.send(command);
    console.log(`✅ JSON uploaded successfully as '${OBJECT_KEY}'`);
    console.log(response);
  } catch (err) {
    console.error("❌ Error uploading JSON:", err);
  }
}

uploadJsonToS3();