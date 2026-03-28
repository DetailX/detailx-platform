import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const isMockS3 = process.env.MOCK_S3 === "true";

const s3Client = isMockS3
  ? null
  : new S3Client({
      region: process.env.AWS_REGION!,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });

const BUCKET = process.env.S3_BUCKET_NAME || "platform-details";

export async function getUploadUrl(
  key: string,
  contentType: string
): Promise<string> {
  if (isMockS3) {
    return `/api/mock-upload?key=${encodeURIComponent(key)}`;
  }

  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    ContentType: contentType,
  });

  return getSignedUrl(s3Client!, command, { expiresIn: 900 }); // 15 minutes
}

export async function getDownloadUrl(key: string): Promise<string> {
  if (isMockS3) {
    // In mock mode, return the local preview path or a placeholder
    if (key.startsWith("/mock/")) return key;
    return "/mock/placeholder-detail.pdf";
  }

  const command = new GetObjectCommand({
    Bucket: BUCKET,
    Key: key,
  });

  return getSignedUrl(s3Client!, command, { expiresIn: 3600 }); // 1 hour
}

export function getPublicUrl(key: string): string {
  if (isMockS3 || key.startsWith("/mock/")) {
    return key;
  }
  return `https://${BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
}
