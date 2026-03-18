import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  ListBucketsCommand,
  PutBucketCorsCommand,
  ListObjectsV2Command,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Config S3
const s3Client = new S3Client({
  region: process.env.REGION!,
  endpoint: process.env.S3_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID!,
    secretAccessKey: process.env.SECRET_ACCESS_KEY!,
  },
  forcePathStyle: true,
});

export const setBucketCORS = async ({
  allowedOrigins,
}: {
  allowedOrigins: string[];
}) => {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME!,
    CORSConfiguration: {
      CORSRules: [
        {
          AllowedOrigins: allowedOrigins, // Allowed origins
          AllowedMethods: ["GET", "HEAD", "PUT", "POST", "DELETE"], // Allowed HTTP methods
          AllowedHeaders: ["*"], // Allow all headers
          ExposeHeaders: ["ETag"], // Header can be accessed
          MaxAgeSeconds: 3000, // Cache for CORS preflight response
        },
      ],
    },
  };

  try {
    const command = new PutBucketCorsCommand(params);
    await s3Client.send(command);
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

// Generate signed URL for upload
export const getSignedUrlForUpload = async (
  key: string,
  contentType: string,
): Promise<string> => {
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: key,
    ContentType: contentType,
    ACL: "public-read",
  });

  return await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // Expires in 1 hour
};

// Generate signed URL for download
export const getSignedUrlForAccess = async (key: string): Promise<string> => {
  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: key,
  });

  return await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // Expires in 1 hour
};

export const listBuckets = async () => {
  try {
    const command = new ListBucketsCommand({});
    const response = await s3Client.send(command);
    return response.Buckets || [];
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const listPrefixs = async ({ bucket }: { bucket: string }) => {
  try {
    const command = new ListObjectsV2Command({
      Bucket: bucket,
      Delimiter: "/",
    });

    const { CommonPrefixes } = await s3Client.send(command);
    const prefixes = CommonPrefixes?.map((item) => item.Prefix) || [];

    return prefixes;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const listPrefixFiles = async ({
  bucket,
  prefix,
}: {
  bucket: string;
  prefix: string;
}) => {
  try {
    const files: { name: string; path: string }[] = [];

    // Pagination untuk handle >1000 files
    let ContinuationToken: string | undefined;
    let isTruncated = true;

    while (isTruncated) {
      const command = new ListObjectsV2Command({
        Bucket: bucket,
        Prefix: prefix + "/", // Filter hanya files di folder audio/
        Delimiter: "/", // Hindari subfolder
        ContinuationToken,
        MaxKeys: 1000,
      });

      const response = await s3Client.send(command);

      // Ambil semua file objects (bukan folder)
      if (response.Contents) {
        const audioFiles = response.Contents.filter(
          (obj) => obj.Key && !obj.Key.endsWith("/"),
        ) // Exclude folders
          .map((obj) => ({
            name: obj.Key!.split("/").pop()!, // Nama file saja
            path: obj.Key!, // Path lengkap
            size: obj.Size || 0,
            lastModified: obj.LastModified,
          }));

        files.push(...audioFiles);
      }

      // Pagination
      isTruncated = !!response.IsTruncated;
      ContinuationToken = response.NextContinuationToken;
    }

    return files;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export async function deleteObject(key: string) {
  try {
    const command = new DeleteObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: key,
    });

    await s3Client.send(command);
  } catch (error) {
    throw new Error((error as Error).message);
  }
}
