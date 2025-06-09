import React, { useState, useMemo } from "react";
import RRSelector from "./components/RRSelector";
import PositionSizer from "./components/PositionSizer";
import MessagePreview from "./components/MessagePreview";

const CAPS = [50, 150, 250, 500];

export default function Tool() {
  const [symbol, setSymbol] = useState("");
  const [entry, setEntry] = useState("");
  const [sl, setSL] = useState("");
  const [rr, setRR] = useState(2);
  const [tgt, setTgt] = useState("");
  // Auto-calculate TGT when entry, sl, or rr changes
  React.useEffect(() => {
    const e = parseFloat(entry);
    const s = parseFloat(sl);
    if (!isNaN(e) && !isNaN(s) && rr && rr > 0) {
      const risk = Math.abs(e - s);
      const target = e + (e > s ? 1 : -1) * risk * rr;
      setTgt(target.toFixed(2));
    } else {
      setTgt("");
    }
  }, [entry, sl, rr]);

  // Position sizing calculation
  const qtyPerCap = useMemo(() => {
    const e = parseFloat(entry);
    const s = parseFloat(sl);
    if (isNaN(e) || isNaN(s) || e === s) return CAPS.reduce((acc, c) => ({ ...acc, [c]: 0 }), {});
    const riskPerShare = Math.abs(e - s);
    const out = {};
    CAPS.forEach(cap => {
      out[cap] = riskPerShare ? Math.floor(cap / riskPerShare) : 0;
    });
    return out;
  }, [entry, sl]);

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", padding: 24, background: "#fff", borderRadius: 12, boxShadow: "0 2px 12px #0001" }}>
      <h2>Trading Tool</h2>
      <form style={{ display: "flex", flexWrap: "wrap", gap: 32 }} onSubmit={e => e.preventDefault()}>
        <div style={{ flex: 1, minWidth: 320 }}>
          <div style={{ marginBottom: 16 }}>
            <label>Stock Symbol</label>
            <input value={symbol} onChange={e => setSymbol(e.target.value)} style={{ width: "100%", padding: 6, marginTop: 4 }} placeholder="e.g. RELIANCE" />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label>Entry Price</label>
            <input type="number" value={entry} onChange={e => setEntry(e.target.value)} style={{ width: "100%", padding: 6, marginTop: 4 }} placeholder="e.g. 2500" />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label>SL Price</label>
            <input type="number" value={sl} onChange={e => setSL(e.target.value)} style={{ width: "100%", padding: 6, marginTop: 4 }} placeholder="e.g. 2480" />
          </div>
          <RRSelector rr={rr} setRR={setRR} />
          <div style={{ marginBottom: 16 }}>
            <label>Target Price</label>
            <input type="number" value={tgt} readOnly style={{ width: "100%", padding: 6, marginTop: 4, background: "#f2f2f2" }} />
          </div>
          <PositionSizer sl={sl} qtyPerCap={qtyPerCap} />
        </div>
        <div style={{ flex: 1, minWidth: 320 }}>
          <MessagePreview symbol={symbol} entry={entry} sl={sl} tgt={tgt} qtyPerCap={qtyPerCap} />
          <button type="button" style={{ marginTop: 24, background: "#007bff", color: "#fff", border: "none", borderRadius: 6, padding: "10px 24px", fontWeight: 600, cursor: "pointer", fontSize: 16 }} disabled>
            Send to Telegram (Coming Soon)
          </button>
        </div>
      </form>
    </div>
  );
}
