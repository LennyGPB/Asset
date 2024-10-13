import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import type { ObjectCannedACL } from "@aws-sdk/client-s3";


const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const bucketName = process.env.AWS_BUCKET_NAME;

if (!accessKeyId || !secretAccessKey || !bucketName) {
  throw new Error(
    "Les clés AWS ou le nom du bucket sont manquants dans les variables d'environnement."
  );
}

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
  },
});

interface File {
  originalname: string;
  buffer: Buffer;
  mimetype: string;
}

export const uploadFile = async (file: File) => {
  const params = {
    Bucket: bucketName,
    Key: `${Date.now()}-${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: "public-read" as ObjectCannedACL, // Utiliser le type correct pour ACL
  };

  try {
    const command = new PutObjectCommand(params);
    const data = await s3.send(command);
    const fileUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;
    console.log(`File uploaded successfully at ${fileUrl}`);
    return fileUrl;
  } catch (err) {
    console.error("Error uploading file: ", err);
    throw err;
  }
};
