// app/layout.tsx
import React from "react";
import "./globals.css";

export const metadata = {
  title: "Prime Forge Control",
  description: "Elaira + Prime Forge AI7 dashboard",
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
          background: "#050816",
          color: "#f9fafb",
        }}
      >
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <header
            style={{
              padding: "12px 20px",
              borderBottom: "1px solid rgba(148, 163, 184, 0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background:
                "radial-gradient(circle at top left, #1d4ed8 0, transparent 55%), #020617",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "999px",
                  background:
                    "conic-gradient(from 180deg, #22c55e, #0ea5e9, #a855f7, #22c55e)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#020617",
                }}
              >
                PF
              </div>
              <div>
                <div style={{ fontWeight: 600, letterSpacing: 0.04 }}>
                  Prime Forge Control
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "#9ca3af",
                  }}
                >
                  Elaira · AI7 · Swarm
                </div>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                gap: 10,
                alignItems: "center",
                fontSize: 12,
              }}
            >
              <span
                style={{
                  padding: "4px 10px",
                  borderRadius: 999,
                  border: "1px solid rgba(34,197,94,0.5)",
                  background: "rgba(22,163,74,0.15)",
                  color: "#bbf7d0",
                }}
              >
                V3 · Stable
              </span>
              <span
                style={{
                  padding: "4px 10px",
                  borderRadius: 999,
                  border: "1px solid rgba(59,130,246,0.5)",
                  background: "rgba(37,99,235,0.15)",
                  color: "#bfdbfe",
                }}
              >
                V4 · External
              </span>
            </div>
          </header>
          <main
            style={{
              flex: 1,
              padding: "16px 20px 24px",
            }}
          >
            {props.children}
          </main>
        </div>
      </body>
    </html>
  );
}
