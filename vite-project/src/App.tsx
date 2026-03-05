import { useState, useRef, useCallback, useEffect } from "react";

const THEMES = [
  { name: "Crimson", bg: "#1a0a0a", accent: "#e63946", card: "#2d1010", text: "#fff" },
  { name: "Ocean", bg: "#0a1628", accent: "#0096c7", card: "#0d2137", text: "#fff" },
  { name: "Forest", bg: "#0d1f0f", accent: "#52b788", card: "#142616", text: "#fff" },
  { name: "Gold", bg: "#1a1400", accent: "#f4a827", card: "#2a2000", text: "#fff" },
  { name: "Slate", bg: "#f5f5f5", accent: "#333333", card: "#e8e8e8", text: "#111" },
];

const Field = ({ label, children }) => (
  <div style={{ marginBottom: 16 }}>
    <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#888", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>{label}</label>
    {children}
  </div>
);

const Input = (props) => (
  <input {...props}
    style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e5e5e5", borderRadius: 8, fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit", transition: "border 0.15s", ...props.style }}
    onFocus={e => e.target.style.borderColor = "#999"}
    onBlur={e => e.target.style.borderColor = "#e5e5e5"}
  />
);

const Textarea = (props) => (
  <textarea {...props}
    style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e5e5e5", borderRadius: 8, fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit", resize: "vertical", minHeight: 72, transition: "border 0.15s", ...props.style }}
    onFocus={e => e.target.style.borderColor = "#999"}
    onBlur={e => e.target.style.borderColor = "#e5e5e5"}
  />
);

