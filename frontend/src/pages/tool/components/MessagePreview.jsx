import React from "react";

export default function MessagePreview({ symbol, entry, sl, tgt, qtyPerCap }) {
  const ps = Object.entries(qtyPerCap)
    .map(([cap, qty]) => `${cap}(${qty}qty)`).join(", ");
  return (
    <div style={{ background: "#f8f9fa", padding: 16, borderRadius: 8, minHeight: 120 }}>
      <div style={{ fontWeight: 600, marginBottom: 8 }}>Message Preview</div>
      <pre style={{ margin: 0, fontFamily: "inherit" }}>{
        `symbol - ${symbol || ""},\nentry- ${entry || ""}\nsl- ${sl || ""}\ntgt- ${tgt || ""}\n\nPS- ${ps}`
      }</pre>
    </div>
  );
}
