import dynamic from "next/dynamic";

const WorldIDWidget = dynamic(
  () => import("@worldcoin/id").then((m) => m.WorldIDWidget),
  { ssr: false }
);

export default function Home() {
  return (
    <main
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <WorldIDWidget
        actionId="[YOUR_ACTION_ID]"
        signal="zk-eventpass"
        enableTelemetry
        onSuccess={async (proof) => {
          console.log("✅ World ID Proof", proof);
          const response = await fetch("/api/submit-proof", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ proof }),
          });

          const result = await response.json();
          console.log("🎟️ Credential issued result:", result);
        }}
        onError={(err) => console.error("❌ Error", err)}
      />
    </main>
  );
}
