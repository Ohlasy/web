import type { Readable } from "node:stream";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const accessKeyId = process.env.S3_ACCESS_KEY ?? "";
const secretAccessKey = process.env.S3_SECRET_KEY ?? "";

export type S3UploadProps = {
  bucket: "ohlasy-images";
  body: string | Uint8Array | Buffer | Readable;
  key: string;
  contentType: string;
  acl: "public-read";
};

const s3client = new S3Client({
  region: "nbg1",
  endpoint: "https://nbg1.your-objectstorage.com",
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

export const uploadFileToS3 = async (p: S3UploadProps) => {
  await s3client.send(
    new PutObjectCommand({
      Bucket: p.bucket,
      Key: p.key,
      Body: p.body,
      ContentType: p.contentType,
      ACL: p.acl,
    }),
  );
};
