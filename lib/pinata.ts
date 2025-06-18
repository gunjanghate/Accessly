import axios from "axios";

const PINATA_API_KEY = process.env.NEXT_PUBLIC_PINATA_API_KEY!;
const PINATA_SECRET_API_KEY = process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY!;

const PINATA_BASE_URL = "https://api.pinata.cloud/pinning";

export async function uploadMetadataToPinata(metadata: object) {
  try {
    const response = await axios.post(`${PINATA_BASE_URL}/pinJSONToIPFS`, metadata, {
      headers: {
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_API_KEY,
        'Content-Type': 'application/json',
      },
    });

    const ipfsHash = response.data.IpfsHash;
    return `ipfs://${ipfsHash}`;
  } catch (error) {
    console.error("❌ Pinata upload failed:", error);
    throw new Error("Failed to upload metadata to Pinata.");
  }
}

export async function uploadFileToPinata(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT_ACCESS_TOKEN}`, // safer with JWT
    },
    body: formData,
  });

  if (!res.ok) throw new Error("Image upload failed");

  const json = await res.json();
  return `ipfs://${json.IpfsHash}`;
}
