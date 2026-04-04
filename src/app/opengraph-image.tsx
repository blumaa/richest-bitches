import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Richest Bitches — Who can throw away the most money?";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#101114",
          color: "#ffffff",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ fontSize: 80, fontWeight: 700, letterSpacing: "-2px" }}>
          Richest Bitches
        </div>
        <div style={{ fontSize: 28, color: "#9497a9", marginTop: 16 }}>
          Who can throw away the most money?
        </div>
        <div
          style={{
            marginTop: 40,
            fontSize: 22,
            color: "#ffffff",
            backgroundColor: "#7132f5",
            padding: "12px 32px",
            borderRadius: 12,
            fontWeight: 600,
          }}
        >
          Claim Your Throne
        </div>
      </div>
    ),
    { ...size }
  );
}
