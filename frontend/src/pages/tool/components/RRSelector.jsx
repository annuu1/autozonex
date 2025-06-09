import React from "react";

const PRESETS = [
  { label: "1:2", value: 2 },
  { label: "1:2.5", value: 2.5 },
  { label: "1:3", value: 3 },
];

export default function RRSelector({ rr, setRR }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ fontWeight: 500 }}>Risk:Reward</label>
      <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
        {PRESETS.map((preset) => (
          <button
            key={preset.label}
            type="button"
            style={{
              background: rr === preset.value ? "#007bff" : "#eee",
              color: rr === preset.value ? "#fff" : "#333",
              border: "none",
              borderRadius: 4,
              padding: "4px 12px",
              cursor: "pointer",
            }}
            onClick={() => setRR(preset.value)}
          >
            {preset.label}
          </button>
        ))}
        <input
          type="number"
          step="0.1"
          min="1"
          placeholder="Custom"
          value={rr && !PRESETS.some((p) => p.value === rr) ? rr : ""}
          onChange={(e) => setRR(Number(e.target.value) || 1)}
          style={{ width: 70, marginLeft: 8 }}
        />
      </div>
    </div>
  );
}
