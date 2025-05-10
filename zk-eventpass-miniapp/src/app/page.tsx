// src/app/page.tsx
"use client";

import { useState } from "react";
import { MiniKit } from "@worldcoin/minikit-js";
import { IDKitWidget, ISuccessResult } from "@worldcoin/idkit";
import { createPodTicket } from "../../lib/pod/createPodTicket";
import { QRCodeCanvas } from "qrcode.react";

export default function IssuePage() {
  const [fields, setFields] = useState({
    eventId: "",
    eventName: "",
    attendeeName: "",
    attendeeEmail: "",
  });
  const [worldProof, setWorldProof] = useState<ISuccessResult | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [podJson, setPodJson] = useState("");

  // 3.1: Wallet connect handler
  const handleConnectWallet = async () => {
    if (!MiniKit.isInstalled()) {
      alert("Please open in the World App to connect your wallet.");
      return;
    }
    try {
      const addr = await MiniKit.walletAuth();
      setWalletAddress(addr);
    } catch (e: any) {
      console.error("Wallet auth failed:", e);
      alert("Wallet connection failed.");
    }
  };

  // 3.2: Generate POD including wallet_address
  const handleGenerate = () => {
    if (!worldProof) {
      alert("Please verify with World ID first!");
      return;
    }
    if (!walletAddress) {
      alert("Please connect your wallet first!");
      return;
    }

    // include walletAddress in the fields object so createPodTicket can embed it
    const pod = createPodTicket({ ...fields, walletAddress }, worldProof);
    setPodJson(pod);
  };

  return (
    <main style={{ padding: 24, maxWidth: 600, margin: "auto" }}>
      <h1>Issue ZK Ticket POD</h1>

      {/* Ticket fields */}
      {(["eventId", "eventName", "attendeeName", "attendeeEmail"] as const).map(
        (key) => (
          <input
            key={key}
            placeholder={key.replace(/([A-Z])/g, " $1").trim()}
            value={(fields as any)[key]}
            onChange={(e) => setFields({ ...fields, [key]: e.target.value })}
            style={{ width: "100%", marginBottom: 8, padding: 8 }}
          />
        )
      )}

      {/* World ID Verify button */}
      <IDKitWidget
        app_id={process.env.NEXT_PUBLIC_WORLDCOIN_APP_ID!}
        action="issue_ticket"
        signal={fields.attendeeEmail}
        onSuccess={(res: ISuccessResult) => setWorldProof(res)}
      >
        {({ open }: { open: () => void }) => (
          <button
            onClick={open}
            style={{
              padding: "10px 20px",
              background: worldProof ? "#4caf50" : "#222",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              marginRight: 12,
            }}
          >
            {worldProof ? "✅ World ID Verified" : "Verify with World ID"}
          </button>
        )}
      </IDKitWidget>

      {/* Wallet Connect button */}
      <button
        onClick={handleConnectWallet}
        style={{
          padding: "10px 20px",
          background: walletAddress ? "#4caf50" : "#222",
          color: "#fff",
          border: "none",
          borderRadius: 4,
        }}
      >
        {walletAddress
          ? `🔗 ${walletAddress.slice(0, 6)}…${walletAddress.slice(-4)}`
          : "Connect Wallet"}
      </button>

      {/* Generate POD */}
      <div style={{ marginTop: 24 }}>
        <button
          onClick={handleGenerate}
          style={{
            padding: "10px 20px",
            backgroundColor: "#0066ff",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          Generate & Sign POD
        </button>
      </div>

      {/* Output & QR */}
      {podJson && (
        <>
          <h2>Serialized POD</h2>
          <textarea
            readOnly
            rows={4}
            style={{
              width: "100%",
              fontFamily: "monospace",
              padding: 8,
              marginTop: 12,
            }}
            value={podJson}
          />

          <h2>QR Code</h2>
          <QRCodeCanvas value={podJson} size={256} />
        </>
      )}
    </main>
  );
}
