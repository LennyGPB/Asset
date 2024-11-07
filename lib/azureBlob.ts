import { BlobServiceClient, StorageSharedKeyCredential, generateBlobSASQueryParameters, BlobSASPermissions } from "@azure/storage-blob";

const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME || "";
const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY || "";
const publicContainerName = process.env.AZURE_PUBLIC_CONTAINER_NAME || "";
const privateContainerName = process.env.AZURE_PRIVATE_CONTAINER_NAME || "";

// Crée une instance du client de stockage Azure avec les informations de connexion
const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);
const blobServiceClient = new BlobServiceClient(
  `https://${accountName}.blob.core.windows.net`,
  sharedKeyCredential
);

// Fonction pour téléverser un fichier dans le conteneur public
export const uploadPublicFile = async (file: { originalname: string; buffer: Buffer; mimetype: string }) => {
  const containerClient = blobServiceClient.getContainerClient(publicContainerName); // Récupère le conteneur
  const blobName = `${Date.now()}-${file.originalname}`; // Nom unique pour le fichier
  const blockBlobClient = containerClient.getBlockBlobClient(blobName); // Crée un client pour le fichier

  // Téléverse le fichier dans le conteneur
  await blockBlobClient.uploadData(file.buffer, {
    blobHTTPHeaders: { blobContentType: file.mimetype },
  });

  return blockBlobClient.url; // Retourne l'URL publique du fichier
};

// Fonction pour téléverser un fichier dans le conteneur privé
export const uploadPrivateFile = async (file: { originalname: string; buffer: Buffer; mimetype: string }) => {
  const containerClient = blobServiceClient.getContainerClient(privateContainerName);
  const blobName = `${Date.now()}-${file.originalname}`; // Nom unique pour le fichier
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  await blockBlobClient.uploadData(file.buffer, {
    blobHTTPHeaders: { blobContentType: file.mimetype },
  });

  return blockBlobClient.url; // Retourne l'URL du fichier (non accessible publiquement)
};

// Fonction pour générer une URL signée pour un fichier privé (accès temporaire)
export const generateSASUrlForPrivateFile = async (blobName: string, expiresInSeconds: number = 3600) => {
  const containerClient = blobServiceClient.getContainerClient(privateContainerName); // Récupère le conteneur
  const blobClient = containerClient.getBlobClient(blobName); // Récupère le client pour le fichier

  const sasOptions = {
    containerName: privateContainerName,
    blobName,
    permissions: BlobSASPermissions.parse("r"), // Permet seulement la lecture
    expiresOn: new Date(new Date().valueOf() + expiresInSeconds * 5), // URL valable pour une durée définie
  };

  const sasToken = generateBlobSASQueryParameters(sasOptions, sharedKeyCredential).toString();
  return `${blobClient.url}?${sasToken}`;
};
