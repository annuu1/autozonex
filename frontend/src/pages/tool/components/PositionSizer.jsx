import React from "react";

const CAPS = [50, 150, 250, 500];

export default function PositionSizer({ sl, qtyPerCap }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ fontWeight: 500 }}>Position Sizing</label>
      <div style={{ display: "flex", gap: 16, marginTop: 4 }}>
        {CAPS.map((cap) => (
          <span key={cap} style={{ background: "#f5f5f5", padding: "2px 8px", borderRadius: 4 }}>
            {cap} ({qtyPerCap[cap] || 0} qty)
          </span>
        ))}
      </div>
    </div>
  );
}
