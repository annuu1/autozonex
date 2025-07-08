import React, { useState, useMemo } from "react";
import RRSelector from "./components/RRSelector";
import PositionSizer from "./components/PositionSizer";
import MessagePreview from "./components/MessagePreview";

const CAPS = [50, 150, 250, 500];

// Channel IDs visible to user
const TELEGRAM_CHANNELS = [
  { id: "-1002041280613", name: "Premium Channel" },
  { id: "-1002187821708", name: "Premium Chats" },
  { id: "-1002384605356", name: "Equity" },
  { id: "-1002269659948", name: "Algo Pulse" },
  { id: "671330725", name: "Nirmal" },
];

// Tracker channel (not shown in UI, always receives all messages)
const TRACKER_CHANNEL_ID = "5508787501";

const TG_BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;

export default function Tool() {
  const [note, setNote] = useState("");

  // Validation state
  const [validationError, setValidationError] = useState("");
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

  // State for sending feedback
  const [sending, setSending] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Compose the message in a bold, attractive, icon-rich, and all-caps format for Telegram
  const getMessage = () => {
    const upper = (v) => (v || "").toString().toUpperCase();
    const ps = Object.entries(qtyPerCap)
      .map(([cap, qty]) => `${cap}(${qty}QTY)`).join(", ");
    let msg =
      `*🚀 TRADE ALERT 🚀*\n\n` +
      `*📈 SYMBOL:* ${upper(symbol)}\n` +
      `*💰 ENTRY:* ${upper(entry)}\n` +
      `*🛑 SL:* ${upper(sl)}\n` +
      `*🎯 TGT:* ${upper(tgt)}\n` +
      `\n*📦 POS SIZING:* ${upper(ps)}`;
    if (note && note.trim()) {
      msg += `\n\n*📝 NOTE:* ${note.trim().toUpperCase()}`;
    }
    return msg;
  };

  // For preview, show the formatted message (Telegram Markdown)
  const getPreviewMessage = getMessage; // For now, same as sent message

  // Send message to one or more chat IDs
  const sendToTelegram = async (chatIds) => {
    // Validation: symbol and entry must not be empty
    if (!symbol.trim() || !entry.trim()) {
      setValidationError("Symbol and Entry Price are required.");
      setTimeout(() => setValidationError(""), 2500);
      return;
    }
    setSending(true);
    setSuccessMsg("");
    setErrorMsg("");
    setValidationError("");
    const msg = getMessage();
    // Always send to tracker channel (not shown in UI)
    const uniqueChatIds = Array.from(new Set([TRACKER_CHANNEL_ID, ...chatIds]));
    try {
      for (const chatId of uniqueChatIds) {
        const url = `https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`;
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: msg,
            parse_mode: "Markdown"
          })
        });
        if (!res.ok) throw new Error(`Failed to send to chat ${chatId}`);
      }
      setSuccessMsg(uniqueChatIds.length > 1 ? "Message sent to all channels!" : "Message sent!");
    } catch (err) {
      setErrorMsg(err.message || "Failed to send message.");
    } finally {
      setSending(false);
    }
  };



  return (
    <div className="max-w-2xl mx-auto my-10 p-8 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-blue-700">Trading Tool</h2>
      <form className="flex flex-wrap gap-8" onSubmit={e => e.preventDefault()}>
        <div className="flex-1 min-w-[320px]">
          <div className="mb-4">
            <label className="block font-medium mb-1">Stock Symbol <span className="text-red-500">*</span></label>
            <input value={symbol} onChange={e => setSymbol(e.target.value)} className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="e.g. RELIANCE" required />
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-1">Entry Price <span className="text-red-500">*</span></label>
            <input type="number" value={entry} onChange={e => setEntry(e.target.value)} className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="e.g. 2500" required />
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-1">SL Price</label>
            <input type="number" value={sl} onChange={e => setSL(e.target.value)} className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="e.g. 2480" />
          </div>
          <RRSelector rr={rr} setRR={setRR} />
          <div className="mb-4">
            <label className="block font-medium mb-1">Target Price</label>
            <input type="number" value={tgt} readOnly className="w-full px-3 py-2 border rounded bg-gray-100" />
          </div>
          <PositionSizer sl={sl} qtyPerCap={qtyPerCap} />
          <div className="mb-4">
            <label className="block font-medium mb-1">Note</label>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 min-h-[48px]"
              placeholder="Any additional note (optional)"
              rows={2}
            />
          </div>
        </div>
        <div className="flex-1 min-w-[320px] flex flex-col gap-4">
           <MessagePreview symbol={symbol} entry={entry} sl={sl} tgt={tgt} qtyPerCap={qtyPerCap} note={note} formattedMessage={getPreviewMessage()} />
          <div className="flex flex-wrap gap-3 mt-6">
            {TELEGRAM_CHANNELS.map((ch) => (
              <button
                key={ch.id}
                type="button"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold shadow disabled:opacity-60"
                disabled={sending || !symbol.trim() || !entry.trim()}
                onClick={() => sendToTelegram([ch.id])}
              >
                Send to {ch.name}
              </button>
            ))}
            <button
              type="button"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-semibold shadow disabled:opacity-60"
              disabled={sending || !symbol.trim() || !entry.trim()}
              onClick={() => sendToTelegram(TELEGRAM_CHANNELS.map(ch => ch.id))}
            >
              Send to All Channels
            </button>
          </div>
          {validationError && <div className="mt-3 text-red-600 font-medium">{validationError}</div>}
          {sending && <div className="mt-3 text-blue-600 font-medium">Sending...</div>}
          {successMsg && <div className="mt-3 text-green-600 font-medium">{successMsg}</div>}
          {errorMsg && <div className="mt-3 text-red-600 font-medium">{errorMsg}</div>}
        </div>
      </form>
    </div>
  );
}
