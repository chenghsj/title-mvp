import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  S3Client,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY!,
  },
});

export async function getDownloadUrl(objectName: string) {
  return getSignedUrl(
    s3Client,
    new GetObjectCommand({
      Bucket: process.env.CLOUDFLARE_BUCKET_NAME,
      Key: objectName,
    }),
    { expiresIn: 3600 }
  );
}

export async function uploadFileToBucket(file: File, filename: string) {
  const Key = filename;
  const Bucket = process.env.CLOUDFLARE_BUCKET_NAME;

  let res;

  try {
    const parallelUploads = new Upload({
      client: s3Client,
      params: {
        Bucket,
        Key,
        Body: file.stream(),
        ACL: 'public-read',
        ContentType: file.type,
      },
      queueSize: 4,
      leavePartsOnError: false,
    });

    res = await parallelUploads.done();
  } catch (e) {
    throw e;
  }

  return res;
}

export async function deleteFileFromBucket(filename: string) {
  const Key = filename;
  const Bucket = process.env.CLOUDFLARE_BUCKET_NAME;

  try {
    const command = new DeleteObjectCommand({
      Bucket,
      Key,
    });
    await s3Client.send(command);
    console.log(`File ${filename} deleted successfully.`);
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
}

export async function deleteDirectoryFromBucket(directory: string) {
  const Bucket = process.env.CLOUDFLARE_BUCKET_NAME;
  const Prefix = directory.endsWith('/') ? directory : `${directory}/`;

  try {
    // List all objects in the directory
    const listCommand = new ListObjectsV2Command({
      Bucket,
      Prefix,
    });
    const listResponse = await s3Client.send(listCommand);

    if (!listResponse.Contents || listResponse.Contents.length === 0) {
      console.log(`No objects found in directory ${directory}`);
      return;
    }

    // Prepare objects for deletion
    const objectsToDelete = listResponse.Contents.map((item) => ({
      Key: item.Key,
    }));

    // Delete the objects
    const deleteCommand = new DeleteObjectsCommand({
      Bucket,
      Delete: {
        Objects: objectsToDelete,
      },
    });
    await s3Client.send(deleteCommand);
    console.log(`Directory ${directory} deleted successfully.`);
  } catch (error) {
    console.error('Error deleting directory:', error);
    throw error;
  }
}

export async function getPresignedPostUrl(
  objectName: string,
  contentType: string
) {
  return await createPresignedPost(s3Client, {
    Bucket: process.env.CLOUDFLARE_BUCKET_NAME!,
    Key: objectName,
    // Conditions: [
    //   ["content-length-range", 0, 1024 * 1024 * 2],
    //   ["starts-with", "$Content-Type", contentType],
    // ],
    Expires: 600, // 10 minutes
    // Fields: {
    //   // acl: "public-read",
    //   "Content-Type": contentType,
    // },
  });
}

export async function getFileUrl({ key }: { key: string }) {
  const url = await getSignedUrl(
    s3Client,
    new GetObjectCommand({
      Bucket: process.env.CLOUDFLARE_BUCKET_NAME,
      Key: key,
    }),
    { expiresIn: 3600 }
  );
  return url;
}
