// lib/pod/verifyPodTicket.ts

import { POD, JSONPOD } from "@pcd/pod";

/**
 * Returns true if the POD JSON string has a valid signature.
 */
export function verifyPodTicket(input: string): boolean {
  let json: JSONPOD;
  try {
    json = JSON.parse(input);
  } catch {
    throw new Error("Invalid JSON—please paste the exact POD string.");
  }
  const pod = POD.fromJSON(json);
  return pod.verifySignature();
}
