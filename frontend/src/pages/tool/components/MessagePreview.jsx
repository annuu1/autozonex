import React from "react";

export default function MessagePreview({ symbol, entry, sl, tgt, qtyPerCap, note, formattedMessage }) {
  // Render the formatted Telegram message if provided
  return (
    <div className="bg-[#f8f9fa] p-4 rounded-lg min-h-[120px]">
      <div className="font-semibold mb-2">Message Preview</div>
      <pre className="whitespace-pre-wrap font-mono text-sm" style={{ margin: 0 }}>
        {formattedMessage ? formattedMessage : (() => {
          const ps = Object.entries(qtyPerCap || {})
            .map(([cap, qty]) => `${cap}(${qty}qty)`).join(", ");
          return `symbol - ${symbol || ""},\nentry- ${entry || ""}\nsl- ${sl || ""}\ntgt- ${tgt || ""}\n\nPS- ${ps}${note ? `\n\nNote: ${note}` : ""}`;
        })()}
      </pre>
      <div className="mt-2 text-xs text-gray-500">This is how your message will appear on Telegram.</div>
    </div>
  );
}

