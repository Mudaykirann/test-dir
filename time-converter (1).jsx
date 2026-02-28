import { useState, useEffect } from "react";

const ZONES = [
  { label: "UTC", tz: "UTC" },
  { label: "New York", tz: "America/New_York" },
  { label: "Los Angeles", tz: "America/Los_Angeles" },
  { label: "London", tz: "Europe/London" },
  { label: "Berlin", tz: "Europe/Berlin" },
  { label: "Dubai", tz: "Asia/Dubai" },
  { label: "Mumbai", tz: "Asia/Kolkata" },
  { label: "Singapore", tz: "Asia/Singapore" },
  { label: "Tokyo", tz: "Asia/Tokyo" },
  { label: "Sydney", tz: "Australia/Sydney" },
];

function getOffset(tz, date) {
  const utc = new Date(date.toLocaleString("en-US", { timeZone: "UTC" }));
  const local = new Date(date.toLocaleString("en-US", { timeZone: tz }));
  const diff = (local - utc) / 3600000;
  const sign = diff >= 0 ? "+" : "-";
  const abs = Math.abs(diff);
  const h = Math.floor(abs);
  const m = Math.round((abs - h) * 60);
  return `UTC${sign}${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function formatTime(date, tz) {
  return date.toLocaleTimeString("en-US", {
    timeZone: tz,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

function formatDate(date, tz) {
  return date.toLocaleDateString("en-US", {
    timeZone: tz,
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function getHour(date, tz) {
  return parseInt(
    date.toLocaleString("en-US", { timeZone: tz, hour: "numeric", hour12: false })
  );
}

function isDaytime(hour) {
  return hour >= 6 && hour < 20;
}

export default function TimeConverter() {
  const [now, setNow] = useState(new Date());
  const [unixInput, setUnixInput] = useState("");
  const [isoInput, setIsoInput] = useState("");
  const [parsedDate, setParsedDate] = useState(null);
  const [parseError, setParseError] = useState("");
  const [copied, setCopied] = useState("");
  const [activeTab, setActiveTab] = useState("live"); // live | convert

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const displayDate = parsedDate || now;

  const handleUnixParse = () => {
    const ts = parseInt(unixInput);
    if (isNaN(ts)) return setParseError("Invalid Unix timestamp");
    const d = new Date(ts * (unixInput.length <= 10 ? 1000 : 1));
    if (isNaN(d)) return setParseError("Could not parse");
    setParseError("");
    setParsedDate(d);
    setIsoInput(d.toISOString());
    setActiveTab("convert");
  };

  const handleIsoParse = () => {
    const d = new Date(isoInput);
    if (isNaN(d)) return setParseError("Invalid ISO date string");
    setParseError("");
    setParsedDate(d);
    setUnixInput(Math.floor(d.getTime() / 1000).toString());
    setActiveTab("convert");
  };

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(""), 1500);
  };

  const useNow = () => {
    setParsedDate(null);
    setUnixInput(Math.floor(now.getTime() / 1000).toString());
    setIsoInput(now.toISOString());
    setParseError("");
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0f",
      fontFamily: "'Courier New', monospace",
      color: "#e0e0e0",
      padding: "0",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Oxanium:wght@300;400;600;700&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .app-header {
          border-bottom: 1px solid #1e1e2e;
          padding: 24px 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #0a0a0f;
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .logo {
          font-family: 'Oxanium', sans-serif;
          font-weight: 700;
          font-size: 20px;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: #00ff88;
        }

        .logo span { color: #555; }

        .live-clock {
          font-family: 'Share Tech Mono', monospace;
          font-size: 13px;
          color: #555;
        }

        .container {
          max-width: 960px;
          margin: 0 auto;
          padding: 40px 24px;
        }

        .tabs {
          display: flex;
          gap: 0;
          border: 1px solid #1e1e2e;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 32px;
          width: fit-content;
        }

        .tab {
          padding: 10px 24px;
          font-family: 'Oxanium', sans-serif;
          font-size: 12px;
          letter-spacing: 2px;
          text-transform: uppercase;
          background: transparent;
          border: none;
          cursor: pointer;
          color: #555;
          transition: all 0.2s;
        }

        .tab.active {
          background: #00ff88;
          color: #0a0a0f;
          font-weight: 700;
        }

        .tab:not(.active):hover { background: #1e1e2e; color: #e0e0e0; }

        .input-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 16px;
        }

        .input-group label {
          display: block;
          font-family: 'Oxanium', sans-serif;
          font-size: 11px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #555;
          margin-bottom: 8px;
        }

        .input-wrap {
          display: flex;
          gap: 8px;
        }

        .input-wrap input {
          flex: 1;
          background: #111118;
          border: 1px solid #1e1e2e;
          border-radius: 3px;
          padding: 10px 14px;
          font-family: 'Share Tech Mono', monospace;
          font-size: 13px;
          color: #e0e0e0;
          outline: none;
          transition: border-color 0.2s;
        }

        .input-wrap input:focus { border-color: #00ff88; }

        .btn {
          background: #111118;
          border: 1px solid #1e1e2e;
          border-radius: 3px;
          padding: 10px 16px;
          font-family: 'Oxanium', sans-serif;
          font-size: 11px;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: #00ff88;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s;
        }

        .btn:hover { background: #00ff88; color: #0a0a0f; border-color: #00ff88; }

        .btn-now {
          background: transparent;
          border: 1px solid #00ff8844;
          border-radius: 3px;
          padding: 8px 16px;
          font-family: 'Oxanium', sans-serif;
          font-size: 11px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #00ff88;
          cursor: pointer;
          margin-bottom: 24px;
          transition: all 0.2s;
        }

        .btn-now:hover { background: #00ff8811; }

        .error { color: #ff4466; font-size: 12px; margin-top: 8px; font-family: 'Share Tech Mono', monospace; }

        .section-label {
          font-family: 'Oxanium', sans-serif;
          font-size: 11px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #333;
          margin-bottom: 16px;
          margin-top: 32px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .section-label::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #1e1e2e;
        }

        .zones-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1px;
          background: #1e1e2e;
          border: 1px solid #1e1e2e;
          border-radius: 4px;
          overflow: hidden;
        }

        .zone-card {
          background: #0d0d15;
          padding: 16px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          transition: background 0.15s;
          position: relative;
        }

        .zone-card:hover { background: #111118; }
        .zone-card:hover .copy-hint { opacity: 1; }

        .zone-card.night { opacity: 0.65; }

        .zone-left {}

        .zone-city {
          font-family: 'Oxanium', sans-serif;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 1px;
          color: #aaa;
          margin-bottom: 2px;
        }

        .zone-offset {
          font-family: 'Share Tech Mono', monospace;
          font-size: 11px;
          color: #333;
        }

        .zone-right { text-align: right; }

        .zone-time {
          font-family: 'Share Tech Mono', monospace;
          font-size: 22px;
          color: #e0e0e0;
          letter-spacing: 1px;
        }

        .zone-time.day { color: #00ff88; }

        .zone-date {
          font-family: 'Share Tech Mono', monospace;
          font-size: 11px;
          color: #444;
          margin-top: 2px;
        }

        .copy-hint {
          position: absolute;
          top: 8px;
          right: 8px;
          font-family: 'Oxanium', sans-serif;
          font-size: 9px;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: #333;
          opacity: 0;
          transition: opacity 0.2s;
        }

        .unix-bar {
          background: #111118;
          border: 1px solid #1e1e2e;
          border-radius: 4px;
          padding: 14px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
          gap: 16px;
          flex-wrap: wrap;
        }

        .unix-val {
          font-family: 'Share Tech Mono', monospace;
          font-size: 15px;
          color: #00ff88;
          letter-spacing: 2px;
        }

        .unix-label {
          font-family: 'Oxanium', sans-serif;
          font-size: 10px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #444;
          margin-bottom: 4px;
        }

        .copy-btn {
          background: transparent;
          border: 1px solid #1e1e2e;
          border-radius: 3px;
          padding: 6px 14px;
          font-family: 'Oxanium', sans-serif;
          font-size: 10px;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: #555;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .copy-btn:hover, .copy-btn.copied { border-color: #00ff88; color: #00ff88; }

        @media (max-width: 600px) {
          .input-row { grid-template-columns: 1fr; }
          .app-header { padding: 16px 20px; }
          .container { padding: 24px 16px; }
          .zones-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <header className="app-header">
        <div className="logo">TIME<span>/</span>ZONE</div>
        <div className="live-clock">{now.toISOString().replace("T", "  ").slice(0, 22)} UTC</div>
      </header>

      <div className="container">
        <div className="tabs">
          <button className={`tab ${activeTab === "live" ? "active" : ""}`} onClick={() => setActiveTab("live")}>Live</button>
          <button className={`tab ${activeTab === "convert" ? "active" : ""}`} onClick={() => setActiveTab("convert")}>Convert</button>
        </div>

        {activeTab === "convert" && (
          <>
            <div className="input-row">
              <div className="input-group">
                <label>Unix Timestamp</label>
                <div className="input-wrap">
                  <input
                    type="text"
                    placeholder="e.g. 1709123456"
                    value={unixInput}
                    onChange={e => setUnixInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleUnixParse()}
                  />
                  <button className="btn" onClick={handleUnixParse}>→</button>
                </div>
              </div>
              <div className="input-group">
                <label>ISO 8601 / Date String</label>
                <div className="input-wrap">
                  <input
                    type="text"
                    placeholder="e.g. 2024-02-28T10:30:00Z"
                    value={isoInput}
                    onChange={e => setIsoInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleIsoParse()}
                  />
                  <button className="btn" onClick={handleIsoParse}>→</button>
                </div>
              </div>
            </div>
            {parseError && <div className="error">⚠ {parseError}</div>}
            <button className="btn-now" onClick={useNow}>⟳ USE CURRENT TIME</button>
          </>
        )}

        {/* Quick copy bar */}
        <div className="unix-bar">
          <div>
            <div className="unix-label">Unix (seconds)</div>
            <div className="unix-val">{Math.floor(displayDate.getTime() / 1000)}</div>
          </div>
          <button
            className={`copy-btn ${copied === "unix" ? "copied" : ""}`}
            onClick={() => copyToClipboard(Math.floor(displayDate.getTime() / 1000).toString(), "unix")}
          >{copied === "unix" ? "✓ Copied" : "Copy"}</button>

          <div>
            <div className="unix-label">ISO 8601</div>
            <div className="unix-val" style={{ fontSize: 13 }}>{displayDate.toISOString()}</div>
          </div>
          <button
            className={`copy-btn ${copied === "iso" ? "copied" : ""}`}
            onClick={() => copyToClipboard(displayDate.toISOString(), "iso")}
          >{copied === "iso" ? "✓ Copied" : "Copy"}</button>
        </div>

        <div className="section-label">All Timezones</div>

        <div className="zones-grid">
          {ZONES.map(z => {
            const hour = getHour(displayDate, z.tz);
            const day = isDaytime(hour);
            return (
              <div
                key={z.tz}
                className={`zone-card ${!day ? "night" : ""}`}
                onClick={() => copyToClipboard(formatTime(displayDate, z.tz) + " " + z.label, z.tz)}
                title="Click to copy"
              >
                <div className="copy-hint">copy</div>
                <div className="zone-left">
                  <div className="zone-city">{z.label}</div>
                  <div className="zone-offset">{getOffset(z.tz, displayDate)}</div>
                </div>
                <div className="zone-right">
                  <div className={`zone-time ${day ? "day" : ""}`}>{formatTime(displayDate, z.tz)}</div>
                  <div className="zone-date">{formatDate(displayDate, z.tz)}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 24, fontSize: 11, color: "#333", fontFamily: "'Oxanium', sans-serif", letterSpacing: 1 }}>
          {parsedDate ? `↑ Showing converted time · ` : `↑ Live · `}
          Dimmed zones = nighttime · Click any zone to copy time
        </div>
      </div>
    </div>
  );
}