export default function App() {
  const [img, setImg] = useState(null);
  const [logo, setLogo] = useState(null);
  const [name, setName] = useState("The Golden Fork");
  const [address, setAddress] = useState("123 Main St, New York, NY");
  const [phone, setPhone] = useState("+1 987 654 3210");
  const [headline, setHeadline] = useState("50% OFF All Mains!");
  const [details, setDetails] = useState("Dine in with us and enjoy half price on our entire main course menu. Valid for tables of up to 6 guests.");
  const [validDates, setValidDates] = useState("Mon – Thu, 5pm – 9pm");
  const [qr, setQr] = useState(null);
  const [theme, setTheme] = useState(THEMES[0]);
  const [dragging, setDragging] = useState(false);

  const fileRef = useRef();
  const qrRef = useRef();
  const logoRef = useRef();
  const posterRef = useRef();

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  const readFile = (file, setter) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = e => setter(e.target.result);
    reader.readAsDataURL(file);
  };

  const onDrop = useCallback(e => {
    e.preventDefault();
    setDragging(false);
    readFile(e.dataTransfer.files[0], setImg);
  }, []);

  const downloadPoster = () => {
    const el = posterRef.current;
    if (!el) return;
    const run = async () => {
      const canvas = await window.html2canvas(el, { scale: 2, useCORS: true, backgroundColor: null });
      const link = document.createElement("a");
      link.download = `${name || "poster"}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
    if (window.html2canvas) {
      run();
    } else {
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
      script.onload = run;
      document.head.appendChild(script);
    }
  };

  const t = theme;

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'Inter', system-ui, sans-serif", background: "#fafafa", overflow: "hidden" }}>

      {/* LEFT PANEL */}
      <div style={{ width: 320, minWidth: 300, background: "#fff", borderRight: "1.5px solid #ececec", overflowY: "auto", padding: "28px 24px", display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 24, color: "#111" }}>🍽 Poster Editor</div>

        <Field label="Brand Icon / Logo">
          <div onClick={() => logoRef.current.click()}
            style={{ border: "2px dashed #ddd", borderRadius: 10, padding: "12px", textAlign: "center", cursor: "pointer", background: "#fafafa", display: "flex", alignItems: "center", gap: 12 }}>
            {logo
              ? <img src={logo} alt="Logo" style={{ width: 48, height: 48, objectFit: "contain", borderRadius: 6 }} />
              : <div style={{ width: 48, height: 48, background: "#eee", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>🏷</div>
            }
            <div style={{ color: "#aaa", fontSize: 12 }}>{logo ? "Click to change logo" : "Click to upload brand icon"}</div>
            <input ref={logoRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => readFile(e.target.files[0], setLogo)} />
          </div>
          {logo && <button onClick={() => setLogo(null)} style={{ marginTop: 6, fontSize: 11, color: "#999", background: "none", border: "none", cursor: "pointer" }}>✕ Remove logo</button>}
        </Field>

        <Field label="Restaurant Image">
          <div
            onClick={() => fileRef.current.click()}
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            style={{ border: `2px dashed ${dragging ? "#333" : "#ddd"}`, borderRadius: 10, padding: "18px 12px", textAlign: "center", cursor: "pointer", background: dragging ? "#f5f5f5" : "#fafafa", transition: "all 0.15s" }}
          >
            {img
              ? <img src={img} alt="" style={{ width: "100%", maxHeight: 120, objectFit: "cover", borderRadius: 6 }} />
              : <div style={{ color: "#aaa", fontSize: 13 }}><div style={{ fontSize: 28, marginBottom: 6 }}>📷</div>Click or drag & drop an image</div>
            }
            <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => readFile(e.target.files[0], setImg)} />
          </div>
          {img && <button onClick={() => setImg(null)} style={{ marginTop: 6, fontSize: 11, color: "#999", background: "none", border: "none", cursor: "pointer" }}>✕ Remove image</button>}
        </Field>

        <Field label="Restaurant Name">
          <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. The Golden Fork" />
        </Field>
        <Field label="Address">
          <Input value={address} onChange={e => setAddress(e.target.value)} placeholder="e.g. 123 Main St, New York" />
        </Field>
        <Field label="Phone Number">
          <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="e.g. +1 519 995 9492" />
        </Field>
        <Field label="Offer Headline">
          <Input value={headline} onChange={e => setHeadline(e.target.value)} placeholder="e.g. 50% OFF All Mains!" />
        </Field>
        <Field label="Offer Details">
          <Textarea value={details} onChange={e => setDetails(e.target.value)} placeholder="Describe the offer..." />
        </Field>
        <Field label="Valid Dates / Times">
          <Input value={validDates} onChange={e => setValidDates(e.target.value)} placeholder="e.g. Mon–Thu, 5pm–9pm" />
        </Field>

        <Field label="QR Code (link to your website)">
          <div onClick={() => qrRef.current.click()}
            style={{ border: "2px dashed #ddd", borderRadius: 10, padding: "14px 12px", textAlign: "center", cursor: "pointer", background: "#fafafa" }}>
            {qr
              ? <img src={qr} alt="QR" style={{ width: 80, height: 80, objectFit: "contain" }} />
              : <div style={{ color: "#aaa", fontSize: 13 }}><div style={{ fontSize: 24, marginBottom: 4 }}>⬛</div>Click to upload QR code</div>
            }
            <input ref={qrRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => readFile(e.target.files[0], setQr)} />
          </div>
          {qr && <button onClick={() => setQr(null)} style={{ marginTop: 6, fontSize: 11, color: "#999", background: "none", border: "none", cursor: "pointer" }}>✕ Remove QR</button>}
        </Field>

        <Field label="Color Theme">
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {THEMES.map(th => (
              <button key={th.name} onClick={() => setTheme(th)} title={th.name}
                style={{ width: 32, height: 32, borderRadius: "50%", background: th.accent, border: theme.name === th.name ? "3px solid #333" : "3px solid transparent", cursor: "pointer", transition: "border 0.15s" }}
              />
            ))}
          </div>
        </Field>

        <button onClick={downloadPoster}
          style={{ marginTop: 12, padding: "12px", background: "#111", color: "#fff", border: "none", borderRadius: 10, fontWeight: 600, fontSize: 14, cursor: "pointer", width: "100%" }}>
          ⬇ Download Poster
        </button>
      </div>

      {/* RIGHT PANEL */}
      <div style={{ flex: 1, overflowY: "auto", background: "#e8e8e8", display: "flex", justifyContent: "center", alignItems: "flex-start", padding: "40px 40px 60px" }}>
        <div ref={posterRef} style={{ width: 540, background: t.bg, boxShadow: "0 8px 40px rgba(0,0,0,0.22)", fontFamily: "system-ui, sans-serif" }}>

          {/* Top accent bar */}
          <div style={{ height: 8, background: t.accent }} />

          {/* Header */}
          <div style={{ background: t.card, padding: "22px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${t.accent}33` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 52, height: 52, borderRadius: 10, background: logo ? "transparent" : `${t.accent}22`, border: `2px dashed ${t.accent}66`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden" }}>
                {logo
                  ? <img src={logo} alt="Logo" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                  : <span style={{ fontSize: 20 }}>🏷</span>
                }
              </div>
              <div>
                <div style={{ color: t.accent, fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", marginBottom: 4 }}>Special Offer</div>
                <div style={{ color: t.text, fontSize: 22, fontWeight: 800, letterSpacing: -0.5 }}>{name || "Restaurant Name"}</div>
              </div>
            </div>
            <div style={{ color: t.text, opacity: 0.5, fontSize: 11, textAlign: "right", lineHeight: 1.8 }}>
              <div>{address}</div>
              {phone && <div>{phone}</div>}
            </div>
          </div>

          {/* Hero Image */}
          <div style={{ width: "100%", height: 280, background: "#111", position: "relative", overflow: "hidden" }}>
            {img
              ? <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#444", gap: 8 }}>
                  <div style={{ fontSize: 36 }}>📷</div>
                  <div style={{ fontSize: 13 }}>No image uploaded</div>
                </div>
            }
            <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to bottom, transparent 50%, ${t.bg}cc 100%)` }} />
          </div>

          {/* Headline */}
          <div style={{ background: t.accent, padding: "28px 40px", textAlign: "center" }}>
            <div style={{ color: "#fff", fontSize: 36, fontWeight: 900, letterSpacing: -1, lineHeight: 1.1}}>
              {headline || "Your Offer Here"}
            </div>
          </div>

          {/* Body */}
          <div style={{ padding: "32px 40px" }}>
            <p style={{ color: t.text, opacity: 0.85, fontSize: 15, lineHeight: 1.8, margin: "0 0 28px", borderLeft: `3px solid ${t.accent}`, paddingLeft: 16 }}>
              {details || "Offer details will appear here."}
            </p>

            <div style={{ display: "flex", gap: 16, alignItems: "stretch" }}>
              {validDates && (
                <div style={{ flex: 1, background: t.card, borderRadius: 4, padding: "16px 20px", borderTop: `3px solid ${t.accent}` }}>
                  <div style={{ color: t.accent, fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>Valid</div>
                  <div style={{ color: t.text, fontSize: 14, lineHeight: 1.5 }}>{validDates}</div>
                </div>
              )}
              {qr && (
                <div style={{ background: t.card, borderRadius: 4, padding: "14px 20px", display: "flex", alignItems: "center", gap: 14, borderTop: `3px solid ${t.accent}` }}>
                  <img src={qr} alt="QR Code" style={{ width: 64, height: 64, objectFit: "contain", background: "#fff", padding: 4, borderRadius: 4 }} />
                  <div>
                    <div style={{ color: t.accent, fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>Scan to visit us</div>
                    <div style={{ color: t.text, opacity: 0.65, fontSize: 11, lineHeight: 1.5 }}>Point your camera to open our website</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer / Watermark */}
          <div style={{ background: t.card, borderTop: `1px solid ${t.accent}33`, padding: "14px 40px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ color: t.text, opacity: 0.35, fontSize: 10, letterSpacing: 0.5 }}>
            Designed by:  Jay Modi &nbsp;&middot;&nbsp; jaymodi35@gmail.com
            </div>
            <div style={{ width: 24, height: 3, background: t.accent, borderRadius: 2 }} />
          </div>

          {/* Bottom accent bar */}
          <div style={{ height: 8, background: t.accent }} />
        </div>
      </div>
    </div>
  );
}
