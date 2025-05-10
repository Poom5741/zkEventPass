// lib/pod/createPodTicket.ts

import { POD, PODEntries } from "@pcd/pod";
import { ISuccessResult } from "@worldcoin/idkit";
import { v4 as uuid } from "uuid";

// browser‐safe 32-byte random hex
function randomHex32(): string {
  const buf = new Uint8Array(32);
  crypto.getRandomValues(buf);
  return Array.from(buf)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Build & sign a ticket POD that embeds the World ID proof.
 */
export function createPodTicket(
  fields: {
    eventId: string;
    eventName: string;
    attendeeName: string;
    attendeeEmail: string;
    walletAddress?: string;
  },
  worldProof: ISuccessResult,
  signingKeyHex?: string
): string {
  const key = signingKeyHex?.trim() || randomHex32();

  const entries: PODEntries = {
    ticket_id: { type: "string", value: uuid() },
    event_id: { type: "string", value: fields.eventId },
    event_name: { type: "string", value: fields.eventName },
    attendee_name: { type: "string", value: fields.attendeeName },
    attendee_email: { type: "string", value: fields.attendeeEmail },
    wallet_address: { type: "string", value: fields.walletAddress || "" },

    // embed World ID proof
    world_nullifier: { type: "string", value: worldProof.nullifier_hash },
    world_root: { type: "string", value: worldProof.merkle_root },
    world_proof: { type: "string", value: JSON.stringify(worldProof.proof) },

    issued_at: { type: "date", value: new Date() },
    pod_type: { type: "string", value: "zk.ticket.v1" },
  };

  const pod = POD.sign(entries, key);
  return JSON.stringify(pod.toJSON());
}
