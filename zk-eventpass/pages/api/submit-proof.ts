import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { proof } = req.body;

  console.log("📨 Received World ID proof:", proof);

  // For now, simulate sending to Zupass Issuer (can be a curl call or local API)
  // Later: You’ll call Zupass Issuer logic to mint a credential

  return res.status(200).json({
    status: "ok",
    message: "Proof received. Minting credential soon...",
    received: proof,
  });
}
