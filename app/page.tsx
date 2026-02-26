// app/page.tsx
import React from "react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div
      style={{
        maxWidth: 640,
        margin: "40px auto",
        padding: 24,
        borderRadius: 16,
        border: "1px solid rgba(148,163,184,0.4)",
        background:
          "radial-gradient(circle at top, rgba(59,130,246,0.25), transparent 55%), rgba(15,23,42,0.95)",
        boxShadow: "0 18px 45px rgba(15,23,42,0.9)",
      }}
    >
      <h1
        style={{
          fontSize: 26,
          marginBottom: 8,
          letterSpacing: 0.04,
        }}
      >
        Prime Forge · Operator Console
      </h1>
      <p
        style={{
          fontSize: 14,
          color: "#9ca3af",
          marginBottom: 20,
        }}
      >
        This is the control surface for Elaira, Prime Forge / AI7, and the
        swarm. Continue to the live dashboard.
      </p>
      <Link
        href="/dashboard"
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "10px 18px",
          borderRadius: 999,
          background:
            "linear-gradient(135deg, #22c55e, #0ea5e9, #a855f7, #22c55e)",
          color: "#020617",
          fontWeight: 600,
          fontSize: 14,
          textDecoration: "none",
        }}
      >
        Open Dashboard
      </Link>
    </div>
  );
}
