import 'dotenv/config';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { Readable } from 'stream';

// AWS S3 config
const REGION = process.env.AWS_REGION;
const BUCKET_NAME = process.env.BUCKET_NAME;
const OBJECT_KEY = 'example-data.json';

const data = {
  time: `${new Date().toLocaleString()}`,
};

const s3 = new S3Client({ region: REGION });

async function uploadJsonToS3() {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: OBJECT_KEY,
    Body: JSON.stringify(data, null, 2),
    ContentType: 'application/json',
  });

  try {
    const response = await s3.send(command);
    console.log(`✅ JSON uploaded successfully as '${OBJECT_KEY}'`);
    console.log(response);
  } catch (err) {
    console.error('❌ Error uploading JSON:', err);
  }
}

async function readJsonFromS3() {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: OBJECT_KEY,
  });

  try {
    const response = await s3.send(command);
    console.log(`✅ JSON successfully read from '${OBJECT_KEY}'`);

    // Convert stream to json object. Note: this is not safe for files
    // over several MB as files on S3 can be large and this approach holds
    // the full file in memory
    const bodyStream = response.Body;
    if (!bodyStream) throw new Error('expected response body to be defined');
    const chunks: Uint8Array[] = [];
    for await (const chunk of bodyStream as Readable) {
      chunks.push(chunk);
    }
    const fullBuffer = Buffer.concat(chunks);
    const json = JSON.parse(fullBuffer.toString('utf-8'));

    console.log('JSON body:', JSON.stringify(json, null, 2));
  } catch (err) {
    console.error('❌ Error reading JSON:', err);
  }
}

async function main() {
  await readJsonFromS3();
  await uploadJsonToS3();
}

main();
