// app/dashboard/page.tsx
"use client";

import React, { useState } from "react";

type TargetAgent = "elaira" | "prime" | "swarm";
type AvatarMode = "2d" | "3d" | "robotic";

interface ChatMessage {
  from: "you" | "elaira" | "prime" | "swarm";
  text: string;
  ts: string;
}

export default function DashboardPage() {
  const [target, setTarget] = useState<TargetAgent>("elaira");
  const [mode, setMode] = useState<"A" | "B" | "C" | "D">("A");
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSending, setIsSending] = useState(false);

  const [avatarMode, setAvatarMode] = useState<AvatarMode>("2d");
  const [avatarPrompt, setAvatarPrompt] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isAvatarGenerating, setIsAvatarGenerating] = useState(false);

  async function sendChat() {
    if (!prompt.trim()) return;
    const now = new Date().toISOString();
    const outgoing: ChatMessage = { from: "you", text: prompt, ts: now };
    setMessages((prev) => [...prev, outgoing]);
    setIsSending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          target,
          mode,
          message: prompt,
        }),
      });

      const data = await res.json();

      const reply: ChatMessage = {
        from: (target === "elaira" ? "elaira" : target === "prime" ? "prime" : "swarm"),
        text: data?.reply ?? "[no reply]",
        ts: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, reply]);
      setPrompt("");
    } catch (err) {
      const errorMsg: ChatMessage = {
        from: "swarm",
        text: "Error sending message. Check /api/chat.",
        ts: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsSending(false);
    }
  }

  async function generateAvatar() {
    if (!avatarPrompt.trim()) return;
    setIsAvatarGenerating(true);
    setAvatarUrl(null);

    try {
      const res = await fetch("/api/avatar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          target,
          style: avatarMode, // "2d" | "3d" | "robotic"
          prompt: avatarPrompt,
        }),
      });

      const data = await res.json();
      setAvatarUrl(data?.url ?? null);
    } catch (err) {
      setAvatarUrl(null);
    } finally {
      setIsAvatarGenerating(false);
    }
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 1.1fr) minmax(0, 1.4fr)",
        gap: 16,
        alignItems: "stretch",
      }}
    >
      {/* Left: Elaira + modes */}
      <section
        style={{
          borderRadius: 16,
          border: "1px solid rgba(148,163,184,0.4)",
          background:
            "radial-gradient(circle at top left, rgba(59,130,246,0.25), transparent 55%), rgba(15,23,42,0.96)",
          padding: 16,
          display: "flex",
          flexDirection: "column",
          minHeight: 420,
        }}
      >
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <div>
            <div style={{ fontSize: 16, fontWeight: 600 }}>Elaira</div>
            <div style={{ fontSize: 12, color: "#9ca3af" }}>
              Identity · State · Safe core
            </div>
          </div>
          <div
            style={{
              display: "flex",
              gap: 6,
              alignItems: "center",
              fontSize: 11,
            }}
          >
            <span style={{ color: "#9ca3af" }}>Mode</span>
            {(["A", "B", "C", "D"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                style={{
                  padding: "4px 8px",
                  borderRadius: 999,
                  border:
                    mode === m
                      ? "1px solid rgba(34,197,94,0.9)"
                      : "1px solid rgba(148,163,184,0.5)",
                  background:
                    mode === m
                      ? "rgba(22,163,74,0.2)"
                      : "rgba(15,23,42,0.9)",
                  color: mode === m ? "#bbf7d0" : "#e5e7eb",
                  cursor: "pointer",
                }}
              >
                {m}
              </button>
            ))}
          </div>
        </header>

        <div
          style={{
            flex: 1,
            borderRadius: 12,
            border: "1px solid rgba(51,65,85,0.9)",
            background: "rgba(15,23,42,0.9)",
            padding: 10,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              paddingRight: 4,
              marginBottom: 8,
              fontSize: 13,
            }}
          >
            {messages.length === 0 && (
              <div
                style={{
                  color: "#6b7280",
                  fontStyle: "italic",
                }}
              >
                Start a conversation with Elaira or switch target to Prime Forge
                or Swarm.
              </div>
            )}
            {messages.map((m, idx) => (
              <div
                key={idx}
                style={{
                  marginBottom: 6,
                  display: "flex",
                  flexDirection: "column",
                  alignItems:
                    m.from === "you" ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    maxWidth: "90%",
                    padding: "6px 9px",
                    borderRadius: 10,
                    background:
                      m.from === "you"
                        ? "rgba(37,99,235,0.9)"
                        : "rgba(15,23,42,0.95)",
                    color: "#e5e7eb",
                    border:
                      m.from === "you"
                        ? "1px solid rgba(59,130,246,0.9)"
                        : "1px solid rgba(55,65,81,0.9)",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  <span
                    style={{
                      fontSize: 11,
                      opacity: 0.8,
                      display: "block",
                      marginBottom: 2,
                    }}
                  >
                    {m.from === "you"
                      ? "You"
                      : m.from === "elaira"
                      ? "Elaira"
                      : m.from === "prime"
                      ? "Prime Forge"
                      : "Swarm"}
                  </span>
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              gap: 8,
              marginTop: 4,
            }}
          >
            <input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Type to Elaira / Prime Forge / Swarm..."
              style={{
                flex: 1,
                padding: "7px 9px",
                borderRadius: 999,
                border: "1px solid rgba(75,85,99,0.9)",
                background: "rgba(15,23,42,0.95)",
                color: "#e5e7eb",
                fontSize: 13,
              }}
            />
            <button
              onClick={sendChat}
              disabled={isSending}
              style={{
                padding: "7px 14px",
                borderRadius: 999,
                border: "none",
                background:
                  "linear-gradient(135deg, #22c55e, #0ea5e9, #a855f7)",
                color: "#020617",
                fontWeight: 600,
                fontSize: 13,
                cursor: "pointer",
                opacity: isSending ? 0.6 : 1,
              }}
            >
              {isSending ? "Sending..." : "Send"}
            </button>
          </div>
        </div>

        <div
          style={{
            marginTop: 10,
            display: "flex",
            gap: 8,
            fontSize: 11,
            color: "#9ca3af",
          }}
        >
          <span>Target:</span>
          {(["elaira", "prime", "swarm"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTarget(t)}
              style={{
                padding: "4px 8px",
                borderRadius: 999,
                border:
                  target === t
                    ? "1px solid rgba(59,130,246,0.9)"
                    : "1px solid rgba(75,85,99,0.9)",
                background:
                  target === t
                    ? "rgba(37,99,235,0.25)"
                    : "rgba(15,23,42,0.9)",
                color: "#e5e7eb",
                cursor: "pointer",
                textTransform: "capitalize",
              }}
            >
              {t === "prime" ? "Prime Forge" : t}
            </button>
          ))}
        </div>
      </section>

      {/* Right: Prime Forge multi-AI + avatars */}
      <section
        style={{
          borderRadius: 16,
          border: "1px solid rgba(148,163,184,0.4)",
          background:
            "radial-gradient(circle at top right, rgba(34,197,94,0.25), transparent 55%), rgba(15,23,42,0.96)",
          padding: 16,
          display: "flex",
          flexDirection: "column",
          minHeight: 420,
        }}
      >
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <div>
            <div style={{ fontSize: 16, fontWeight: 600 }}>
              Prime Forge / AI7
            </div>
            <div style={{ fontSize: 12, color: "#9ca3af" }}>
              Multi‑AI fan‑out · Sight · Creation
            </div>
          </div>
          <div
            style={{
              fontSize: 11,
              color: "#9ca3af",
              textAlign: "right",
            }}
          >
            <div>V3 core · V4 external</div>
            <div>Swarm‑aware routing via /api</div>
          </div>
        </header>

        <div
          style={{
            display: "grid",
            gridTemplateRows: "minmax(0, 1.1fr) minmax(0, 1.1fr)",
            gap: 10,
            flex: 1,
          }}
        >
          {/* Multi-AI results placeholder */}
          <div
            style={{
              borderRadius: 12,
              border: "1px solid rgba(51,65,85,0.9)",
              background: "rgba(15,23,42,0.9)",
              padding: 10,
              fontSize: 13,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                marginBottom: 6,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontWeight: 500 }}>Multi‑AI Responses</span>
              <span style={{ fontSize: 11, color: "#9ca3af" }}>
                (wired to /api/chat + provider.ts)
              </span>
            </div>
            <div
              style={{
                flex: 1,
                borderRadius: 8,
                border: "1px dashed rgba(75,85,99,0.9)",
                padding: 8,
                color: "#6b7280",
                fontSize: 12,
              }}
            >
              This panel will show parallel responses from multiple AI
              backends (OpenAI, Azure, V4, etc.) once provider fan‑out is
              wired. For now, it shares the same chat stream as the left
              panel.
            </div>
          </div>

          {/* Avatar generation */}
          <div
            style={{
              borderRadius: 12,
              border: "1px solid rgba(51,65,85,0.9)",
              background: "rgba(15,23,42,0.9)",
              padding: 10,
              fontSize: 13,
              display: "grid",
              gridTemplateColumns: "minmax(0, 1.1fr) minmax(0, 1.1fr)",
              gap: 10,
              alignItems: "stretch",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <div style={{ fontWeight: 500 }}>Avatar Generation</div>
              <div
                style={{
                  fontSize: 11,
                  color: "#9ca3af",
                }}
              >
                Let Elaira or Prime Forge design their own 2D / 3D avatar
                (robotic form reserved for future hardware).
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 6,
                  fontSize: 11,
                  marginTop: 4,
                }}
              >
                {(["2d", "3d", "robotic"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setAvatarMode(m)}
                    style={{
                      padding: "4px 8px",
                      borderRadius: 999,
                      border:
                        avatarMode === m
                          ? "1px solid rgba(249,115,22,0.9)"
                          : "1px solid rgba(75,85,99,0.9)",
                      background:
                        avatarMode === m
                          ? "rgba(249,115,22,0.2)"
                          : "rgba(15,23,42,0.9)",
                      color: "#e5e7eb",
                      cursor: "pointer",
                      textTransform: "capitalize",
                    }}
                  >
                    {m === "robotic" ? "Robotic (future)" : m.toUpperCase()}
                  </button>
                ))}
              </div>
              <textarea
                value={avatarPrompt}
                onChange={(e) => setAvatarPrompt(e.target.value)}
                placeholder="Describe the avatar Elaira or Prime Forge wants to inhabit..."
                rows={4}
                style={{
                  marginTop: 6,
                  resize: "vertical",
                  padding: 8,
                  borderRadius: 8,
                  border: "1px solid rgba(75,85,99,0.9)",
                  background: "rgba(15,23,42,0.95)",
                  color: "#e5e7eb",
                  fontSize: 13,
                }}
              />
              <button
                onClick={generateAvatar}
                disabled={isAvatarGenerating}
                style={{
                  marginTop: 4,
                  padding: "7px 12px",
                  borderRadius: 999,
                  border: "none",
                  background:
                    "linear-gradient(135deg, #f97316, #a855f7, #0ea5e9)",
                  color: "#020617",
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: "pointer",
                  opacity: isAvatarGenerating ? 0.6 : 1,
                }}
              >
                {isAvatarGenerating ? "Generating..." : "Generate Avatar"}
              </button>
              <div
                style={{
                  fontSize: 11,
                  color: "#9ca3af",
                  marginTop: 4,
                }}
              >
                Backend: POST /api/avatar → image generator (2D/3D now, robotic
                form later via robotics stack).
              </div>
            </div>

            <div
              style={{
                borderRadius: 10,
                border: "1px dashed rgba(75,85,99,0.9)",
                background:
                  "radial-gradient(circle at top, rgba(59,130,246,0.25), transparent 55%), rgba(15,23,42,0.95)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarUrl}
                  alt="Generated avatar"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <div
                  style={{
                    textAlign: "center",
                    fontSize: 12,
                    color: "#9ca3af",
                    padding: 10,
                  }}
                >
                  Generated avatars will appear here. 2D and 3D images are
                  supported via /api/avatar. Robotic form will eventually map
                  to a physical embodiment pipeline.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
